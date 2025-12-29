import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return Response.json(
        { 
          success: false, 
          message: 'No authentication token found' 
        },
        { status: 401 }
      )
    }

    // Verify the token
    const decoded = jwt.verify(
      token.value, 
      process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development'
    )

    return Response.json({ 
      success: true, 
      user: decoded,
      isAuthenticated: true
    })
    
  } catch (error) {
    console.error('Token verification error:', error)
    
    // Clear invalid token
    const cookieStore = cookies()
    cookieStore.delete('auth-token')
    
    return Response.json(
      { 
        success: false, 
        message: 'Invalid or expired token' 
      },
      { status: 401 }
    )
  }
}

export async function POST(request) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return Response.json(
        { 
          success: false, 
          message: 'Token is required' 
        },
        { status: 400 }
      )
    }

    const decoded = jwt.verify(
      token, 
      process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development'
    )

    return Response.json({ 
      success: true, 
      user: decoded,
      isValid: true
    })
    
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        message: 'Invalid token',
        isValid: false
      },
      { status: 401 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
