'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiPhone, FiMail, FiMapPin, FiMessageSquare, FiCreditCard, FiShield, FiTruck } from 'react-icons/fi'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/components/Layout/Navbar'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart, isCartEmpty } = useCart()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    paymentMethod: 'card'
  })
  
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isCartEmpty) {
      toast.error('Your cart is empty')
      return
    }
    
    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email address')
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    if (!formData.address.trim()) {
      toast.error('Please enter your shipping address')
      return
    }
    
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Save order to localStorage (simulate backend)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const order = {
        id: Date.now().toString(),
        ...formData,
        items: cart,
        total: getCartTotal(),
        date: new Date().toISOString(),
        status: 'pending'
      }
      orders.push(order)
      localStorage.setItem('orders', JSON.stringify(orders))
      
      toast.success(
        <div>
          <p className="font-bold">🎉 Order placed successfully!</p>
          <p className="text-sm">Order ID: #{order.id}</p>
          <p className="text-sm">We'll contact you soon for confirmation.</p>
        </div>,
        { duration: 5000 }
      )
      
      // Clear cart
      clearCart()
      
      // Redirect to home
      setTimeout(() => {
        router.push('/')
      }, 2000)
      
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isCartEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add items to your cart before checkout</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition"
          >
            Go Shopping
          </button>
        </div>
      </div>
    )
  }

  const calculateTotal = () => {
    const subtotal = getCartTotal()
    const shipping = 10
    const tax = subtotal * 0.1
    return subtotal + shipping + tax
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-2 gradient-text">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center text-sm font-medium mb-2">
                  <FiUser className="mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              {/* Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <FiPhone className="mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium mb-2">
                    <FiMail className="mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              {/* WhatsApp (Optional) */}
              <div>
                <label className="flex items-center text-sm font-medium mb-2">
                  <FiMessageSquare className="mr-2" />
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+1 234 567 8900"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll use this for order updates via WhatsApp
                </p>
              </div>
              
              {/* Address */}
              <div>
                <label className="flex items-center text-sm font-medium mb-2">
                  <FiMapPin className="mr-2" />
                  Shipping Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="123 Main Street, Apt 4B, City, State, ZIP Code"
                  required
                />
              </div>
              
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-4">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'card', label: 'Credit Card', icon: <FiCreditCard /> },
                    { id: 'paypal', label: 'PayPal', icon: '🔗' },
                    { id: 'cash', label: 'Cash on Delivery', icon: '💰' },
                    { id: 'bank', label: 'Bank Transfer', icon: '🏦' }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-2xl mb-2">{method.icon}</span>
                      <span className="font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Security Info */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center mb-2">
                  <FiShield className="text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Secure Checkout</span>
                </div>
                <p className="text-sm text-blue-700">
                  Your payment information is encrypted and secure. We never store your credit card details.
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing Order...
                  </div>
                ) : (
                  `Place Order - $${calculateTotal().toFixed(2)}`
                )}
              </motion.button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </motion.div>
          
          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-600 text-sm">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-bold">
                          ${((item.offPrice || item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="flex items-center">
                    <FiTruck className="mr-1" />
                    $10.00
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-2xl text-blue-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Shipping Info */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FiTruck className="text-green-600 mr-2" />
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <p className="text-sm text-gray-500">On orders over $100</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Estimated Delivery:</p>
                  <p className="font-medium">3-5 business days</p>
                </div>
              </div>
              
              {/* Security Badges */}
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-4">Secure checkout with:</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl">🔒</div>
                  <div className="text-2xl">🛡️</div>
                  <div className="text-2xl">✓</div>
                  <div className="text-2xl">💳</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
