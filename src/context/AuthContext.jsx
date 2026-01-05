import { useState, useEffect, createContext } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase'

const ADMIN_WHITELIST = [
  'ameykode2001@gmail.com',
  'dskode@aiqmindia.com',
  'aniket@aiqmindia.com'
]

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsAuthorized(currentUser ? ADMIN_WHITELIST.includes(currentUser.email) : false)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const userEmail = result.user.email

      if (!ADMIN_WHITELIST.includes(userEmail)) {
        await signOut(auth)
        throw new Error('Unauthorized: Your email is not in the admin whitelist')
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
