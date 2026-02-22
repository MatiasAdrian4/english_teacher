import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { verifyAdminCredentials } from '../api/client'

interface LoginFormData {
  username: string
  password: string
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>()

  const onSubmit: SubmitHandler<LoginFormData> = async ({ username, password }) => {
    setAuthError(null)
    const encoded = btoa(`${username}:${password}`)
    try {
      await verifyAdminCredentials(encoded)
      login(username, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setAuthError((err as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-sm p-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">English Teacher Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              autoComplete="username"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.username ? 'border-red-400' : 'border-gray-300'
              }`}
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.password ? 'border-red-400' : 'border-gray-300'
              }`}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Auth error */}
          {authError && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 p-3 rounded-lg">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

        </form>
      </div>
    </div>
  )
}
