'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiPackage, FiUsers, FiShoppingBag, FiTrendingUp, FiDollarSign, FiShoppingCart, FiUserPlus } from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import AdminLayout from '@/components/Admin/AdminLayout'
import ItemsManagement from '@/components/Admin/ItemsManagement'
import UsersManagement from '@/components/Admin/UsersManagement'
import CheckoutsManagement from '@/components/Admin/CheckoutsManagement'

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'dashboard'

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login')
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  const renderContent = () => {
    switch (tab) {
      case 'items':
        return <ItemsManagement />
      case 'users':
        return <UsersManagement />
      case 'checkouts':
        return <CheckoutsManagement />
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <h1 className="text-4xl font-bold gradient-text mb-4">
                Welcome to Admin Panel
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Manage your e-commerce store, products, orders, and users from one place
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Total Products',
                  value: '24',
                  icon: <FiShoppingBag />,
                  color: 'from-blue-500 to-blue-600',
                  link: '/admin?tab=items'
                },
                {
                  title: 'Total Orders',
                  value: '156',
                  icon: <FiPackage />,
                  color: 'from-green-500 to-green-600',
                  link: '/admin?tab=checkouts'
                },
                {
                  title: 'Active Users',
                  value: '89',
                  icon: <FiUsers />,
                  color: 'from-purple-500 to-purple-600',
                  link: '/admin?tab=users'
                },
                {
                  title: 'Revenue',
                  value: '$12,458',
                  icon: <FiDollarSign />,
                  color: 'from-yellow-500 to-yellow-600',
                  link: '#'
                }
              ].map((stat, index) => (
                <motion.a
                  key={stat.title}
                  href={stat.link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block"
                >
                  <div className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm opacity-90">{stat.title}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <div className="text-2xl">{stat.icon}</div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                <div className="space-y-4">
                  {[
                    { id: '#ORD-001', customer: 'John Doe', amount: '$299.99', status: 'Processing' },
                    { id: '#ORD-002', customer: 'Jane Smith', amount: '$149.99', status: 'Shipped' },
                    { id: '#ORD-003', customer: 'Bob Johnson', amount: '$499.99', status: 'Delivered' },
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push('/admin?tab=items')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-center group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform text-blue-600">
                      <FiShoppingBag />
                    </div>
                    <p className="font-semibold">Add Product</p>
                  </button>
                  
                  <button
                    onClick={() => router.push('/admin?tab=checkouts')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 text-center group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform text-green-600">
                      <FiShoppingCart />
                    </div>
                    <p className="font-semibold">View Orders</p>
                  </button>
                  
                  <button
                    onClick={() => router.push('/admin?tab=users')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 text-center group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform text-purple-600">
                      <FiUsers />
                    </div>
                    <p className="font-semibold">Manage Users</p>
                  </button>
                  
                  <button
                    onClick={() => router.push('/admin?tab=items')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-300 text-center group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform text-yellow-600">
                      <FiTrendingUp />
                    </div>
                    <p className="font-semibold">Analytics</p>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )
    }
  }

  return (
    <AdminLayout activeTab={tab}>
      {renderContent()}
    </AdminLayout>
  )
}