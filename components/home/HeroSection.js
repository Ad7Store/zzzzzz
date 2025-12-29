import { motion } from 'framer-motion'
import { FiArrowRight, FiTruck, FiShield, FiGift } from 'react-icons/fi'

const HeroSection = () => {
  const features = [
    {
      icon: <FiTruck />,
      title: "Free Shipping",
      description: "On orders over $100"
    },
    {
      icon: <FiShield />,
      title: "Secure Payment",
      description: "100% secure transactions"
    },
    {
      icon: <FiGift />,
      title: "Best Price",
      description: "Price match guarantee"
    }
  ]

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      
      {/* Animated Circles */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 360, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          rotate: [0, -360, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm font-medium text-blue-600">🔥 Limited Time Deals</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover Amazing
              <span className="block gradient-text mt-2">Electronics</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Get the latest gadgets and premium electronics with exclusive deals.
              Free shipping on orders over $100.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center justify-center"
              >
                <span>Shop Now</span>
                <FiArrowRight className="ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-gray-800 text-gray-800 font-bold rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300"
              >
                View Deals
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{feature.title}</p>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Product Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full mb-4">
                    <span className="text-sm font-medium">🔥 FLASH SALE</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Wireless Headphones</h3>
                  <p className="text-blue-100 mb-4">Premium sound quality with noise cancellation</p>
                  
                  <div className="flex items-center mb-6">
                    <div className="text-4xl font-bold">$229</div>
                    <div className="ml-4 px-3 py-1 bg-red-500 rounded-full text-sm">
                      Save 24%
                    </div>
                  </div>
                  
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div className="w-3/4 bg-white rounded-full h-2"></div>
                  </div>
                  <p className="text-sm">Limited stock: 45 left</p>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-2xl">⭐</div>
                  <p className="font-bold">4.8/5</p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-2xl">🚚</div>
                  <p className="font-bold">Free</p>
                  <p className="text-xs text-gray-600">Shipping</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
