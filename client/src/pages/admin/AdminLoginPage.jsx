import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import { HiLockClosed, HiMail } from 'react-icons/hi'

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login({ email, password })
      toast.success('Logged in successfully!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | Saraswati Cards</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-50 text-brand-700 text-2xl font-serif font-bold mb-3">
              SC
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Admin Portal</h1>
            <p className="text-xs text-gray-500 mt-1">Saraswati Cards Catalog Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <div className="relative flex items-center">
                <HiMail className="absolute left-3.5 text-gray-400 text-lg" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@saraswatitcards.com"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <HiLockClosed className="absolute left-3.5 text-gray-400 text-lg" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 text-sm font-semibold shadow-md disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
            Protected Admin Area • Saraswati Cards
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminLoginPage
