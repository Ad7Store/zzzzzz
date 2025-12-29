import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart))
        } catch (error) {
          console.error('Error loading cart:', error)
          localStorage.removeItem('cart')
        }
      }
      setInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, initialized])

  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id)
      
      if (existingIndex > -1) {
        const updatedCart = [...prevCart]
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 1
        }
        toast.success(`Increased ${product.name} quantity`)
        return updatedCart
      } else {
        const newCart = [...prevCart, { ...product, quantity: 1 }]
        toast.success(`${product.name} added to cart!`)
        return newCart
      }
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.id === productId)
      if (item) {
        toast.success(`${item.name} removed from cart`)
      }
      return prevCart.filter(item => item.id !== productId)
    })
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
    toast.success('Cart cleared')
  }, [])

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = item.offPrice || item.price
      return total + (parseFloat(price) * item.quantity)
    }, 0)
  }, [cart])

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }, [cart])

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartEmpty: cart.length === 0
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
