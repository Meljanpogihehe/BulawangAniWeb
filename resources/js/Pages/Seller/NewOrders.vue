<template>
    <div class="new-orders">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">New Orders</h1>
        <div class="header-actions">
          <button class="btn-secondary" @click="refreshOrders">
            <i class="fas fa-refresh"></i> Refresh
          </button>
          <button class="btn-primary" @click="bulkAcceptOrders">
            <i class="fas fa-check-double"></i> Accept All
          </button>
        </div>
      </div>

      <!-- Order Stats -->
      <div class="stats-banner">
        <div class="stat-item">
          <span class="stat-label">New Orders:</span>
          <span class="stat-value">{{ newOrdersCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Pending Acceptance:</span>
          <span class="stat-value">{{ pendingOrdersCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Value:</span>
          <span class="stat-value">₱{{ formatCurrency(totalValue) }}</span>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <select v-model="selectedTimeFilter" class="filter-select" @change="filterOrders">
            <option value="all">All Orders</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
          <select v-model="selectedSort" class="filter-select" @change="sortOrders">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Value</option>
            <option value="lowest">Lowest Value</option>
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
          <i class="fas fa-shopping-bag"></i>
          <h3>No new orders</h3>
          <p>You don't have any new orders to process at this time.</p>
        </div>

        <div
          v-for="order in paginatedOrders"
          :key="order.id"
          class="order-card"
          :class="{ 'high-value': order.total > 5000, 'urgent': isUrgent(order) }"
        >
          <!-- Order Header -->
          <div class="order-header">
            <div class="order-info">
              <div class="order-id">#{{ order.id }}</div>
              <div class="order-time">{{ formatTime(order.date) }}</div>
              <div class="order-date">{{ formatDate(order.date) }}</div>
            </div>
            
            <div class="order-actions">
              <button
                class="btn-accept"
                @click="acceptOrder(order.id)"
                :disabled="order.status !== 'pending'"
              >
                <i class="fas fa-check"></i> Accept Order
              </button>
              <button
                class="btn-reject"
                @click="rejectOrder(order.id)"
                :disabled="order.status !== 'pending'"
              >
                <i class="fas fa-times"></i> Reject
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
                <span class="summary-label">Payment:</span>
                <span class="summary-value">{{ order.paymentMethod }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Shipping:</span>
                <span class="summary-value">{{ order.shippingMethod }}</span>
              </div>
            </div>
          </div>

          <!-- Products List -->
          <div class="products-section">
            <h4>Products</h4>
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
                <div class="product-price">
                  <div class="unit-price">₱{{ formatCurrency(product.price) }}</div>
                  <div class="total-price">₱{{ formatCurrency(product.price * product.quantity) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Totals -->
          <div class="totals-section">
            <div class="totals-grid">
              <div class="total-item">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">₱{{ formatCurrency(order.subtotal) }}</span>
              </div>
              <div class="total-item">
                <span class="total-label">Shipping:</span>
                <span class="total-value">₱{{ formatCurrency(order.shipping) }}</span>
              </div>
              <div class="total-item">
                <span class="total-label">Discount:</span>
                <span class="total-value">-₱{{ formatCurrency(order.discount) }}</span>
              </div>
              <div class="total-item grand-total">
                <span class="total-label">Total:</span>
                <span class="total-value">₱{{ formatCurrency(order.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Order Notes -->
          <div v-if="order.notes" class="notes-section">
            <h4>Customer Notes</h4>
            <div class="notes-content">
              {{ order.notes }}
            </div>
          </div>

          <!-- Order Status -->
          <div class="status-section">
            <div class="status-badge" :class="order.status">{{ order.status }}</div>
            <div class="status-timeline">
              <div class="timeline-item" :class="{ active: order.status === 'pending' }">
                <i class="fas fa-clock"></i>
                <span>Order Received</span>
              </div>
              <div class="timeline-item" :class="{ active: order.status === 'accepted' }">
                <i class="fas fa-check"></i>
                <span>Order Accepted</span>
              </div>
              <div class="timeline-item" :class="{ active: order.status === 'processing' }">
                <i class="fas fa-cog"></i>
                <span>Processing</span>
              </div>
              <div class="timeline-item" :class="{ active: order.status === 'shipped' }">
                <i class="fas fa-truck"></i>
                <span>Shipped</span>
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
          <div class="action-card" @click="viewPendingOrders">
            <div class="action-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="action-content">
              <div class="action-title">{{ pendingOrdersCount }} Pending Orders</div>
              <div class="action-subtitle">Review and accept orders</div>
            </div>
          </div>

          <div class="action-card" @click="prepareShipments">
            <div class="action-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Prepare Shipments</div>
              <div class="action-subtitle">Pack and prepare orders</div>
            </div>
          </div>

          <div class="action-card" @click="updateTracking">
            <div class="action-icon">
              <i class="fas fa-shipping-fast"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Update Tracking</div>
              <div class="action-subtitle">Add tracking numbers</div>
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
              <!-- Customer Details -->
              <div class="detail-section">
                <h4>Customer Information</h4>
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
            <button class="btn-primary" @click="acceptOrder(selectedOrder?.id)">Accept Order</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'NewOrders',
  setup() {
    const searchQuery = ref('')
    const selectedTimeFilter = ref('all')
    const selectedSort = ref('newest')
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
            image: '/images/products/bag1.jpg'
          },
          {
            id: 2,
            name: 'Traditional Weaving Set',
            variant: 'Standard',
            quantity: 1,
            price: 1900,
            image: '/images/products/weaving1.jpg'
          }
        ],
        subtotal: 6300,
        shipping: 150,
        discount: 0,
        total: 6450,
        paymentMethod: 'Cash on Delivery',
        shippingMethod: 'Standard Shipping',
        status: 'pending',
        date: '2024-01-15T10:30:00',
        notes: 'Please handle with care. Fragile items.',
        shippingAddress: '123 Rizal Street, Manila, 1000',
        shippingNotes: 'Leave at front door if no one is home.'
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
            image: '/images/products/decor1.jpg'
          }
        ],
        subtotal: 1800,
        shipping: 200,
        discount: 100,
        total: 1900,
        paymentMethod: 'Credit Card',
        shippingMethod: 'Express Shipping',
        status: 'pending',
        date: '2024-01-15T14:20:00',
        notes: 'Urgent delivery needed.',
        shippingAddress: '456 Colon Street, Cebu City, 6000',
        shippingNotes: 'Call before delivery.'
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
            image: '/images/products/pottery1.jpg'
          },
          {
            id: 5,
            name: 'Wooden Spoon Set',
            variant: '5-piece',
            quantity: 2,
            price: 850,
            image: '/images/products/spoon1.jpg'
          }
        ],
        subtotal: 5200,
        shipping: 250,
        discount: 0,
        total: 5450,
        paymentMethod: 'GCash',
        shippingMethod: 'Standard Shipping',
        status: 'accepted',
        date: '2024-01-14T16:45:00',
        notes: 'Gift wrapping requested.',
        shippingAddress: '789 Ramon Magsaysay Ave, Davao City, 8000',
        shippingNotes: 'Please include gift card.'
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

      // Time filter
      if (selectedTimeFilter.value !== 'all') {
        const now = new Date()
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.date)
          const diffTime = now - orderDate
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          
          switch (selectedTimeFilter.value) {
            case 'today':
              return diffDays === 0
            case 'week':
              return diffDays <= 7
            case 'month':
              return diffDays <= 30
            default:
              return true
          }
        })
      }

      // Sort
      filtered.sort((a, b) => {
        switch (selectedSort.value) {
          case 'newest':
            return new Date(b.date) - new Date(a.date)
          case 'oldest':
            return new Date(a.date) - new Date(b.date)
          case 'highest':
            return b.total - a.total
          case 'lowest':
            return a.total - b.total
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

    const newOrdersCount = computed(() => {
      return orders.value.filter(o => o.status === 'pending').length
    })

    const pendingOrdersCount = computed(() => {
      return orders.value.filter(o => o.status === 'pending').length
    })

    const totalValue = computed(() => {
      return orders.value
        .filter(o => o.status === 'pending')
        .reduce((total, order) => total + order.total, 0)
    })

    const isUrgent = (order) => {
      return order.notes && order.notes.toLowerCase().includes('urgent')
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

    const formatTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit'
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

    const acceptOrder = (orderId) => {
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = 'accepted'
        alert(`Order ${orderId} has been accepted!`)
      }
    }

    const rejectOrder = (orderId) => {
      if (confirm('Are you sure you want to reject this order?')) {
        const order = orders.value.find(o => o.id === orderId)
        if (order) {
          order.status = 'rejected'
          alert(`Order ${orderId} has been rejected.`)
        }
      }
    }

    const refreshOrders = () => {
      // Simulate fetching new orders
      alert('Orders refreshed!')
    }

    const bulkAcceptOrders = () => {
      const pendingOrders = orders.value.filter(o => o.status === 'pending')
      if (pendingOrders.length > 0) {
        pendingOrders.forEach(order => {
          order.status = 'accepted'
        })
        alert(`Accepted ${pendingOrders.length} orders!`)
      } else {
        alert('No pending orders to accept.')
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

    const viewPendingOrders = () => {
      selectedTimeFilter.value = 'all'
      // Filter will be applied automatically
    }

    const prepareShipments = () => {
      alert('Preparing shipments for accepted orders...')
    }

    const updateTracking = () => {
      alert('Updating tracking information...')
    }

    return {
      searchQuery,
      selectedTimeFilter,
      selectedSort,
      currentPage,
      showOrderModal,
      selectedOrder,
      orders,
      filteredOrders,
      paginatedOrders,
      totalPages,
      newOrdersCount,
      pendingOrdersCount,
      totalValue,
      isUrgent,
      formatCurrency,
      formatDate,
      formatTime,
      filterOrders,
      searchOrders,
      sortOrders,
      changePage,
      acceptOrder,
      rejectOrder,
      refreshOrders,
      bulkAcceptOrders,
      viewOrderDetails,
      closeOrderModal,
      viewPendingOrders,
      prepareShipments,
      updateTracking
    }
  }
}
</script>

<style scoped>
.new-orders {
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

.order-card.high-value {
  border-left: 4px solid #10b981;
}

.order-card.urgent {
  border-left: 4px solid #ef4444;
  animation: pulse 2s infinite;
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

.order-time {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.order-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-accept {
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

.btn-accept:hover {
  background-color: #059669;
}

.btn-reject {
  background-color: #ef4444;
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

.btn-reject:hover {
  background-color: #dc2626;
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

.product-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.unit-price {
  font-size: 0.75rem;
  color: #6b7280;
}

.total-price {
  font-weight: 600;
  color: #1f2937;
}

.totals-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.totals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.total-value {
  font-weight: 700;
  color: #1f2937;
}

.grand-total {
  grid-column: 1 / -1;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
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

.status-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: #fef3c7;
  color: #92400e;
}

.status-timeline {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.75rem;
}

.timeline-item.active {
  color: #3b82f6;
  font-weight: 600;
}

.timeline-item i {
  font-size: 1.25rem;
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
  
  .totals-grid {
    grid-template-columns: 1fr;
  }
  
  .order-details-content {
    grid-template-columns: 1fr;
  }
  
  .modal-lg {
    max-width: 90vw;
  }
}
</style>