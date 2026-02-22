import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthContextValue {
  credentials: string | null // base64-encoded "username:password"
  login: (username: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<string | null>(null)

  function login(username: string, password: string) {
    setCredentials(btoa(`${username}:${password}`))
  }

  function logout() {
    setCredentials(null)
  }

  return <AuthContext.Provider value={{ credentials, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
