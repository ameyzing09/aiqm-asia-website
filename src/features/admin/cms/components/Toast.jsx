import { useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContext } from '../context/ToastContext'

const TOAST_ICONS = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const TOAST_STYLES = {
  success: {
    bg: 'bg-green-600',
    icon: 'bg-green-500',
    progress: 'bg-green-400',
  },
  error: {
    bg: 'bg-red-600',
    icon: 'bg-red-500',
    progress: 'bg-red-400',
  },
  info: {
    bg: 'bg-blue-600',
    icon: 'bg-blue-500',
    progress: 'bg-blue-400',
  },
}

function ToastItem({ toast, onClose }) {
  const styles = TOAST_STYLES[toast.type] || TOAST_STYLES.info
  const icon = TOAST_ICONS[toast.type] || TOAST_ICONS.info

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`${styles.bg} text-white rounded-lg shadow-2xl overflow-hidden min-w-[300px] max-w-[400px]`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <div className={`${styles.icon} p-2 rounded-full flex-shrink-0`}>
          {icon}
        </div>

        {/* Message */}
        <p className="flex-1 text-sm font-medium">{toast.message}</p>

        {/* Close Button */}
        <button
          onClick={() => onClose(toast.id)}
          className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      {toast.duration > 0 && (
        <motion.div
          className={`h-1 ${styles.progress}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

export function ToastContainer() {
  const context = useContext(ToastContext)

  if (!context) {
    return null
  }

  const { toasts, removeToast } = context

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
