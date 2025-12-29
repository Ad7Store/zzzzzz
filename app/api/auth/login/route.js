import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return Response.json(
        { 
          success: false, 
          message: 'Email and password are required' 
        },
        { status: 400 }
      )
    }

    // Check for admin credentials
    const isAdmin = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD
    
    if (isAdmin) {
      const token = jwt.sign(
        { 
          id: 'admin_001',
          email, 
          name: 'Admin User',
          role: 'admin',
          permissions: ['all']
        },
        process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development',
        { expiresIn: '7d' }
      )

      // Set HTTP-only cookie
      const cookieStore = cookies()
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return Response.json({ 
        success: true, 
        user: { 
          id: 'admin_001',
          email, 
          name: 'Admin User',
          role: 'admin'
        },
        redirect: '/admin',
        token
      })
    }

    // Check for regular user (simulated - in production, check database)
    // For demo purposes, accept any email/password combination
    const token = jwt.sign(
      { 
        id: `user_${Date.now()}`,
        email, 
        name: email.split('@')[0],
        role: 'user',
        permissions: ['read']
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development',
      { expiresIn: '7d' }
    )

    const cookieStore = cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return Response.json({ 
      success: true, 
      user: { 
        id: `user_${Date.now()}`,
        email, 
        name: email.split('@')[0],
        role: 'user'
      },
      redirect: '/',
      token
    })

  } catch (error) {
    console.error('Login API error:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
