'use client'

import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const token = Cookies.get('auth-token')
      if (token) {
        const response = await axios.get('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(response.data.user)
      }
    } catch (error) {
      Cookies.remove('auth-token')
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/auth/login', { email, password })
      
      if (response.data.success) {
        const { token, user, redirect } = response.data
        Cookies.set('auth-token', token, { expires: 7, secure: true, sameSite: 'strict' })
        setUser(user)
        toast.success('Login successful!')
        return { success: true, redirect }
      }
      
      toast.error(response.data.message || 'Login failed')
      return { success: false, message: response.data.message }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return { success: false, message: 'Login failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    Cookies.remove('auth-token')
    setUser(null)
    router.push('/')
    toast.success('Logged out successfully')
  }, [router])

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.email === process.env.ADMIN_EMAIL
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
