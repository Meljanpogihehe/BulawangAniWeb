import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [
      {
        id: 'BA-10234',
        date: 'Jan 5, 2026',
        status: 'Delivered',
        total: 1250,
        subtotal: 1150,
        deliveryFee: 100,
        items: [
          {
            name: 'Premium Dinorado Rice',
            price: '2,250',
            unit: '25kg bag',
            quantity: 1,
            img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400'
          }
        ],
        delivery: {
          name: 'Juan Dela Cruz',
          phone: '+63 917 123 4567',
          address: '123 Poblacion St, Bulacan, Philippines'
        },
        payment: {
          method: 'Cash on Delivery',
          status: 'Paid'
        },
        timeline: [
          { title: 'Order Placed', time: 'Jan 5, 9:30 AM', completed: true },
          { title: 'Preparing Order', time: 'Jan 5, 10:15 AM', completed: true },
          { title: 'Out for Delivery', time: 'Jan 5, 2:30 PM', completed: true },
          { title: 'Delivered', time: 'Jan 5, 4:45 PM', completed: true }
        ]
      },
      {
        id: 'BA-10233',
        date: 'Jan 3, 2026',
        status: 'On the Way',
        total: 850,
        subtotal: 750,
        deliveryFee: 100,
        items: [
          {
            name: 'Organic Benguet Tomatoes',
            price: '120',
            unit: 'kg',
            quantity: 2,
            img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400'
          },
          {
            name: 'Davao Golden Bananas',
            price: '85',
            unit: 'bunch',
            quantity: 3,
            img: 'https://images.unsplash.com/photo-1571771894821-ad99026107b8?auto=format&fit=crop&q=80&w=400'
          }
        ],
        delivery: {
          name: 'Juan Dela Cruz',
          phone: '+63 917 123 4567',
          address: '123 Poblacion St, Bulacan, Philippines'
        },
        payment: {
          method: 'GCash',
          status: 'Paid'
        },
        timeline: [
          { title: 'Order Placed', time: 'Jan 3, 11:20 AM', completed: true },
          { title: 'Preparing Order', time: 'Jan 3, 12:00 PM', completed: true },
          { title: 'Out for Delivery', time: 'Jan 3, 3:15 PM', completed: true },
          { title: 'Delivered', time: 'Expected: Jan 3, 5:00 PM', completed: false }
        ]
      }
    ]
  }),

  getters: {
    totalOrders: (state) => state.orders.length,
    deliveredOrders: (state) => state.orders.filter(order => order.status === 'Delivered').length,
    pendingOrders: (state) => state.orders.filter(order => order.status === 'Preparing' || order.status === 'On the Way').length
  },

  actions: {
    addOrder(orderData) {
      const newOrder = {
        ...orderData,
        id: `BA-${Date.now().toString().slice(-5)}`,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        timeline: [
          { title: 'Order Placed', time: new Date().toLocaleString(), completed: true },
          { title: 'Preparing Order', time: 'In Progress', completed: true },
          { title: 'Out for Delivery', time: 'Pending', completed: false },
          { title: 'Delivered', time: 'Pending', completed: false }
        ]
      }
      
      this.orders.unshift(newOrder)
      return newOrder
    },

    updateOrderStatus(orderId, status) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
        
        // Update timeline based on status
        const now = new Date().toLocaleString()
        if (status === 'Preparing') {
          order.timeline[1].time = now
          order.timeline[1].completed = true
        } else if (status === 'On the Way') {
          order.timeline[2].time = now
          order.timeline[2].completed = true
        } else if (status === 'Delivered') {
          order.timeline[3].time = now
          order.timeline[3].completed = true
        }
      }
    },

    removeOrder(orderId) {
      const index = this.orders.findIndex(o => o.id === orderId)
      if (index > -1) {
        this.orders.splice(index, 1)
      }
    }
  },

  persist: true
})