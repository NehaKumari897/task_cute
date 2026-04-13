import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, provider } from "../firebase/config"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false) })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{
      user, loading,
      login:  () => signInWithPopup(auth, provider),
      logout: () => signOut(auth),
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
