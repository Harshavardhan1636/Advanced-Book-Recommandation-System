'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { BookOpen, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { authAPI } from '@/lib/api'

export default function SignupPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.name) {
      setError('Full name is required')
      return false
    }
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
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain uppercase, lowercase, and numbers')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await authAPI.signup(formData.email, formData.password, formData.name)
      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login?registered=true')
      }, 1500)
    } catch (err) {
      setError('Signup failed. This email may already be registered.')
    } finally {
      setLoading(false)
    }
  }

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'
  const cardColor = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
  const inputBg = theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-black'
  const buttonColor = theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'

  const passwordStrength = formData.password
    ? /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)
      ? 'strong'
      : /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
        ? 'good'
        : 'weak'
    : ''

  return (
    <main className={`min-h-screen ${bgColor} flex items-center justify-center p-4 py-8`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">BookHub</h1>
          </div>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Join millions of book lovers</p>
        </div>

        <div className={`border ${cardColor} rounded-lg p-8`}>
          <h2 className="text-2xl font-bold mb-6">Create Account</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <p className="text-green-500 text-sm">Account created successfully! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${inputBg}`}
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
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
              {passwordStrength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength === 'weak'
                          ? 'w-1/3 bg-red-500'
                          : passwordStrength === 'good'
                            ? 'w-2/3 bg-yellow-500'
                            : 'w-full bg-green-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-semibold capitalize">{passwordStrength}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${inputBg}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <span className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-500 hover:text-blue-600">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-500 hover:text-blue-600">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg ${buttonColor} text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-500 hover:text-blue-600 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="text-center text-sm mb-4">
              <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Or sign up with</p>
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
      </div>
    </main>
  )
}
