import { motion, AnimatePresence } from 'framer-motion'

/**
 * Floating save bar that appears when form has unsaved changes
 *
 * Behavior:
 * - Fixed at bottom of viewport
 * - Only visible when isDirty={true}
 * - Animated entry/exit via framer-motion
 * - Save button disabled when hasErrors={true}
 */
export function SaveBar({
  isDirty,
  hasErrors,
  onSave,
  onDiscard,
  isSaving = false,
  saveLabel = 'Save Changes',
  savingLabel = 'Saving...',
}) {
  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 md:left-64 right-0 z-50"
        >
          {/* Gradient fade at top */}
          <div className="h-8 bg-gradient-to-t from-gray-900/95 to-transparent" />

          {/* Main bar */}
          <div className="bg-gray-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Unsaved changes indicator */}
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

              {/* Action buttons */}
              <div className="flex items-center gap-3">
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
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
