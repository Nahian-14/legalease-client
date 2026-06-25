import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../utils/firebase'
import axiosInstance from '../utils/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [dbUser, setDbUser]   = useState(null)
  const [loading, setLoading] = useState(true)

  // Register with email/password
  async function register(email, password, fullName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: fullName })
    return cred.user
  }

  // Login with email/password
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Google OAuth
  async function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider)
  }

  // Logout
  async function logout() {
    await signOut(auth)
    localStorage.removeItem('legalease_token')
    setDbUser(null)
  }

  // Sync Firebase state → get JWT → get DB user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          const idToken = await firebaseUser.getIdToken()
          // Exchange Firebase token for our JWT
          const { data } = await axiosInstance.post('/api/auth/jwt', {
            email: firebaseUser.email,
            name:  firebaseUser.displayName,
            photo: firebaseUser.photoURL,
          }, { headers: { Authorization: `Bearer ${idToken}` } })

          localStorage.setItem('legalease_token', data.token)

          // Fetch full DB user profile
          const { data: profile } = await axiosInstance.get('/api/auth/me')
          setDbUser(profile)
        } catch (err) {
          console.error('Auth sync error:', err)
        }
      } else {
        setUser(null)
        setDbUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const value = { user, dbUser, setDbUser, loading, register, login, loginWithGoogle, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
