<template>
    <div class="cancelled-orders">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Cancelled / Returned Orders</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="exportCancelledReport">
          <i class="fas fa-download"></i> Export Report
        </button>
        <button class="btn-primary" @click="analyzeTrends">
          <i class="fas fa-chart-line"></i> Analyze Trends
        </button>
      </div>
    </div>

    <!-- Stats Banner -->
    <div class="stats-banner">
      <div class="stat-item">
        <span class="stat-label">Total Cancelled:</span>
        <span class="stat-value">{{ cancelledCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total Returned:</span>
        <span class="stat-value">{{ returnedCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Refund Amount:</span>
        <span class="stat-value">₱{{ formatCurrency(totalRefundAmount) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Cancellation Rate:</span>
        <span class="stat-value danger">{{ cancellationRate }}%</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <select v-model="selectedType" class="filter-select" @change="filterOrders">
          <option value="all">All Orders</option>
          <option value="cancelled">Cancelled Only</option>
          <option value="returned">Returned Only</option>
        </select>
        
        <select v-model="selectedReason" class="filter-select" @change="filterOrders">
          <option value="all">All Reasons</option>
          <option value="customer">Customer Request</option>
          <option value="stock">Out of Stock</option>
          <option value="payment">Payment Issue</option>
          <option value="shipping">Shipping Issue</option>
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
        <i class="fas fa-times-circle"></i>
        <h3>No cancelled or returned orders</h3>
        <p>No orders have been cancelled or returned.</p>
      </div>

      <div 
        v-for="order in paginatedOrders" 
        :key="order.id" 
        class="order-card"
        :class="{ 'cancelled': order.type === 'cancelled', 'returned': order.type === 'returned' }"
      >
        <!-- Order Header -->
        <div class="order-header">
          <div class="order-info">
            <div class="order-id">#{{ order.id }}</div>
            <div class="order-meta">
              <span class="order-date">{{ formatDate(order.date) }}</span>
              <span class="order-status">{{ order.type }}</span>
              <span class="order-reason">{{ order.reason }}</span>
            </div>
          </div>
          
          <div class="order-actions">
            <button class="btn-view" @click="viewOrderDetails(order)">
              <i class="fas fa-eye"></i> View Details
            </button>
            <button class="btn-refund" v-if="order.type === 'returned'" @click="processRefund(order)">
              <i class="fas fa-money-bill-wave"></i> Process Refund
            </button>
            <button class="btn-contact" @click="contactCustomer(order)">
              <i class="fas fa-comments"></i> Contact Customer
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
              <span class="summary-label">Order Value:</span>
              <span class="summary-value">₱{{ formatCurrency(order.total) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Refund:</span>
              <span class="summary-value">₱{{ formatCurrency(order.refundAmount) }}</span>
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
                <div v-if="order.type === 'returned'" class="return-reason">
                  Reason: {{ product.returnReason }}
                </div>
              </div>
              <div class="product-price">
                <div class="unit-price">₱{{ formatCurrency(product.price) }}</div>
                <div class="total-price">₱{{ formatCurrency(product.price * product.quantity) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Details -->
        <div class="details-section">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Cancellation/Return Date:</span>
              <span class="detail-value">{{ formatDate(order.cancelledDate || order.returnedDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Reason:</span>
              <span class="detail-value">{{ order.reason }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Notes:</span>
              <span class="detail-value">{{ order.notes || 'None' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Refund Status:</span>
              <span class="detail-value">{{ order.refundStatus }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-section">
          <div class="action-group">
            <button class="btn-secondary" @click="addNote(order.id)">
              <i class="fas fa-sticky-note"></i> Add Note
            </button>
            <button class="btn-secondary" @click="viewHistory(order.id)">
              <i class="fas fa-history"></i> View History
            </button>
          </div>
          <div class="action-group">
            <button class="btn-warning" v-if="order.type === 'cancelled'" @click="restockItems(order)">
              <i class="fas fa-warehouse"></i> Restock Items
            </button>
            <button class="btn-danger" @click="deleteOrder(order.id)">
              <i class="fas fa-trash"></i> Delete Order
            </button>
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

    <!-- Insights Section -->
    <div class="insights-section">
      <h3>Insights & Analytics</h3>
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon">
            <i class="fas fa-chart-pie"></i>
          </div>
          <div class="insight-content">
            <div class="insight-title">Top Cancellation Reasons</div>
            <div class="insight-data">
              <div v-for="reason in topReasons" :key="reason.name" class="reason-item">
                <span class="reason-name">{{ reason.name }}</span>
                <span class="reason-count">{{ reason.count }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="insight-card">
          <div class="insight-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="insight-content">
            <div class="insight-title">Average Response Time</div>
            <div class="insight-value">{{ avgResponseTime }} hours</div>
            <div class="insight-subtitle">Time to process cancellations/returns</div>
          </div>
        </div>
        
        <div class="insight-card">
          <div class="insight-icon">
            <i class="fas fa-tags"></i>
          </div>
          <div class="insight-content">
            <div class="insight-title">Most Affected Products</div>
            <div class="insight-data">
              <div v-for="product in affectedProducts" :key="product.name" class="product-item">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-count">{{ product.count }} times</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderModal" class="modal-overlay">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>{{ selectedOrder?.type.toUpperCase() }} Order: #{{ selectedOrder?.id }}</h3>
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
                  <span class="info-label">Cancellation/Return Date:</span>
                  <span class="info-value">{{ formatDate(selectedOrder?.cancelledDate || selectedOrder?.returnedDate) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Type:</span>
                  <span class="info-value">{{ selectedOrder?.type }}</span>
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

            <!-- Cancellation/Return Details -->
            <div class="detail-section">
              <h4>{{ selectedOrder?.type === 'cancelled' ? 'Cancellation' : 'Return' }} Details</h4>
              <div class="return-details">
                <div class="detail-row">
                  <span class="detail-label">Reason:</span>
                  <span class="detail-value">{{ selectedOrder?.reason }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Notes:</span>
                  <span class="detail-value">{{ selectedOrder?.notes || 'None' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Refund Amount:</span>
                  <span class="detail-value">₱{{ formatCurrency(selectedOrder?.refundAmount) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Refund Status:</span>
                  <span class="detail-value">{{ selectedOrder?.refundStatus }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeOrderModal">Close</button>
          <button class="btn-primary" v-if="selectedOrder?.type === 'returned'" @click="processRefund(selectedOrder)">
            Process Refund
          </button>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { ref, computed } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'CancelledOrders',
  components: {
    SellerLayout
  },
  setup() {
    const searchQuery = ref('')
    const selectedType = ref('all')
    const selectedReason = ref('all')
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
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image'
          }
        ],
        subtotal: 4400,
        shipping: 150,
        discount: 0,
        total: 4550,
        refundAmount: 4550,
        type: 'cancelled',
        reason: 'Customer Request',
        notes: 'Customer found better price elsewhere',
        date: '2024-01-15T10:30:00',
        cancelledDate: '2024-01-15T14:20:00',
        refundStatus: 'Pending'
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
            id: 2,
            name: 'Traditional Weaving Set',
            variant: 'Standard',
            quantity: 1,
            price: 1900,
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image'
          }
        ],
        subtotal: 1900,
        shipping: 200,
        discount: 0,
        total: 2100,
        refundAmount: 2100,
        type: 'returned',
        reason: 'Wrong Item Received',
        notes: 'Customer received different color than ordered',
        date: '2024-01-10T14:20:00',
        returnedDate: '2024-01-15T09:30:00',
        refundStatus: 'Processed',
        returnReason: 'Wrong Item Received'
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
            id: 3,
            name: 'Bamboo Home Decor',
            variant: 'Set of 3',
            quantity: 1,
            price: 1800,
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image'
          }
        ],
        subtotal: 1800,
        shipping: 250,
        discount: 100,
        total: 1950,
        refundAmount: 1950,
        type: 'cancelled',
        reason: 'Out of Stock',
        notes: 'Item was out of stock after order was placed',
        date: '2024-01-08T16:45:00',
        cancelledDate: '2024-01-09T10:15:00',
        refundStatus: 'Processed'
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
          order.customer.location.toLowerCase().includes(query) ||
          order.reason.toLowerCase().includes(query)
        )
      }

      // Type filter
      if (selectedType.value !== 'all') {
        filtered = filtered.filter(order => order.type === selectedType.value)
      }

      // Reason filter
      if (selectedReason.value !== 'all') {
        filtered = filtered.filter(order => order.reason.toLowerCase().includes(selectedReason.value.toLowerCase()))
      }

      // Sort
      filtered.sort((a, b) => {
        switch (selectedSort.value) {
          case 'newest':
            return new Date(b.cancelledDate || b.returnedDate) - new Date(a.cancelledDate || a.returnedDate)
          case 'oldest':
            return new Date(a.cancelledDate || a.returnedDate) - new Date(b.cancelledDate || b.returnedDate)
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

    const cancelledCount = computed(() => {
      return orders.value.filter(o => o.type === 'cancelled').length
    })

    const returnedCount = computed(() => {
      return orders.value.filter(o => o.type === 'returned').length
    })

    const totalRefundAmount = computed(() => {
      return orders.value.reduce((total, order) => total + order.refundAmount, 0)
    })

    const cancellationRate = computed(() => {
      const totalOrders = orders.value.length
      const cancelledOrders = cancelledCount.value
      return totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0
    })

    const topReasons = computed(() => {
      const reasonCounts = {}
      orders.value.forEach(order => {
        const reason = order.reason
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1
      })
      
      return Object.entries(reasonCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
    })

    const affectedProducts = computed(() => {
      const productCounts = {}
      orders.value.forEach(order => {
        order.products.forEach(product => {
          productCounts[product.name] = (productCounts[product.name] || 0) + 1
        })
      })
      
      return Object.entries(productCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
    })

    const avgResponseTime = computed(() => {
      // Mock average response time
      return 24
    })

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

    const viewOrderDetails = (order) => {
      selectedOrder.value = order
      showOrderModal.value = true
    }

    const closeOrderModal = () => {
      showOrderModal.value = false
      selectedOrder.value = null
    }

    const processRefund = (order) => {
      if (order.type === 'returned') {
        order.refundStatus = 'Processed'
        alert(`Refund of ₱${formatCurrency(order.refundAmount)} has been processed for Order ${order.id}`)
      }
    }

    const contactCustomer = (order) => {
      alert(`Contacting customer: ${order.customer.name} (${order.customer.phone})`)
    }

    const addNote = (orderId) => {
      const note = prompt('Add a note to this order:')
      if (note) {
        alert('Note added successfully!')
      }
    }

    const viewHistory = (orderId) => {
      alert(`Viewing history for Order ${orderId}...`)
    }

    const restockItems = (order) => {
      alert(`Restocking items for Order ${order.id}...`)
    }

    const deleteOrder = (orderId) => {
      if (confirm('Are you sure you want to delete this order?')) {
        const index = orders.value.findIndex(o => o.id === orderId)
        if (index > -1) {
          orders.value.splice(index, 1)
        }
      }
    }

    const exportCancelledReport = () => {
      alert('Exporting cancelled/returned orders report...')
    }

    const analyzeTrends = () => {
      alert('Analyzing cancellation and return trends...')
    }

    return {
      searchQuery,
      selectedType,
      selectedReason,
      selectedSort,
      currentPage,
      showOrderModal,
      selectedOrder,
      orders,
      filteredOrders,
      paginatedOrders,
      totalPages,
      cancelledCount,
      returnedCount,
      totalRefundAmount,
      cancellationRate,
      topReasons,
      affectedProducts,
      avgResponseTime,
      formatCurrency,
      formatDate,
      filterOrders,
      searchOrders,
      sortOrders,
      changePage,
      viewOrderDetails,
      closeOrderModal,
      processRefund,
      contactCustomer,
      addNote,
      viewHistory,
      restockItems,
      deleteOrder,
      exportCancelledReport,
      analyzeTrends
    }
  }
}
</script>

<style scoped>
.cancelled-orders {
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

.order-card.cancelled {
  border-left: 4px solid #ef4444;
}

.order-card.returned {
  border-left: 4px solid #f59e0b;
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
  flex-wrap: wrap;
}

.order-date,
.order-status,
.order-reason {
  font-size: 0.875rem;
  color: #6b7280;
}

.order-status.cancelled {
  color: #ef4444;
  font-weight: 600;
}

.order-status.returned {
  color: #f59e0b;
  font-weight: 600;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view {
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

.btn-view:hover {
  background-color: #4b5563;
}

.btn-refund {
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

.btn-refund:hover {
  background-color: #059669;
}

.btn-contact {
  background-color: #3b82f6;
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

.btn-contact:hover {
  background-color: #2563eb;
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

.return-reason {
  font-size: 0.75rem;
  color: #ef4444;
  font-style: italic;
  margin-top: 0.25rem;
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

.details-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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

.btn-danger {
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

.btn-danger:hover {
  background-color: #dc2626;
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

.insights-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.insight-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  background-color: #3b82f6;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.insight-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.insight-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.insight-data {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reason-item,
.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.reason-name,
.product-name {
  font-weight: 500;
  color: #374151;
}

.reason-count,
.product-count {
  font-size: 0.875rem;
  color: #6b7280;
  background-color: #e5e7eb;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
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
.return-details {
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
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .insights-grid {
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