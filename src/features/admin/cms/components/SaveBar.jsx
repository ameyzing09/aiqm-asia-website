import { motion, AnimatePresence } from 'framer-motion'

/**
 * Save bar that appears when form has unsaved changes
 *
 * Behavior:
 * - Fixed at bottom of viewport, offset for sidebar
 * - Only visible when isDirty={true}
 * - Animated entry/exit via framer-motion
 * - Save button disabled when hasErrors={true}
 * - Shows conflict warning with force save option
 * - Displays last edited info for audit trail
 */
export function SaveBar({
  isDirty,
  hasErrors,
  onSave,
  onDiscard,
  isSaving = false,
  saveLabel = 'Save Changes',
  savingLabel = 'Saving...',
  // Audit trail props
  lastEditedBy,
  lastEditedAt,
  isConflict = false,
  onForceSave,
}) {
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'number') return null
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const formattedTime = formatTimestamp(lastEditedAt)

  return (
    <AnimatePresence>
      {(isDirty || isConflict) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 md:left-64 right-0 z-50"
        >
          {/* Gradient fade at top */}
          <div className="h-6 bg-gradient-to-t from-gray-900 to-transparent" />

          {/* Main bar */}
          <div className={`backdrop-blur-xl border-t px-4 py-4 ${isConflict ? 'bg-red-900/95 border-red-500/30' : 'bg-gray-900/95 border-white/10'}`}>
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Left side - Status indicator */}
              <div className="flex items-center gap-3">
                {isConflict ? (
                  // Conflict warning
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-2.5 h-2.5 bg-red-400 rounded-full"
                    />
                    <div>
                      <span className="text-sm font-medium text-red-400">
                        Conflict detected
                      </span>
                      <p className="text-xs text-red-300/70">
                        Someone else edited this content
                      </p>
                    </div>
                  </div>
                ) : (
                  // Normal unsaved changes
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-amber-400 rounded-full"
                    />
                    <span className="text-sm font-medium text-amber-400">
                      Unsaved changes
                    </span>
                    {hasErrors && (
                      <span className="text-xs text-red-400 ml-2">
                        (Fix errors before saving)
                      </span>
                    )}
                  </div>
                )}

                {/* Last edited info */}
                {lastEditedBy && formattedTime && !isConflict && (
                  <span className="hidden sm:inline text-xs text-gray-500 border-l border-white/10 pl-3">
                    Last edited by {lastEditedBy} {formattedTime}
                  </span>
                )}
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center gap-3">
                {isConflict ? (
                  // Conflict actions
                  <>
                    <button
                      type="button"
                      onClick={onDiscard}
                      className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      Discard & Reload
                    </button>
                    {onForceSave && (
                      <button
                        type="button"
                        onClick={onForceSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50"
                      >
                        {isSaving && (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        Force Save
                      </button>
                    )}
                  </>
                ) : (
                  // Normal actions
                  <>
                    <button
                      type="button"
                      onClick={onDiscard}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Discard
                    </button>

                    <button
                      type="button"
                      onClick={onSave}
                      disabled={hasErrors || isSaving}
                      className={`
                        flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm
                        transition-all duration-200
                        ${
                          hasErrors || isSaving
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }
                      `}
                    >
                      {isSaving && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {isSaving ? savingLabel : saveLabel}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
