// Sample product data
const sampleProducts = [
  {
    id: '1',
    name: "Wireless Noise Cancelling Headphones",
    price: 299.99,
    offPrice: 229.99,
    description: "Premium wireless headphones with active noise cancellation and 30-hour battery life. Perfect for travel and office use.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Audio",
    stock: 45,
    rating: 4.8,
    reviews: 128,
    features: ["Noise Cancelling", "Bluetooth 5.0", "30h Battery", "Foldable"],
    brand: "AudioPro",
    status: "in-stock",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: '2',
    name: "Smart Watch Pro Series 8",
    price: 399.99,
    offPrice: 349.99,
    description: "Advanced smartwatch with health monitoring, GPS, and LTE connectivity. Track your fitness and stay connected.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: "Wearables",
    stock: 28,
    rating: 4.6,
    reviews: 89,
    features: ["Heart Rate Monitor", "GPS", "LTE", "Waterproof"],
    brand: "TechWear",
    status: "in-stock",
    createdAt: "2024-01-02T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: '3',
    name: "Gaming Laptop RTX 4080",
    price: 2499.99,
    offPrice: 2199.99,
    description: "High-performance gaming laptop with NVIDIA RTX 4080, Intel i9 processor, and 240Hz display for ultimate gaming experience.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    category: "Computers",
    stock: 12,
    rating: 4.9,
    reviews: 56,
    features: ["RTX 4080", "32GB RAM", "2TB SSD", "240Hz Display"],
    brand: "GameMaster",
    status: "in-stock",
    createdAt: "2024-01-03T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: '4',
    name: "Bluetooth Speaker Xtreme",
    price: 129.99,
    description: "Waterproof portable speaker with 360° sound and 20-hour battery life. Perfect for outdoor adventures.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    category: "Audio",
    stock: 67,
    rating: 4.4,
    reviews: 203,
    features: ["Waterproof", "360° Sound", "20h Battery", "Portable"],
    brand: "SoundWave",
    status: "in-stock",
    createdAt: "2024-01-04T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: '5',
    name: "4K Ultra HD Smart TV 65\"",
    price: 899.99,
    offPrice: 749.99,
    description: "Smart TV with 4K resolution, HDR, and built-in streaming apps. Experience cinema-like quality at home.",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
    category: "TV & Home",
    stock: 23,
    rating: 4.7,
    reviews: 145,
    features: ["4K HDR", "Smart OS", "Voice Control", "Thin Bezels"],
    brand: "ViewMax",
    status: "in-stock",
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: '6',
    name: "Mirrorless Camera Pro",
    price: 1499.99,
    description: "Professional mirrorless camera with 45MP sensor and 4K video recording. Perfect for photography enthusiasts.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    category: "Cameras",
    stock: 18,
    rating: 4.8,
    reviews: 78,
    features: ["45MP Sensor", "4K Video", "5-Axis Stabilization", "WiFi"],
    brand: "PhotoPro",
    status: "in-stock",
    createdAt: "2024-01-06T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: '7',
    name: "Wireless Gaming Mouse",
    price: 89.99,
    offPrice: 69.99,
    description: "RGB gaming mouse with 16000 DPI, programmable buttons, and wireless connectivity for competitive gaming.",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80",
    category: "Gaming",
    stock: 89,
    rating: 4.5,
    reviews: 234,
    features: ["16000 DPI", "RGB Lighting", "Wireless", "Programmable"],
    brand: "GameGear",
    status: "in-stock",
    createdAt: "2024-01-07T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: '8',
    name: "Mechanical Keyboard RGB",
    price: 129.99,
    description: "Mechanical keyboard with RGB lighting, tactile switches, and customizable macros for productivity and gaming.",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80",
    category: "Gaming",
    stock: 56,
    rating: 4.6,
    reviews: 167,
    features: ["Mechanical Switches", "RGB", "Macro Keys", "Wrist Rest"],
    brand: "KeyMaster",
    status: "in-stock",
    createdAt: "2024-01-08T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  }
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100')
    const page = parseInt(searchParams.get('page') || '1')
    
    let filteredProducts = [...sampleProducts]
    
    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Search by name or description
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
      )
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    return Response.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: page > 1
      },
      categories: [...new Set(sampleProducts.map(p => p.category))],
      stats: {
        totalProducts: sampleProducts.length,
        inStock: sampleProducts.filter(p => p.status === 'in-stock').length,
        categories: [...new Set(sampleProducts.map(p => p.category))].length
      }
    })
    
  } catch (error) {
    console.error('Error fetching products:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to fetch products' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const productData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'description', 'category', 'stock']
    const missingFields = requiredFields.filter(field => !productData[field])
    
    if (missingFields.length > 0) {
      return Response.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      )
    }
    
    // Create new product
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      rating: 4.0,
      reviews: 0,
      status: 'in-stock',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // In a real app, save to database
    // For now, just return the created product
    return Response.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating product:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to create product' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const productData = await request.json()
    
    if (!productData.id) {
      return Response.json(
        { 
          success: false, 
          message: 'Product ID is required' 
        },
        { status: 400 }
      )
    }
    
    // Find and update product
    const productIndex = sampleProducts.findIndex(p => p.id === productData.id)
    
    if (productIndex === -1) {
      return Response.json(
        { 
          success: false, 
          message: 'Product not found' 
        },
        { status: 404 }
      )
    }
    
    const updatedProduct = {
      ...sampleProducts[productIndex],
      ...productData,
      updatedAt: new Date().toISOString()
    }
    
    // In a real app, update in database
    return Response.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating product:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to update product' 
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
          message: 'Product ID is required' 
        },
        { status: 400 }
      )
    }
    
    // Find product
    const productIndex = sampleProducts.findIndex(p => p.id === id)
    
    if (productIndex === -1) {
      return Response.json(
        { 
          success: false, 
          message: 'Product not found' 
        },
        { status: 404 }
      )
    }
    
    // In a real app, delete from database
    // For now, just return success
    return Response.json({
      success: true,
      message: 'Product deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting product:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to delete product' 
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
