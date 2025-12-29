import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
})

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return Response.json(
        { 
          success: false, 
          message: 'No file provided' 
        },
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { 
          success: false, 
          message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' 
        },
        { status: 400 }
      )
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return Response.json(
        { 
          success: false, 
          message: 'File size exceeds 10MB limit' 
        },
        { status: 400 }
      )
    }
    
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'ecommerce/products',
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:good' }
      ],
      eager: [
        { width: 400, height: 400, crop: 'fill' },
        { width: 200, height: 200, crop: 'fill' }
      ]
    })
    
    return Response.json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        created_at: result.created_at,
        eager: result.eager // Different sizes
      },
      message: 'Image uploaded successfully'
    })
    
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    
    // Handle specific Cloudinary errors
    if (error.message.includes('Invalid credentials')) {
      return Response.json(
        { 
          success: false, 
          message: 'Cloudinary configuration error. Please check your credentials.' 
        },
        { status: 500 }
      )
    }
    
    if (error.message.includes('File size too large')) {
      return Response.json(
        { 
          success: false, 
          message: 'File size exceeds Cloudinary limits' 
        },
        { status: 400 }
      )
    }
    
    return Response.json(
      { 
        success: false, 
        message: 'Failed to upload image' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { public_id } = await request.json()
    
    if (!public_id) {
      return Response.json(
        { 
          success: false, 
          message: 'Public ID is required' 
        },
        { status: 400 }
      )
    }
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id)
    
    if (result.result !== 'ok') {
      return Response.json(
        { 
          success: false, 
          message: 'Failed to delete image' 
        },
        { status: 500 }
      )
    }
    
    return Response.json({
      success: true,
      message: 'Image deleted successfully'
    })
    
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to delete image' 
      },
      { status: 500 }
    )
  }
}

// Get Cloudinary signature for client-side upload
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const timestamp = Math.round(Date.now() / 1000)
    
    // Generate signature for client-side upload
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: 'ecommerce/products',
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ecommerce_uploads'
      },
      process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
    )
    
    return Response.json({
      success: true,
      data: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
        api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
        timestamp,
        signature,
        folder: 'ecommerce/products',
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ecommerce_uploads'
      },
      message: 'Cloudinary configuration generated'
    })
    
  } catch (error) {
    console.error('Cloudinary signature error:', error)
    return Response.json(
      { 
        success: false, 
        message: 'Failed to generate upload signature' 
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
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
