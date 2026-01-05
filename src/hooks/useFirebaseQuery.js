import { useQuery } from '@tanstack/react-query'
import { ref, get } from 'firebase/database'
import { db } from '../services/firebase'

/**
 * Generic hook for fetching data from Firebase RTDB using TanStack Query.
 *
 * @param {string[]} queryKey - Query key array, first element is the Firebase path
 * @param {function} select - Optional transform function (memoized by React Query)
 * @returns {UseQueryResult} - TanStack Query result object
 */
export function useFirebaseQuery(queryKey, select) {
  // Join all queryKey parts to form the full path (e.g., ['heroes', 'home'] => 'heroes/home')
  const path = queryKey.join('/')

  return useQuery({
    queryKey,
    queryFn: async () => {
      const snapshot = await get(ref(db, `siteContent/${path}`))
      if (!snapshot.exists()) {
        return null
      }
      return snapshot.val()
    },
    select,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
