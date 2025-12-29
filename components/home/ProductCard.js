import { motion } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { FiShoppingCart, FiStar, FiEye } from 'react-icons/fi'

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart()

  const discountPercentage = product.offPrice 
    ? Math.round(((product.price - product.offPrice) / product.price) * 100)
    : 0

  const handleAddToCart = () => {
    addToCart(product)
  }

  const handleQuickView = () => {
    // Implement quick view modal
    console.log('Quick view:', product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 card-hover">
        {/* Product Image */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {discountPercentage > 0 && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{discountPercentage}% OFF
              </div>
            )}
            
            {product.stock < 20 && (
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Low Stock
              </div>
            )}
          </div>
          
          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
          >
            <FiEye className="text-gray-700" />
          </button>
          
          {/* Add to Cart Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-100 transition"
            >
              <FiShoppingCart />
              <span>Add to Cart</span>
            </motion.button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition">
                {product.name}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  <FiStar className="text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm font-medium">{product.rating || 4.5}</span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.offPrice || product.price}
                </span>
                {product.offPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.price}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Stock: <span className={`font-medium ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                {product.stock} left
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
