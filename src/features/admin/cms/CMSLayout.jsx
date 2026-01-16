import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { Sidebar } from './components/Sidebar'
import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/Toast'

export function CMSLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      {/* Root wrapper with overflow-x-hidden to prevent horizontal scroll */}
      <div className="min-h-screen bg-gray-950 overflow-x-hidden w-full max-w-full box-border">
        {/* Decorative gradient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
        </div>

        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - slide-over on mobile, fixed on desktop */}
        <aside
          className={`w-64 fixed left-0 top-0 h-screen bg-gray-900/95 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content Area - full width on mobile, offset on desktop */}
        <main className="min-h-screen lg:ml-64">
          {/* Sticky Header */}
          <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between px-4 lg:px-8 h-16">
              {/* Hamburger + Page title */}
              <div className="flex items-center gap-3">
                {/* Hamburger button - mobile only */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Open menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
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
                    <p className="text-sm font-medium text-white">{user?.displayName || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content - overflow-x-hidden prevents horizontal scroll */}
          <div className="p-4 lg:p-8 overflow-x-hidden w-full max-w-full box-border">
            <Outlet />
          </div>
        </main>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </ToastProvider>
  )
}
