import { useState, useEffect, createContext } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { ref, get } from 'firebase/database'
import { auth, googleProvider, db } from '../services/firebase'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  // Check if a user is an admin by checking /admins/{uid} in the database
  const checkAdminStatus = async (uid) => {
    if (!uid) return false
    try {
      const adminRef = ref(db, `admins/${uid}`)
      const snapshot = await get(adminRef)
      return snapshot.exists()
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const isAdmin = await checkAdminStatus(currentUser.uid)
        setIsAuthorized(isAdmin)
      } else {
        setIsAuthorized(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const isAdmin = await checkAdminStatus(result.user.uid)

      if (!isAdmin) {
        await signOut(auth)
        throw new Error('Unauthorized: You are not registered as an admin')
      }

      return result.user
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAuthorized,
    signInWithGoogle,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
