import { Outlet } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { Sidebar } from './components/Sidebar'
import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/Toast'

export function CMSLayout() {
  const { user, logout } = useAuth()

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950 flex">
        {/* Decorative gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
      </div>

      {/* Fixed Sidebar */}
      <aside className="w-64 fixed left-0 top-0 h-screen bg-gray-900/50 backdrop-blur-xl border-r border-white/10 z-40">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 min-h-screen relative">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 lg:px-8 h-16">
            {/* Page title placeholder - can be set by child routes */}
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-white">Content Management</h2>
            </div>

            {/* User info & logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {user?.displayName || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
    </ToastProvider>
  )
}
