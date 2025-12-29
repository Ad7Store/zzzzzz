import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiSearch } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const ItemsManagement = () => {
  const [items, setItems] = useState([
    {
      id: '1',
      name: "Wireless Noise Cancelling Headphones",
      price: 299.99,
      offPrice: 229.99,
      description: "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      category: "Audio",
      stock: 45,
      rating: 4.8,
      status: "active"
    },
    {
      id: '2',
      name: "Smart Watch Pro Series 8",
      price: 399.99,
      offPrice: 349.99,
      description: "Advanced smartwatch with health monitoring, GPS, and LTE connectivity.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      category: "Wearables",
      stock: 28,
      rating: 4.6,
      status: "active"
    }
  ])

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    offPrice: '',
    description: '',
    image: '',
    category: 'Electronics',
    stock: '',
    status: 'active'
  })

  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingId 
          ? { 
              ...formData, 
              id: editingId, 
              price: parseFloat(formData.price),
              offPrice: formData.offPrice ? parseFloat(formData.offPrice) : null,
              stock: parseInt(formData.stock)
            }
          : item
      ))
      toast.success('Product updated successfully')
    } else {
      // Add new item
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        offPrice: formData.offPrice ? parseFloat(formData.offPrice) : null,
        stock: parseInt(formData.stock),
        rating: 4.5
      }
      setItems([...items, newItem])
      toast.success('Product added successfully')
    }
    
    // Reset form
    setFormData({
      name: '',
      price: '',
      offPrice: '',
      description: '',
      image: '',
      category: 'Electronics',
      stock: '',
      status: 'active'
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      offPrice: item.offPrice || '',
      description: item.description,
      image: item.image,
      category: item.category,
      stock: item.stock,
      status: item.status
    })
    setEditingId(item.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setItems(items.filter(item => item.id !== id))
      toast.success('Product deleted successfully')
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In production, upload to Cloudinary
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Products Management</h1>
          <p className="text-gray-600">Manage your store products and inventory</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
            />
          </div>
          
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              setFormData({
                name: '',
                price: '',
                offPrice: '',
                description: '',
                image: '',
                category: 'Electronics',
                stock: '',
                status: 'active'
              })
            }}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Computers">Computers</option>
                  <option value="Gaming">Gaming</option>
                  <option value="TV & Home">TV & Home</option>
                  <option value="Cameras">Cameras</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Off Price ($) - Optional</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.offPrice}
                  onChange={(e) => setFormData({ ...formData, offPrice: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product Image</label>
              <div className="flex items-center space-x-4">
                {formData.image ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                    <FiUpload className="text-2xl text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or enter image URL"
                  className="flex-1 px-4 py-3 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl"
                rows="4"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="btn-primary px-8"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="px-8 py-3 border-2 border-gray-800 text-gray-800 rounded-xl font-bold hover:bg-gray-800 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">All Products ({filteredItems.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="ml-4">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {item.category}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold">${item.offPrice || item.price}</div>
                      {item.offPrice && (
                        <div className="text-sm text-gray-500 line-through">${item.price}</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className={`font-medium ${
                      item.stock < 10 ? 'text-red-600' : 
                      item.stock < 30 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {item.stock} units
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'out_of_stock'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ItemsManagement
