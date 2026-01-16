import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, get, update, remove } from 'firebase/database'
import { db } from '../../../../services/firebase'

export function useCMSData(section) {
  const queryClient = useQueryClient()

  // Read data from Firebase
  const query = useQuery({
    queryKey: ['siteContent', section],
    queryFn: async () => {
      const snapshot = await get(ref(db, `siteContent/${section}`))
      return snapshot.exists() ? snapshot.val() : null
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update data (partial update via Firebase update())
  const updateMutation = useMutation({
    mutationFn: async data => {
      await update(ref(db, `siteContent/${section}`), data)
    },
    onSuccess: () => {
      // Invalidate CMS queries
      queryClient.invalidateQueries({ queryKey: ['siteContent', section] })
      // Also invalidate frontend queries that use this data
      queryClient.invalidateQueries({ queryKey: [section] })
    },
  })

  // Update a specific item within the section (for nested objects)
  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, data }) => {
      await update(ref(db, `siteContent/${section}/${itemId}`), data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', section] })
      queryClient.invalidateQueries({ queryKey: [section] })
    },
  })

  // Delete an item (for array management - testimonials, courses, etc.)
  const deleteMutation = useMutation({
    mutationFn: async itemId => {
      await remove(ref(db, `siteContent/${section}/${itemId}`))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent', section] })
      queryClient.invalidateQueries({ queryKey: [section] })
    },
  })

  return {
    // Query state
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,

    // Update mutations
    save: updateMutation.mutate,
    saveAsync: updateMutation.mutateAsync,
    isSaving: updateMutation.isPending,
    saveError: updateMutation.error,

    // Item update mutations
    updateItem: updateItemMutation.mutate,
    updateItemAsync: updateItemMutation.mutateAsync,
    isUpdatingItem: updateItemMutation.isPending,

    // Delete mutations
    remove: deleteMutation.mutate,
    removeAsync: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
  }
}
