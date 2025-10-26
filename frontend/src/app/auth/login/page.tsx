'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { BookOpen, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { authAPI } from '@/lib/api'

export default function LoginPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await authAPI.login(formData.email, formData.password)
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
  const inputBg = theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-black'
  const buttonColor = theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'

  return (
    <main className={`min-h-screen ${bgColor} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">BookHub</h1>
          </div>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Welcome back to your reading journey</p>
        </div>

        <div className={`border ${cardColor} rounded-lg p-8`}>
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <p className="text-green-500 text-sm">Login successful! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${inputBg}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-blue-500 hover:text-blue-600 text-sm">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg ${buttonColor} text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-500 hover:text-blue-600 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="text-center text-sm mb-4">
              <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Or continue with</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button className={`py-2 rounded-lg border ${theme === 'dark' ? 'border-slate-600' : 'border-gray-300'} hover:bg-opacity-5 transition`}>
                Google
              </button>
              <button className={`py-2 rounded-lg border ${theme === 'dark' ? 'border-slate-600' : 'border-gray-300'} hover:bg-opacity-5 transition`}>
                GitHub
              </button>
              <button className={`py-2 rounded-lg border ${theme === 'dark' ? 'border-slate-600' : 'border-gray-300'} hover:bg-opacity-5 transition`}>
                Apple
              </button>
            </div>
          </div>
        </div>

        <p className={`text-center text-xs mt-6 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  )
}
