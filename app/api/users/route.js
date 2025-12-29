// Sample users data
let sampleUsers = [
  {
    id: 'user_001',
    name: 'Admin User',
    email: 'zaid@gmail.com',
    password: 'zaid', // In real app, this would be hashed
    role: 'admin',
    status: 'active',
    avatar: null,
    phone: '+1 (123) 456-7890',
    address: '789 Admin Street, Tech City',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T14:30:00Z',
    loginCount: 156,
    permissions: ['all'],
    orders: 156,
    totalSpent: 12458.00
  },
  {
    id: 'user_002',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    status: 'active',
    avatar: null,
    phone: '+1 (234) 567-8900',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
    createdAt: '2024-01-10T09:15:00Z',
    lastLogin: '2024-01-14T16:45:00Z',
    loginCount: 24,
    permissions: ['read'],
    orders: 24,
    totalSpent: 2450.00
  },
  {
    id: 'user_003',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    status: 'blocked',
    avatar: null,
    phone: '+1 (345) 678-9012',
    address: '456 Oak Avenue, Los Angeles, CA 90001',
    createdAt: '2024-01-05T11:30:00Z',
    lastLogin: '2024-01-10T10:20:00Z',
    loginCount: 8,
    permissions: ['read'],
    orders: 8,
    totalSpent: 850.00
  },
  {
    id: 'user_004',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user',
    status: 'active',
    avatar: null,
    phone: '+1 (456) 789-0123',
    address: '789 Pine Road, Chicago, IL 60601',
    createdAt: '2024-01-12T14:00:00Z',
    lastLogin: '2024-01-15T12:10:00Z',
    loginCount: 12,
    permissions: ['read'],
    orders: 12,
    totalSpent: 1250.00
  }
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    
    let filteredUsers = [...sampleUsers]
    
    // Filter by role
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.role.toLowerCase() === role.toLowerCase()
      )
    }
    
    // Filter by status
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.status.toLowerCase() === status.toLowerCase()
      )
    }
    
    // Search by name or email
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.phone?.toLowerCase().includes(searchTerm)
      )
    }
    
    // Remove passwords before sending
    const sanitizedUsers = filteredUsers.map(({ password, ...user }) => user)
    
    // Sort by creation date (newest first)
    sanitizedUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = sanitizedUsers.slice(startIndex, endIndex)
    
    // Calculate statistics
    const stats = {
      total: sampleUsers.length,
      active: sampleUsers.filter(u => u.status === 'active').length,
      blocked: sampleUsers.filter(u => u.status === 'blocked').length,
      admins: sampleUsers.filter(u => u.role === 'admin').length,
      users: sampleUsers.filter(u => u.role === 'user').length,
      totalOrders: sampleUsers.reduce((sum, user) => sum + user.orders, 0),
      totalRevenue: sampleUsers.reduce((sum, user) => sum + user.totalSpent, 0)
    }
    
    return Response.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
        hasNextPage: endIndex < filteredUsers.length,
        hasPrevPage: page > 1
      },
      stats,
      roleOptions: ['admin', 'user'],
      statusOptions: ['active', 'blocked']
    })
    
  } catch (error) {
    console.error('Error fetching users:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to fetch users' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const userData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'role']
    const missingFields = requiredFields.filter(field => !userData[field])
    
    if (missingFields.length > 0) {
      return Response.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      )
    }
    
    // Check if email already exists
    const emailExists = sampleUsers.some(user => 
      user.email.toLowerCase() === userData.email.toLowerCase()
    )
    
    if (emailExists) {
      return Response.json(
        { 
          success: false, 
          message: 'Email already exists' 
        },
        { status: 409 }
      )
    }
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      ...userData,
      status: 'active',
      avatar: null,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginCount: 0,
      orders: 0,
      totalSpent: 0
    }
    
    // In a real app, hash password and save to database
    sampleUsers.push(newUser)
    
    // Remove password from response
    const { password, ...userResponse } = newUser
    
    return Response.json({
      success: true,
      data: userResponse,
      message: 'User created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating user:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to create user' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const userData = await request.json()
    
    if (!userData.id) {
      return Response.json(
        { 
          success: false, 
          message: 'User ID is required' 
        },
        { status: 400 }
      )
    }
    
    // Find user
    const userIndex = sampleUsers.findIndex(u => u.id === userData.id)
    
    if (userIndex === -1) {
      return Response.json(
        { 
          success: false, 
          message: 'User not found' 
        },
        { status: 404 }
      )
    }
    
    // Update user (don't update password unless provided)
    const updatedUser = {
      ...sampleUsers[userIndex],
      ...userData,
      // Don't update these fields unless specified
      ...(userData.password ? {} : { password: sampleUsers[userIndex].password })
    }
    
    sampleUsers[userIndex] = updatedUser
    
    // Remove password from response
    const { password, ...userResponse } = updatedUser
    
    return Response.json({
      success: true,
      data: userResponse,
      message: 'User updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating user:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to update user' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return Response.json(
        { 
          success: false, 
          message: 'User ID is required' 
        },
        { status: 400 }
      )
    }
    
    // Find user
    const userIndex = sampleUsers.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return Response.json(
        { 
          success: false, 
          message: 'User not found' 
        },
        { status: 404 }
      )
    }
    
    // Don't allow deleting admin user
    if (sampleUsers[userIndex].email === 'zaid@gmail.com') {
      return Response.json(
        { 
          success: false, 
          message: 'Cannot delete admin user' 
        },
        { status: 403 }
      )
    }
    
    // Remove user (or mark as deleted in real app)
    const deletedUser = sampleUsers[userIndex]
    sampleUsers.splice(userIndex, 1)
    
    // Remove password from response
    const { password, ...userResponse } = deletedUser
    
    return Response.json({
      success: true,
      data: userResponse,
      message: 'User deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting user:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to delete user' 
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
