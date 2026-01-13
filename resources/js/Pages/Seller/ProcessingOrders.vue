<template>
    <div class="processing-orders">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Processing Orders</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="exportProcessingReport">
          <i class="fas fa-download"></i> Export Report
        </button>
        <button class="btn-primary" @click="bulkShipOrders">
          <i class="fas fa-truck"></i> Ship All
        </button>
      </div>
    </div>

    <!-- Stats Banner -->
    <div class="stats-banner">
      <div class="stat-item">
        <span class="stat-label">Processing:</span>
        <span class="stat-value">{{ processingCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Ready to Ship:</span>
        <span class="stat-value">{{ readyToShipCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Overdue:</span>
        <span class="stat-value danger">{{ overdueCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Avg Processing Time:</span>
        <span class="stat-value">{{ avgProcessingTime }} days</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <select v-model="selectedSort" class="filter-select" @change="sortOrders">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority</option>
          <option value="value">Highest Value</option>
        </select>
        
        <select v-model="selectedStatus" class="filter-select" @change="filterOrders">
          <option value="all">All Processing</option>
          <option value="ready">Ready to Ship</option>
          <option value="delayed">Delayed</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search orders..." 
          class="search-input"
          @input="searchOrders"
        >
        <i class="fas fa-search search-icon"></i>
      </div>
    </div>

    <!-- Orders List -->
    <div class="orders-list">
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <i class="fas fa-cog"></i>
        <h3>No processing orders</h3>
        <p>All orders have been processed or are in a different status.</p>
      </div>

      <div 
        v-for="order in paginatedOrders" 
        :key="order.id" 
        class="order-card"
        :class="getOrderClasses(order)"
      >
        <!-- Order Header -->
        <div class="order-header">
          <div class="order-info">
            <div class="order-id">#{{ order.id }}</div>
            <div class="order-meta">
              <span class="order-date">{{ formatDate(order.date) }}</span>
              <span class="order-days">({{ getDaysInProcessing(order) }} days)</span>
              <span :class="['priority-badge', order.priority]">{{ order.priority }}</span>
            </div>
          </div>
          
          <div class="order-actions">
            <button class="btn-ship" @click="shipOrder(order.id)">
              <i class="fas fa-truck"></i> Ship Order
            </button>
            <button class="btn-delay" @click="delayOrder(order.id)">
              <i class="fas fa-clock"></i> Delay
            </button>
            <button class="btn-details" @click="viewOrderDetails(order)">
              <i class="fas fa-eye"></i> Details
            </button>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="customer-section">
          <div class="customer-info">
            <div class="customer-name">{{ order.customer.name }}</div>
            <div class="customer-contact">
              <i class="fas fa-phone"></i> {{ order.customer.phone }}
            </div>
            <div class="customer-location">
              <i class="fas fa-map-marker-alt"></i> {{ order.customer.location }}
            </div>
          </div>
          
          <div class="order-summary">
            <div class="summary-item">
              <span class="summary-label">Items:</span>
              <span class="summary-value">{{ order.items }} products</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Shipping:</span>
              <span class="summary-value">{{ order.shippingMethod }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Payment:</span>
              <span class="summary-value">{{ order.paymentMethod }}</span>
            </div>
          </div>
        </div>

        <!-- Products List -->
        <div class="products-section">
          <h4>Products to Prepare</h4>
          <div class="products-list">
            <div 
              v-for="product in order.products" 
              :key="product.id" 
              class="product-item"
            >
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="product-details">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-variant">{{ product.variant }}</div>
                <div class="product-quantity">Qty: {{ product.quantity }}</div>
              </div>
              <div class="product-actions">
                <button class="btn-prepare" @click="markAsPrepared(order.id, product.id)">
                  <i class="fas fa-check"></i> Prepared
                </button>
                <button class="btn-backorder" @click="markAsBackorder(order.id, product.id)">
                  <i class="fas fa-exclamation-triangle"></i> Backorder
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Status Progress -->
        <div class="progress-section">
          <div class="progress-header">
            <h4>Order Progress</h4>
            <div class="progress-percentage">{{ getProgressPercentage(order) }}%</div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: getProgressPercentage(order) + '%' }"></div>
          </div>
          <div class="progress-steps">
            <div class="step" :class="{ completed: order.status === 'processing' || order.status === 'ready_to_ship' || order.status === 'shipped' }">
              <i class="fas fa-check-circle"></i>
              <span>Accepted</span>
            </div>
            <div class="step" :class="{ completed: order.status === 'ready_to_ship' || order.status === 'shipped' }">
              <i class="fas fa-box"></i>
              <span>Packaging</span>
            </div>
            <div class="step" :class="{ completed: order.status === 'shipped' }">
              <i class="fas fa-truck"></i>
              <span>Shipped</span>
            </div>
          </div>
        </div>

        <!-- Order Notes -->
        <div v-if="order.notes" class="notes-section">
          <h4>Special Instructions</h4>
          <div class="notes-content">
            {{ order.notes }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-section">
          <div class="action-group">
            <button class="btn-secondary" @click="addNote(order.id)">
              <i class="fas fa-sticky-note"></i> Add Note
            </button>
            <button class="btn-secondary" @click="updateTracking(order.id)">
              <i class="fas fa-shipping-fast"></i> Tracking
            </button>
          </div>
          <div class="action-group">
            <button class="btn-warning" @click="cancelOrder(order.id)">
              <i class="fas fa-times"></i> Cancel Order
            </button>
            <button class="btn-primary" @click="shipOrder(order.id)">
              <i class="fas fa-truck"></i> Ship Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="pagination-btn" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      <div class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <button 
        class="pagination-btn" 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <div class="action-card" @click="prepareShipments">
          <div class="action-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Prepare Shipments</div>
            <div class="action-subtitle">{{ readyToShipCount }} orders ready</div>
          </div>
        </div>

        <div class="action-card" @click="updateAllTracking">
          <div class="action-icon">
            <i class="fas fa-shipping-fast"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Update Tracking</div>
            <div class="action-subtitle">Bulk tracking updates</div>
          </div>
        </div>

        <div class="action-card" @click="generatePackingList">
          <div class="action-icon">
            <i class="fas fa-list"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Generate Packing List</div>
            <div class="action-subtitle">Print packing instructions</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderModal" class="modal-overlay">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Order Details: #{{ selectedOrder?.id }}</h3>
          <button class="btn-close" @click="closeOrderModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="order-details-content">
            <!-- Order Information -->
            <div class="detail-section">
              <h4>Order Information</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Order ID:</span>
                  <span class="info-value">{{ selectedOrder?.id }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Order Date:</span>
                  <span class="info-value">{{ formatDate(selectedOrder?.date) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Status:</span>
                  <span class="info-value">{{ selectedOrder?.status }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Priority:</span>
                  <span class="info-value">{{ selectedOrder?.priority }}</span>
                </div>
              </div>
            </div>

            <!-- Customer Details -->
            <div class="detail-section">
              <h4>Customer Details</h4>
              <div class="customer-details">
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">{{ selectedOrder?.customer.name }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">{{ selectedOrder?.customer.email }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span class="detail-value">{{ selectedOrder?.customer.phone }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">{{ selectedOrder?.customer.address }}</span>
                </div>
              </div>
            </div>

            <!-- Shipping Details -->
            <div class="detail-section">
              <h4>Shipping Information</h4>
              <div class="shipping-details">
                <div class="detail-row">
                  <span class="detail-label">Method:</span>
                  <span class="detail-value">{{ selectedOrder?.shippingMethod }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">{{ selectedOrder?.shippingAddress }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Notes:</span>
                  <span class="detail-value">{{ selectedOrder?.shippingNotes || 'None' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeOrderModal">Close</button>
          <button class="btn-primary" @click="shipOrder(selectedOrder?.id)">Ship Order</button>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ProcessingOrders',
  setup() {
    const searchQuery = ref('')
    const selectedSort = ref('newest')
    const selectedStatus = ref('all')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const showOrderModal = ref(false)
    const selectedOrder = ref(null)

    // Mock order data
    const orders = ref([
      {
        id: 'ORD-2024-001',
        customer: {
          name: 'Maria Santos',
          email: 'maria.santos@example.com',
          phone: '+63 912 345 6789',
          location: 'Manila, Philippines',
          address: '123 Rizal Street, Manila, 1000'
        },
        products: [
          {
            id: 1,
            name: 'Handwoven Abaca Bag',
            variant: 'Large, Natural',
            quantity: 2,
            price: 2200,
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image',
            prepared: false,
            backorder: false
          },
          {
            id: 2,
            name: 'Traditional Weaving Set',
            variant: 'Standard',
            quantity: 1,
            price: 1900,
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image',
            prepared: false,
            backorder: false
          }
        ],
        subtotal: 6300,
        shipping: 150,
        discount: 0,
        total: 6450,
        paymentMethod: 'Cash on Delivery',
        shippingMethod: 'Standard Shipping',
        status: 'processing',
        priority: 'normal',
        date: '2024-01-14T10:30:00',
        notes: 'Please handle with care. Fragile items.',
        shippingAddress: '123 Rizal Street, Manila, 1000',
        shippingNotes: 'Leave at front door if no one is home.',
        trackingNumber: '',
        preparedItems: 0
      },
      {
        id: 'ORD-2024-002',
        customer: {
          name: 'Juan Dela Cruz',
          email: 'juan.delacruz@example.com',
          phone: '+63 923 456 7890',
          location: 'Cebu, Philippines',
          address: '456 Colon Street, Cebu City, 6000'
        },
        products: [
          {
            id: 3,
            name: 'Bamboo Home Decor',
            variant: 'Set of 3',
            quantity: 1,
            price: 1800,
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image',
            prepared: true,
            backorder: false
          }
        ],
        subtotal: 1800,
        shipping: 200,
        discount: 100,
        total: 1900,
        paymentMethod: 'Credit Card',
        shippingMethod: 'Express Shipping',
        status: 'ready_to_ship',
        priority: 'urgent',
        date: '2024-01-13T14:20:00',
        notes: 'Urgent delivery needed.',
        shippingAddress: '456 Colon Street, Cebu City, 6000',
        shippingNotes: 'Call before delivery.',
        trackingNumber: '',
        preparedItems: 1
      },
      {
        id: 'ORD-2024-003',
        customer: {
          name: 'Ana Reyes',
          email: 'ana.reyes@example.com',
          phone: '+63 934 567 8901',
          location: 'Davao, Philippines',
          address: '789 Ramon Magsaysay Ave, Davao City, 8000'
        },
        products: [
          {
            id: 4,
            name: 'Handmade Pottery Set',
            variant: 'Complete Set',
            quantity: 1,
            price: 3500,
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image',
            prepared: false,
            backorder: true
          },
          {
            id: 5,
            name: 'Wooden Spoon Set',
            variant: '5-piece',
            quantity: 2,
            price: 850,
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image',
            prepared: true,
            backorder: false
          }
        ],
        subtotal: 5200,
        shipping: 250,
        discount: 0,
        total: 5450,
        paymentMethod: 'GCash',
        shippingMethod: 'Standard Shipping',
        status: 'processing',
        priority: 'delayed',
        date: '2024-01-10T16:45:00',
        notes: 'Gift wrapping requested.',
        shippingAddress: '789 Ramon Magsaysay Ave, Davao City, 8000',
        shippingNotes: 'Please include gift card.',
        trackingNumber: '',
        preparedItems: 1
      }
    ])

    const filteredOrders = computed(() => {
      let filtered = orders.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.location.toLowerCase().includes(query)
        )
      }

      // Status filter
      if (selectedStatus.value !== 'all') {
        switch (selectedStatus.value) {
          case 'ready':
            filtered = filtered.filter(order => order.status === 'ready_to_ship')
            break
          case 'delayed':
            filtered = filtered.filter(order => order.priority === 'delayed')
            break
          case 'urgent':
            filtered = filtered.filter(order => order.priority === 'urgent')
            break
        }
      }

      // Sort
      filtered.sort((a, b) => {
        switch (selectedSort.value) {
          case 'newest':
            return new Date(b.date) - new Date(a.date)
          case 'oldest':
            return new Date(a.date) - new Date(b.date)
          case 'priority':
            const priorityOrder = { urgent: 3, normal: 2, delayed: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          case 'value':
            return b.total - a.total
          default:
            return 0
        }
      })

      return filtered
    })

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredOrders.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredOrders.value.length / itemsPerPage)
    })

    const processingCount = computed(() => {
      return orders.value.filter(o => o.status === 'processing' || o.status === 'ready_to_ship').length
    })

    const readyToShipCount = computed(() => {
      return orders.value.filter(o => o.status === 'ready_to_ship').length
    })

    const overdueCount = computed(() => {
      return orders.value.filter(o => o.priority === 'delayed').length
    })

    const avgProcessingTime = computed(() => {
      const processingOrders = orders.value.filter(o => o.status === 'processing' || o.status === 'ready_to_ship')
      if (processingOrders.length === 0) return 0
      
      const totalDays = processingOrders.reduce((total, order) => {
        const days = getDaysInProcessing(order)
        return total + days
      }, 0)
      
      return Math.round(totalDays / processingOrders.length)
    })

    const getOrderClasses = (order) => {
      return {
        'priority-urgent': order.priority === 'urgent',
        'priority-delayed': order.priority === 'delayed',
        'ready-to-ship': order.status === 'ready_to_ship'
      }
    }

    const getDaysInProcessing = (order) => {
      const now = new Date()
      const orderDate = new Date(order.date)
      const diffTime = now - orderDate
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const getProgressPercentage = (order) => {
      const totalItems = order.products.length
      const preparedItems = order.products.filter(p => p.prepared).length
      return Math.round((preparedItems / totalItems) * 100)
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const filterOrders = () => {
      currentPage.value = 1
    }

    const searchOrders = () => {
      currentPage.value = 1
    }

    const sortOrders = () => {
      // Sorting is handled in computed property
    }

    const changePage = (page) => {
      currentPage.value = page
    }

    const shipOrder = (orderId) => {
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        if (order.status === 'ready_to_ship') {
          order.status = 'shipped'
          alert(`Order ${orderId} has been shipped!`)
        } else {
          alert('Order must be ready to ship before shipping.')
        }
      }
    }

    const delayOrder = (orderId) => {
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.priority = 'delayed'
        alert(`Order ${orderId} has been marked as delayed.`)
      }
    }

    const markAsPrepared = (orderId, productId) => {
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        const product = order.products.find(p => p.id === productId)
        if (product) {
          product.prepared = true
          order.preparedItems++
          alert(`Product has been marked as prepared.`)
        }
      }
    }

    const markAsBackorder = (orderId, productId) => {
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        const product = order.products.find(p => p.id === productId)
        if (product) {
          product.backorder = true
          alert(`Product has been marked as backorder.`)
        }
      }
    }

    const viewOrderDetails = (order) => {
      selectedOrder.value = order
      showOrderModal.value = true
    }

    const closeOrderModal = () => {
      showOrderModal.value = false
      selectedOrder.value = null
    }

    const addNote = (orderId) => {
      const note = prompt('Add a note to this order:')
      if (note) {
        alert('Note added successfully!')
      }
    }

    const updateTracking = (orderId) => {
      const tracking = prompt('Enter tracking number:')
      if (tracking) {
        const order = orders.value.find(o => o.id === orderId)
        if (order) {
          order.trackingNumber = tracking
          alert('Tracking number updated!')
        }
      }
    }

    const cancelOrder = (orderId) => {
      if (confirm('Are you sure you want to cancel this order?')) {
        const order = orders.value.find(o => o.id === orderId)
        if (order) {
          order.status = 'cancelled'
          alert(`Order ${orderId} has been cancelled.`)
        }
      }
    }

    const exportProcessingReport = () => {
      alert('Exporting processing report...')
    }

    const bulkShipOrders = () => {
      const readyOrders = orders.value.filter(o => o.status === 'ready_to_ship')
      if (readyOrders.length > 0) {
        readyOrders.forEach(order => {
          order.status = 'shipped'
        })
        alert(`Shipped ${readyOrders.length} orders!`)
      } else {
        alert('No orders ready to ship.')
      }
    }

    const prepareShipments = () => {
      alert('Preparing shipments for ready orders...')
    }

    const updateAllTracking = () => {
      alert('Updating tracking for all shipped orders...')
    }

    const generatePackingList = () => {
      alert('Generating packing list...')
    }

    return {
      searchQuery,
      selectedSort,
      selectedStatus,
      currentPage,
      showOrderModal,
      selectedOrder,
      orders,
      filteredOrders,
      paginatedOrders,
      totalPages,
      processingCount,
      readyToShipCount,
      overdueCount,
      avgProcessingTime,
      getOrderClasses,
      getDaysInProcessing,
      getProgressPercentage,
      formatCurrency,
      formatDate,
      filterOrders,
      searchOrders,
      sortOrders,
      changePage,
      shipOrder,
      delayOrder,
      markAsPrepared,
      markAsBackorder,
      viewOrderDetails,
      closeOrderModal,
      addNote,
      updateTracking,
      cancelOrder,
      exportProcessingReport,
      bulkShipOrders,
      prepareShipments,
      updateAllTracking,
      generatePackingList
    }
  }
}
</script>

<style scoped>
.processing-orders {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.stats-banner {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-value.danger {
  color: #ef4444;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #9ca3af;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.order-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.order-card.priority-urgent {
  border-left: 4px solid #ef4444;
  animation: pulse 2s infinite;
}

.order-card.priority-delayed {
  border-left: 4px solid #f59e0b;
}

.order-card.ready-to-ship {
  border-left: 4px solid #10b981;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-id {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.order-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.order-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.order-days {
  font-size: 0.75rem;
  color: #9ca3af;
  background-color: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.priority-badge {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.urgent {
  background-color: #fee2e2;
  color: #991b1b;
}

.priority-badge.delayed {
  background-color: #fef3c7;
  color: #92400e;
}

.priority-badge.normal {
  background-color: #dbeafe;
  color: #1e40af;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-ship {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-ship:hover {
  background-color: #059669;
}

.btn-delay {
  background-color: #f59e0b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-delay:hover {
  background-color: #d97706;
}

.btn-details {
  background-color: #6b7280;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-details:hover {
  background-color: #4b5563;
}

.customer-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.customer-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.customer-contact,
.customer-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.summary-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.summary-value {
  font-weight: 500;
  color: #374151;
}

.products-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: grid;
  grid-template-columns: 80px 2fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  align-items: center;
}

.product-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-weight: 600;
  color: #1f2937;
}

.product-variant {
  font-size: 0.75rem;
  color: #6b7280;
}

.product-quantity {
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #e5e7eb;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  display: inline-block;
  width: fit-content;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-prepare {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background-color 0.2s;
}

.btn-prepare:hover {
  background-color: #059669;
}

.btn-backorder {
  background-color: #f59e0b;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background-color 0.2s;
}

.btn-backorder:hover {
  background-color: #d97706;
}

.progress-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.progress-percentage {
  font-weight: 700;
  color: #3b82f6;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.75rem;
  position: relative;
}

.step.completed {
  color: #10b981;
  font-weight: 600;
}

.step i {
  font-size: 1.25rem;
}

.notes-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.notes-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.notes-content {
  color: #374151;
  line-height: 1.5;
}

.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.action-group {
  display: flex;
  gap: 0.5rem;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-warning:hover {
  background-color: #d97706;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #f3f4f6;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.quick-actions h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 50px;
  height: 50px;
  background: #f3f4f6;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1.25rem;
}

.action-content {
  flex: 1;
}

.action-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.action-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  padding: 0;
  max-width: 800px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-lg {
  max-width: 1000px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.btn-close:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.order-details-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-section h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.info-value {
  font-weight: 500;
  color: #374151;
}

.customer-details,
.shipping-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.detail-value {
  font-weight: 500;
  color: #374151;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Responsive styles */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-container {
    width: 100%;
  }
  
  .customer-section {
    grid-template-columns: 1fr;
  }
  
  .product-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .product-image {
    height: 120px;
  }
  
  .progress-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .action-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .order-details-content {
    grid-template-columns: 1fr;
  }
  
  .modal-lg {
    max-width: 90vw;
  }
}
</style>