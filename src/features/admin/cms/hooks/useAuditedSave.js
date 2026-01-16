import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update, serverTimestamp } from 'firebase/database'
import { db } from '../../../../services/firebase'
import { useAuth } from '../../../../hooks/useAuth'

/**
 * Universal Audited Save Hook
 *
 * Provides standardized save operations with:
 * - Automatic metadata injection (updatedBy, updatedAt)
 * - Optimistic locking (prevents concurrent overwrites)
 * - Server timestamps for accurate timing
 *
 * @param {string} section - Firebase path under siteContent/
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback on successful save
 * @param {Function} options.onError - Callback on error
 * @param {string[]} options.invalidateKeys - Additional query keys to invalidate
 */
export function useAuditedSave(section, options = {}) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { onSuccess, onError, invalidateKeys = [] } = options

  /**
   * Inject audit metadata into data object
   */
  const injectMetadata = data => ({
    ...data,
    _metadata: {
      updatedBy: user?.email || 'unknown',
      updatedAt: serverTimestamp(),
      updatedByUid: user?.uid || null,
    },
  })

  /**
   * Check for version conflicts (optimistic locking)
   * Returns true if data has been modified since initialTimestamp
   */
  const checkForConflict = async initialTimestamp => {
    if (!initialTimestamp) return { hasConflict: false }

    try {
      const snapshot = await get(ref(db, `siteContent/${section}/_metadata`))
      if (!snapshot.exists()) return { hasConflict: false }

      const currentMeta = snapshot.val()
      const currentTimestamp = currentMeta?.updatedAt || 0

      // If server timestamp is newer than our initial load, there's a conflict
      if (currentTimestamp > initialTimestamp) {
        return {
          hasConflict: true,
          conflictInfo: {
            lastEditor: currentMeta?.updatedBy || 'Unknown',
            lastEditedAt: currentTimestamp,
          },
        }
      }

      return { hasConflict: false }
    } catch (error) {
      console.warn('Error checking for conflicts:', error)
      return { hasConflict: false }
    }
  }

  /**
   * Main save mutation with metadata injection
   */
  const saveMutation = useMutation({
    mutationFn: async ({ data, initialTimestamp, forceOverwrite = false }) => {
      // Check for conflicts unless force overwrite
      if (!forceOverwrite && initialTimestamp) {
        const { hasConflict, conflictInfo } = await checkForConflict(initialTimestamp)
        if (hasConflict) {
          const error = new Error(
            `This content was modified by ${conflictInfo.lastEditor} while you were editing. ` +
              `Refresh to see the latest version or force save to overwrite.`
          )
          error.code = 'CONFLICT'
          error.conflictInfo = conflictInfo
          throw error
        }
      }

      // Inject metadata and save
      const dataWithMeta = injectMetadata(data)
      await update(ref(db, `siteContent/${section}`), dataWithMeta)

      return { success: true }
    },
    onSuccess: result => {
      // Invalidate standard queries
      queryClient.invalidateQueries({ queryKey: ['siteContent', section] })
      queryClient.invalidateQueries({ queryKey: [section] })

      // Invalidate additional keys
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] })
      })

      onSuccess?.(result)
    },
    onError: error => {
      onError?.(error)
    },
  })

  /**
   * Save with automatic metadata
   */
  const save = (data, initialTimestamp = null) => {
    return saveMutation.mutateAsync({ data, initialTimestamp, forceOverwrite: false })
  }

  /**
   * Force save, ignoring conflicts
   */
  const forceSave = data => {
    return saveMutation.mutateAsync({ data, initialTimestamp: null, forceOverwrite: true })
  }

  return {
    save,
    forceSave,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
    isConflict: saveMutation.error?.code === 'CONFLICT',
    conflictInfo: saveMutation.error?.conflictInfo,
  }
}

/**
 * Extract metadata timestamp from loaded data
 * Use this when initializing form data to capture the version
 */
export function getMetadataTimestamp(data) {
  return data?._metadata?.updatedAt || null
}

/**
 * Format metadata for display
 */
export function formatMetadata(metadata) {
  if (!metadata) return null

  const timestamp = metadata.updatedAt
  const email = metadata.updatedBy || 'Unknown'

  // Handle server timestamp (could be object or number)
  let dateStr = 'Unknown time'
  if (typeof timestamp === 'number') {
    dateStr = new Date(timestamp).toLocaleString()
  }

  return {
    email,
    time: dateStr,
    display: `Last edited by ${email} at ${dateStr}`,
  }
}
