'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft, FiTag } from 'react-icons/fi'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/components/Layout/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartCount,
    clearCart,
    isCartEmpty
  } = useCart()
  
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const router = useRouter()

  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      toast.error('Please enter a coupon code')
      return
    }
    
    const validCoupons = {
      'WELCOME10': 0.1,
      'SAVE20': 0.2,
      'FLASH30': 0.3
    }
    
    if (validCoupons[coupon.toUpperCase()]) {
      setAppliedCoupon({
        code: coupon.toUpperCase(),
        discount: validCoupons[coupon.toUpperCase()]
      })
      toast.success(`Coupon ${coupon.toUpperCase()} applied!`)
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    return getCartTotal() * appliedCoupon.discount
  }

  const calculateTotal = () => {
    const subtotal = getCartTotal()
    const discount = calculateDiscount()
    const shipping = subtotal > 0 ? 10 : 0
    const tax = (subtotal - discount) * 0.1
    return subtotal - discount + shipping + tax
  }

  const handleCheckout = () => {
    if (isCartEmpty) {
      toast.error('Your cart is empty')
      return
    }
    router.push('/checkout')
  }

  if (isCartEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <FiShoppingBag className="text-4xl text-blue-500" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4 gradient-text">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary inline-flex items-center justify-center"
            >
              <FiArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
            
            <button
              onClick={() => window.scrollTo(0, 0)}
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-full font-bold hover:opacity-90 transition"
            >
              View Featured Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 gradient-text">Shopping Cart</h1>
          <p className="text-gray-600">
            {getCartCount()} item{getCartCount() !== 1 ? 's' : ''} in your cart
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Items</h2>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    clearCart()
                    toast.success('Cart cleared')
                  }
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
              >
                <FiTrash2 className="mr-1" />
                Clear Cart
              </button>
            </div>
            
            {cart.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 flex items-center hover:shadow-xl transition-shadow"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {item.offPrice && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.round(((item.price - item.offPrice) / item.price) * 100)}%
                    </div>
                  )}
                </div>
                
                <div className="ml-6 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-xl text-blue-600">
                        ${((item.offPrice || item.price) * item.quantity).toFixed(2)}
                      </p>
                      {item.offPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                      >
                        <FiMinus />
                      </button>
                      
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <FiTag className="mr-2" />
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon"
                    className="flex-1 px-4 py-2 border rounded-lg"
                    disabled={!!appliedCoupon}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!!appliedCoupon}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
                  >
                    {appliedCoupon ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-green-600 text-sm mt-2">
                    {appliedCoupon.code} applied ({appliedCoupon.discount * 100}% off)
                  </p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  Available: WELCOME10, SAVE20, FLASH30
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>$10.00</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${((getCartTotal() - calculateDiscount()) * 0.1).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-2xl text-blue-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 transition"
              >
                Proceed to Checkout
              </button>
              
              <Link
                href="/"
                className="block text-center mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
              >
                <FiArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
