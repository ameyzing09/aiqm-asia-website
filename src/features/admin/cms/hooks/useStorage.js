import { useState, useCallback } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../../../services/firebase'

export function useStorage() {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)

  const upload = useCallback(async (file, path) => {
    setUploading(true)
    setError(null)
    setProgress(0)

    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        snapshot => {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress(Math.round(pct))
        },
        err => {
          setError(err.message)
          setUploading(false)
          reject(err)
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref)
            setUploading(false)
            setProgress(100)
            resolve(url)
          } catch (err) {
            setError(err.message)
            setUploading(false)
            reject(err)
          }
        }
      )
    })
  }, [])

  const reset = useCallback(() => {
    setProgress(0)
    setError(null)
    setUploading(false)
  }, [])

  return { upload, progress, error, uploading, reset }
}
