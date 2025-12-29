import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiUser, FiPhone, FiMail, FiMapPin, FiDollarSign, FiCheck, FiX, FiEye } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const CheckoutsManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (234) 567-8900",
        whatsapp: "+1 (234) 567-8900",
        address: "123 Main Street, Apt 4B, New York, NY 10001"
      },
      items: [
        { name: "Wireless Headphones", quantity: 1, price: 229.99 }
      ],
      total: 229.99,
      status: "pending",
      date: "2024-01-15",
      payment: "Credit Card",
      shipping: "Standard"
    },
    {
      id: 2,
      orderNumber: "ORD-2024-002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 (345) 678-9012",
        whatsapp: "+1 (345) 678-9012",
        address: "456 Oak Avenue, Los Angeles, CA 90001"
      },
      items: [
        { name: "Smart Watch Pro", quantity: 1, price: 349.99 },
        { name: "Bluetooth Speaker", quantity: 2, price: 129.99 }
      ],
      total: 609.97,
      status: "completed",
      date: "2024-01-14",
      payment: "PayPal",
      shipping: "Express"
    },
    {
      id: 3,
      orderNumber: "ORD-2024-003",
      customer: {
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "+1 (456) 789-0123",
        address: "789 Pine Road, Chicago, IL 60601"
      },
      items: [
        { name: "Gaming Laptop", quantity: 1, price: 2199.99 }
      ],
      total: 2199.99,
      status: "processing",
      date: "2024-01-15",
      payment: "Bank Transfer",
      shipping: "Standard"
    }
  ])

  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    toast.success(`Order #${orderId} status updated to ${newStatus}`)
  }

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Orders Management</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Orders', value: orders.length, color: 'blue' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'yellow' },
          { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'blue' },
          { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: 'green' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
                <FiPackage />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Order Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select className="w-full px-4 py-2 border rounded-lg">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Custom range</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">&nbsp;</label>
            <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
              Export Orders
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Order Header */}
            <div className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-4">
                  <h3 className="font-bold text-xl">{order.orderNumber}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600">Placed on {order.date}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600 flex items-center">
                    <FiDollarSign className="mr-1" />
                    {order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{order.payment} • {order.shipping}</p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <FiUser className="mr-2" />
                    Customer Information
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <FiUser className="mr-2 text-gray-400" />
                      <span className="font-medium">{order.customer.name}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <FiMail className="mr-2 text-gray-400" />
                      <span>{order.customer.email}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <FiPhone className="mr-2 text-gray-400" />
                      <span>{order.customer.phone}</span>
                    </div>
                    
                    {order.customer.whatsapp && (
                      <div className="flex items-center text-sm">
                        <FiMail className="mr-2 text-gray-400" />
                        <span>WhatsApp: {order.customer.whatsapp}</span>
                      </div>
                    )}
                    
                    <div className="flex items-start text-sm mt-4">
                      <FiMapPin className="mr-2 text-gray-400 mt-1" />
                      <span>{order.customer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <FiPackage className="mr-2" />
                    Order Items
                  </h4>
                  
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h4 className="font-semibold mb-3">Order Actions</h4>
                  
                  <div className="space-y-3">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                        >
                          <FiCheck className="mr-2" />
                          Start Processing
                        </button>
                        
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                        >
                          <FiX className="mr-2" />
                          Cancel Order
                        </button>
                      </>
                    )}
                    
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                      >
                        <FiCheck className="mr-2" />
                        Mark as Completed
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center justify-center"
                    >
                      <FiEye className="mr-2" />
                      View Details
                    </button>
                    
                    <button className="w-full px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition">
                      Print Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default CheckoutsManagement
