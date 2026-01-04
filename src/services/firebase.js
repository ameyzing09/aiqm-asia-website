import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeClMxBQx9Vw6N_7llTd56RBIgOUzdiaI",
  authDomain: "aiqm-asia.firebaseapp.com",
  databaseURL: "https://aiqm-asia-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "aiqm-asia",
  storageBucket: "aiqm-asia.firebasestorage.app",
  messagingSenderId: "929678785166",
  appId: "1:929678785166:web:0b1a206c6ab7e1b34ee7df"
}

// Prevent duplicate initialization during hot-reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getDatabase(app)
export const storage = getStorage(app)

export default app
