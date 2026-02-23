import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

const SESSION_KEY = 'admin_credentials'

interface AuthContextValue {
  credentials: string | null // base64-encoded "username:password"
  login: (username: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<string | null>(
    () => sessionStorage.getItem(SESSION_KEY), // rehydrate on reload
  )

  function login(username: string, password: string) {
    const encoded = btoa(`${username}:${password}`)
    sessionStorage.setItem(SESSION_KEY, encoded)
    setCredentials(encoded)
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
    setCredentials(null)
  }

  return (
    <AuthContext.Provider value={{ credentials, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
