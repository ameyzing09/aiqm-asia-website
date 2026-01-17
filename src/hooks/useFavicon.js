import { useEffect } from 'react'

/**
 * Hook to dynamically update the favicon based on CMS-provided URL.
 * Falls back to /favicon.svg if no custom favicon is set.
 */
export function useFavicon(faviconUrl) {
  useEffect(() => {
    const link = document.querySelector("link[rel='icon']")
    if (link) {
      link.href = faviconUrl || '/favicon.svg'
    }
  }, [faviconUrl])
}
