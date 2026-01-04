import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }) {
  const { user, loading, isAuthorized } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            Your email ({user.email}) is not authorized to access the admin panel.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return children
}
