import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET)
  } catch (error) {
    return null
  }
}

export const isAuthenticated = () => {
  const token = Cookies.get('auth-token')
  if (!token) return false
  
  try {
    const decoded = jwt.decode(token)
    return decoded && decoded.exp > Date.now() / 1000
  } catch (error) {
    return false
  }
}

export const isAdmin = () => {
  const token = Cookies.get('auth-token')
  if (!token) return false
  
  try {
    const decoded = jwt.decode(token)
    return decoded && decoded.email === process.env.ADMIN_EMAIL
  } catch (error) {
    return false
  }
}

export const getUserFromToken = () => {
  const token = Cookies.get('auth-token')
  if (!token) return null
  
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}
