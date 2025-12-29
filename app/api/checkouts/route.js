// Sample orders data
let sampleOrders = [
  {
    id: 'order_001',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'cust_001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (234) 567-8900',
      whatsapp: '+1 (234) 567-8900',
      address: '123 Main Street, Apt 4B, New York, NY 10001'
    },
    items: [
      {
        id: '1',
        name: 'Wireless Noise Cancelling Headphones',
        price: 229.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
      }
    ],
    subtotal: 229.99,
    shipping: 10.00,
    tax: 23.00,
    discount: 0,
    total: 262.99,
    status: 'pending',
    paymentMethod: 'credit_card',
    paymentStatus: 'pending',
    shippingMethod: 'standard',
    trackingNumber: null,
    notes: 'Please deliver after 5 PM',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'order_002',
    orderNumber: 'ORD-2024-002',
    customer: {
      id: 'cust_002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (345) 678-9012',
      whatsapp: '+1 (345) 678-9012',
      address: '456 Oak Avenue, Los Angeles, CA 90001'
    },
    items: [
      {
        id: '2',
        name: 'Smart Watch Pro Series 8',
        price: 349.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
      },
      {
        id: '4',
        name: 'Bluetooth Speaker Xtreme',
        price: 129.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
      }
    ],
    subtotal: 609.97,
    shipping: 15.00,
    tax: 61.00,
    discount: 30.50,
    total: 655.47,
    status: 'completed',
    paymentMethod: 'paypal',
    paymentStatus: 'paid',
    shippingMethod: 'express',
    trackingNumber: 'TRK123456789',
    notes: 'Gift wrapping requested',
    createdAt: '2024-01-14T09:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 'order_003',
    orderNumber: 'ORD-2024-003',
    customer: {
      id: 'cust_003',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1 (456) 789-0123',
      whatsapp: null,
      address: '789 Pine Road, Chicago, IL 60601'
    },
    items: [
      {
        id: '3',
        name: 'Gaming Laptop RTX 4080',
        price: 2199.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80'
      }
    ],
    subtotal: 2199.99,
    shipping: 25.00,
    tax: 222.50,
    discount: 0,
    total: 2447.49,
    status: 'processing',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'processing',
    shippingMethod: 'overnight',
    trackingNumber: null,
    notes: 'Handle with care - fragile',
    createdAt: '2024-01-15T14:45:00Z',
    updatedAt: '2024-01-15T14:45:00Z'
  }
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    
    let filteredOrders = [...sampleOrders]
    
    // Filter by status
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => 
        order.status.toLowerCase() === status.toLowerCase()
      )
    }
    
    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)
    
    // Calculate statistics
    const stats = {
      total: sampleOrders.length,
      pending: sampleOrders.filter(o => o.status === 'pending').length,
      processing: sampleOrders.filter(o => o.status === 'processing').length,
      completed: sampleOrders.filter(o => o.status === 'completed').length,
      cancelled: sampleOrders.filter(o => o.status === 'cancelled').length,
      totalRevenue: sampleOrders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: sampleOrders.length > 0 
        ? sampleOrders.reduce((sum, order) => sum + order.total, 0) / sampleOrders.length 
        : 0
    }
    
    return Response.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit),
        hasNextPage: endIndex < filteredOrders.length,
        hasPrevPage: page > 1
      },
      stats,
      statusOptions: ['pending', 'processing', 'completed', 'cancelled']
    })
    
  } catch (error) {
    console.error('Error fetching orders:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to fetch orders' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const orderData = await request.json()
    
    // Validate required fields
    const requiredFields = ['customer', 'items', 'total']
    const missingFields = requiredFields.filter(field => !orderData[field])
    
    if (missingFields.length > 0) {
      return Response.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      )
    }
    
    // Validate customer data
    const customerFields = ['name', 'email', 'phone', 'address']
    const missingCustomerFields = customerFields.filter(field => !orderData.customer[field])
    
    if (missingCustomerFields.length > 0) {
      return Response.json(
        { 
          success: false, 
          message: `Missing customer fields: ${missingCustomerFields.join(', ')}` 
        },
        { status: 400 }
      )
    }
    
    // Create new order
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`
    const newOrder = {
      id: `order_${Date.now()}`,
      orderNumber,
      ...orderData,
      status: 'pending',
      paymentStatus: 'pending',
      trackingNumber: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // In a real app, save to database
    sampleOrders.unshift(newOrder)
    
    return Response.json({
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating order:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to create order' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const { id, status, trackingNumber, notes } = await request.json()
    
    if (!id) {
      return Response.json(
        { 
          success: false, 
          message: 'Order ID is required' 
        },
        { status: 400 }
      )
    }
    
    // Find order
    const orderIndex = sampleOrders.findIndex(o => o.id === id)
    
    if (orderIndex === -1) {
      return Response.json(
        { 
          success: false, 
          message: 'Order not found' 
        },
        { status: 404 }
      )
    }
    
    // Update order
    const updatedOrder = {
      ...sampleOrders[orderIndex],
      ...(status && { status }),
      ...(trackingNumber && { trackingNumber }),
      ...(notes && { notes }),
      updatedAt: new Date().toISOString()
    }
    
    sampleOrders[orderIndex] = updatedOrder
    
    return Response.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating order:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to update order' 
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
          message: 'Order ID is required' 
        },
        { status: 400 }
      )
    }
    
    // Find order
    const orderIndex = sampleOrders.findIndex(o => o.id === id)
    
    if (orderIndex === -1) {
      return Response.json(
        { 
          success: false, 
          message: 'Order not found' 
        },
        { status: 404 }
      )
    }
    
    // Remove order (or mark as cancelled in real app)
    const deletedOrder = sampleOrders[orderIndex]
    sampleOrders.splice(orderIndex, 1)
    
    return Response.json({
      success: true,
      data: deletedOrder,
      message: 'Order deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting order:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to delete order' 
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
