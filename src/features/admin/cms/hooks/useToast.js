import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'

/**
 * Convert technical errors to human-readable messages
 */
export function getErrorMessage(error) {
  // Handle Firebase errors
  if (error?.code) {
    switch (error.code) {
      case 'PERMISSION_DENIED':
      case 'permission-denied':
        return "You don't have permission to make this change. Please contact the administrator."
      case 'NETWORK_ERROR':
      case 'unavailable':
        return 'Network error. Please check your internet connection and try again.'
      case 'auth/network-request-failed':
        return 'Unable to connect. Please check your internet connection.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.'
      case 'storage/unauthorized':
        return "You don't have permission to upload files."
      case 'storage/canceled':
        return 'Upload was cancelled.'
      case 'storage/unknown':
        return 'An error occurred during upload. Please try again.'
      case 'storage/quota-exceeded':
        return 'Storage quota exceeded. Please contact the administrator.'
      case 'storage/invalid-format':
        return 'Invalid file format. Please use JPG, PNG, or WebP images.'
      default:
        break
    }
  }

  // Handle common error messages
  const message = error?.message?.toLowerCase() || ''

  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.'
  }

  if (message.includes('permission') || message.includes('unauthorized')) {
    return "You don't have permission to perform this action."
  }

  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }

  if (message.includes('quota')) {
    return 'Storage limit reached. Please contact the administrator.'
  }

  // Default fallback
  return 'Something went wrong. Please try again.'
}

/**
 * Hook to access toast notifications
 * @returns {{ success: Function, error: Function, info: Function }}
 */
export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    console.warn('useToast must be used within a ToastProvider')
    return {
      success: () => {},
      error: () => {},
      info: () => {},
    }
  }

  return {
    success: context.success,
    error: context.error,
    info: context.info,
  }
}
