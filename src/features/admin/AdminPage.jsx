import { useAuth } from '../../hooks/useAuth'
import { SeedUtility } from './SeedUtility'

export function AdminPage() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">AIQM Admin</h1>
                <p className="text-xs text-gray-400">Content Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border-2 border-primary-500/50"
                  />
                )}
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.displayName}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-blue-400 transition-colors">View Website</p>
                <p className="text-xs text-gray-400">Open in new tab</p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl opacity-50 cursor-not-allowed">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Edit Content</p>
                <p className="text-xs text-gray-400">Coming soon</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl opacity-50 cursor-not-allowed">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Media Library</p>
                <p className="text-xs text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seed Utility */}
        <SeedUtility />
      </main>
    </div>
  )
}
