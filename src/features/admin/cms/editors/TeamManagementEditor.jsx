import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, set, remove, serverTimestamp } from 'firebase/database'
import { db } from '../../../../services/firebase'
import { useAuth } from '../../../../hooks/useAuth'
import { ValidatedInput } from '../components/ValidatedInput'
import { MasterDetailLayout } from '../components/MasterDetailLayout'
import { useToast, getErrorMessage } from '../hooks/useToast'

/**
 * Team Management Editor
 *
 * RBAC: Only accessible to super-admin role
 * Manages the /admins/ Firebase registry
 *
 * Critical: Admins are keyed by UID, not email
 */
export function TeamManagementEditor() {
  const queryClient = useQueryClient()
  const { user, adminRole } = useAuth()
  const { success, error } = useToast()

  const [selectedAdminId, setSelectedAdminId] = useState(null)
  const [newAdminUid, setNewAdminUid] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminRole, setNewAdminRole] = useState('admin')

  // Fetch admins list from /admins/ - hooks must be called before any conditional returns
  const { data: adminsData, isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'admins'))
      return snapshot.exists() ? snapshot.val() : {}
    },
    staleTime: 30 * 1000,
  })

  // Add admin mutation
  const addAdminMutation = useMutation({
    mutationFn: async ({ uid, email, role }) => {
      await set(ref(db, `admins/${uid}`), {
        email,
        role,
        addedAt: serverTimestamp(),
        addedBy: user?.email || 'unknown',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      success('Admin added successfully!')
      setNewAdminUid('')
      setNewAdminEmail('')
      setNewAdminRole('admin')
    },
    onError: err => {
      error(getErrorMessage(err))
    },
  })

  // Update admin mutation
  const updateAdminMutation = useMutation({
    mutationFn: async ({ uid, updates }) => {
      const currentRef = ref(db, `admins/${uid}`)
      const snapshot = await get(currentRef)
      if (!snapshot.exists()) throw new Error('Admin not found')

      await set(currentRef, {
        ...snapshot.val(),
        ...updates,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || 'unknown',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      success('Admin updated successfully!')
    },
    onError: err => {
      error(getErrorMessage(err))
    },
  })

  // Delete admin mutation
  const deleteAdminMutation = useMutation({
    mutationFn: async uid => {
      await remove(ref(db, `admins/${uid}`))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      setSelectedAdminId(null)
      success('Admin removed successfully!')
    },
    onError: err => {
      error(getErrorMessage(err))
    },
  })

  // Convert admins object to array for MasterDetailLayout
  const adminsArray = useMemo(() => {
    if (!adminsData || typeof adminsData !== 'object') return []
    return Object.entries(adminsData)
      .map(([uid, admin]) => ({
        id: uid,
        uid,
        ...admin,
        name: admin.email || uid,
      }))
      .sort((a, b) => (a.email || '').localeCompare(b.email || ''))
  }, [adminsData])

  // Selected admin details
  const selectedAdmin = useMemo(() => {
    if (!selectedAdminId || !adminsData?.[selectedAdminId]) return null
    return { id: selectedAdminId, uid: selectedAdminId, ...adminsData[selectedAdminId] }
  }, [selectedAdminId, adminsData])

  // HARDENED ROUTE GUARD: Check super-admin permission (after all hooks)
  if (adminRole !== 'super-admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Permission Denied</h2>
          <p className="text-gray-400 mb-4">
            You do not have permission to access Team Management. This feature requires super-admin
            privileges.
          </p>
          <a
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  // Handle add admin
  const handleAddAdmin = async () => {
    if (!newAdminUid.trim()) {
      error('User UID is required')
      return
    }
    if (!newAdminEmail.trim()) {
      error('Email is required')
      return
    }
    if (adminsData?.[newAdminUid]) {
      error('An admin with this UID already exists')
      return
    }

    await addAdminMutation.mutateAsync({
      uid: newAdminUid.trim(),
      email: newAdminEmail.trim(),
      role: newAdminRole,
    })
  }

  // Handle role change
  const handleRoleChange = async newRole => {
    if (!selectedAdmin) return

    if (selectedAdmin.uid === user?.uid && newRole !== 'super-admin') {
      error('You cannot demote yourself')
      return
    }

    await updateAdminMutation.mutateAsync({
      uid: selectedAdmin.uid,
      updates: { role: newRole },
    })
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedAdmin) return

    if (selectedAdmin.uid === user?.uid) {
      error('You cannot remove yourself')
      return
    }

    if (
      !window.confirm(`Are you sure you want to remove ${selectedAdmin.email} from the admin list?`)
    ) {
      return
    }

    await deleteAdminMutation.mutateAsync(selectedAdmin.uid)
  }

  // Format timestamp
  const formatTimestamp = timestamp => {
    if (!timestamp) return 'Unknown'
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    return 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400 mt-1">Manage admin access to the CMS</p>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-white/10 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Team Management</h1>
        <p className="text-gray-400 mt-1">
          Manage admin access to the CMS. Admins are identified by their Firebase Auth UID.
        </p>
      </div>

      {/* Add New Admin Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Add New Admin
        </h3>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <ValidatedInput
              label="User UID"
              value={newAdminUid}
              onChange={setNewAdminUid}
              placeholder="Firebase Auth UID"
              helperText="Find this in Firebase Console > Authentication > Users"
              required
            />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <ValidatedInput
              label="Email"
              value={newAdminEmail}
              onChange={setNewAdminEmail}
              placeholder="user@example.com"
              type="email"
              required
            />
          </div>
          <div className="col-span-12 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select
              value={newAdminRole}
              onChange={e => setNewAdminRole(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            >
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>
          <div className="col-span-12 lg:col-span-2 flex items-end">
            <button
              onClick={handleAddAdmin}
              disabled={addAdminMutation.isPending || !newAdminUid.trim() || !newAdminEmail.trim()}
              className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {addAdminMutation.isPending ? 'Adding...' : 'Add Admin'}
            </button>
          </div>
        </div>
      </div>

      {/* Admin List - Master-Detail Layout */}
      <MasterDetailLayout
        items={adminsArray}
        selectedId={selectedAdminId}
        onSelect={setSelectedAdminId}
        renderListItem={(admin, isSelected) => (
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className={`font-medium truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                {admin.email || 'Unknown'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`
                  px-1.5 py-0.5 text-xs rounded
                  ${
                    admin.role === 'super-admin'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-primary-500/20 text-primary-400'
                  }
                `}
                >
                  {admin.role || 'admin'}
                </span>
                {admin.uid === user?.uid && <span className="text-xs text-gray-500">(You)</span>}
              </div>
            </div>
          </div>
        )}
        emptyMessage="No admins found"
        emptyIcon={
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        }
        detailTitle={selectedAdmin?.email}
      >
        {selectedAdmin && (
          <div className="space-y-6">
            {/* Admin Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Admin Details
              </h4>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                    {selectedAdmin.email}
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">User UID</label>
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 font-mono text-sm truncate">
                    {selectedAdmin.uid}
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <select
                    value={selectedAdmin.role || 'admin'}
                    onChange={e => handleRoleChange(e.target.value)}
                    disabled={updateAdminMutation.isPending || selectedAdmin.uid === user?.uid}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary-500/20 focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                  {selectedAdmin.uid === user?.uid && (
                    <p className="text-xs text-gray-500 mt-1">You cannot change your own role</p>
                  )}
                </div>

                <div className="col-span-12 lg:col-span-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Added</label>
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-sm">
                    <p>{formatTimestamp(selectedAdmin.addedAt)}</p>
                    {selectedAdmin.addedBy && (
                      <p className="text-xs text-gray-500 mt-1">by {selectedAdmin.addedBy}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            {selectedAdmin.uid !== user?.uid && (
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Danger Zone</p>
                    <p className="text-xs text-gray-500 mt-0.5">Remove this admin's access</p>
                  </div>
                  <button
                    onClick={handleDelete}
                    disabled={deleteAdminMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {deleteAdminMutation.isPending ? 'Removing...' : 'Remove Admin'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Self Warning */}
            {selectedAdmin.uid === user?.uid && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-amber-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  This is your account. You cannot modify your own role or remove yourself.
                </p>
              </div>
            )}
          </div>
        )}
      </MasterDetailLayout>
    </div>
  )
}
