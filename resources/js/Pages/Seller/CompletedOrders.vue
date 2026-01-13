<template>
    <div class="completed-orders">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Completed Orders</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="exportCompletedReport">
          <i class="fas fa-download"></i> Export Report
        </button>
        <button class="btn-primary" @click="generateSalesReport">
          <i class="fas fa-chart-bar"></i> Sales Report
        </button>
      </div>
    </div>

    <!-- Stats Banner -->
    <div class="stats-banner">
      <div class="stat-item">
        <span class="stat-label">Total Completed:</span>
        <span class="stat-value">{{ completedCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total Revenue:</span>
        <span class="stat-value">₱{{ formatCurrency(totalRevenue) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Avg Order Value:</span>
        <span class="stat-value">₱{{ formatCurrency(avgOrderValue) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Success Rate:</span>
        <span class="stat-value">{{ successRate }}%</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <select v-model="selectedTimeFilter" class="filter-select" @change="filterOrders">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
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
        <i class="fas fa-check-circle"></i>
        <h3>No completed orders</h3>
        <p>No orders have been completed yet.</p>
      </div>

      <div 
        v-for="order in paginatedOrders" 
        :key="order.id" 
        class="order-card"
      >
        <!-- Order Header -->
        <div class="order-header">
          <div class="order-info">
            <div class="order-id">#{{ order.id }}</div>
            <div class="order-meta">
              <span class="order-date">{{ formatDate(order.date) }}</span>
              <span class="order-completed">Completed: {{ formatCompletedDate(order.completedDate) }}</span>
              <span class="order-duration">({{ getOrderDuration(order) }} days)</span>
            </div>
          </div>
          
          <div class="order-actions">
            <button class="btn-view" @click="viewOrderDetails(order)">
              <i class="fas fa-eye"></i> View Details
            </button>
            <button class="btn-review" @click="viewCustomerReview(order)">
              <i class="fas fa-star"></i> Customer Review
            </button>
            <button class="btn-reorder" @click="createReorder(order)">
              <i class="fas fa-redo"></i> Reorder
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

        <!-- Order Status -->
        <div class="status-section">
          <div class="status-badge completed">Completed</div>
          <div class="completion-info">
            <div class="completion-item">
              <span class="completion-label">Completed:</span>
              <span class="completion-value">{{ formatCompletedDate(order.completedDate) }}</span>
            </div>
            <div class="completion-item">
              <span class="completion-label">Tracking:</span>
              <span class="completion-value">{{ order.trackingNumber || 'N/A' }}</span>
            </div>
            <div class="completion-item">
              <span class="completion-label">Rating:</span>
              <div class="rating-stars">
                <i v-for="star in 5" :key="star" class="fas fa-star" :class="{ filled: star <= order.rating }"></i>
                <span class="rating-value">{{ order.rating }}/5</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Feedback -->
        <div v-if="order.feedback" class="feedback-section">
          <h4>Customer Feedback</h4>
          <div class="feedback-content">
            <p>{{ order.feedback.comment }}</p>
            <div class="feedback-meta">
              <span class="feedback-date">{{ formatDate(order.feedback.date) }}</span>
              <div class="feedback-tags">
                <span v-for="tag in order.feedback.tags" :key="tag" class="feedback-tag">{{ tag }}</span>
              </div>
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

    <!-- Performance Metrics -->
    <div class="metrics-section">
      <h3>Performance Metrics</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="metric-content">
            <div class="metric-label">Avg Processing Time</div>
            <div class="metric-value">{{ avgProcessingTime }} days</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-truck"></i>
          </div>
          <div class="metric-content">
            <div class="metric-label">On-time Delivery</div>
            <div class="metric-value">{{ onTimeDelivery }}%</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="metric-content">
            <div class="metric-label">Avg Customer Rating</div>
            <div class="metric-value">{{ avgCustomerRating }} / 5.0</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-repeat"></i>
          </div>
          <div class="metric-content">
            <div class="metric-label">Repeat Customers</div>
            <div class="metric-value">{{ repeatCustomers }}%</div>
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
            <!-- Order Timeline -->
            <div class="detail-section">
              <h4>Order Timeline</h4>
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-dot completed"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">Order Placed</div>
                    <div class="timeline-date">{{ formatDate(selectedOrder?.date) }}</div>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot completed"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">Order Accepted</div>
                    <div class="timeline-date">{{ formatDate(selectedOrder?.acceptedDate) }}</div>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot completed"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">Shipped</div>
                    <div class="timeline-date">{{ formatDate(selectedOrder?.shippedDate) }}</div>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot completed"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">Delivered</div>
                    <div class="timeline-date">{{ formatDate(selectedOrder?.completedDate) }}</div>
                  </div>
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
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeOrderModal">Close</button>
          <button class="btn-primary" @click="createReorder(selectedOrder)">Create Reorder</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'CompletedOrders',
  components: {
    SellerLayout
  },
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
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image'
          },
          {
            id: 2,
            name: 'Traditional Weaving Set',
            variant: 'Standard',
            quantity: 1,
            price: 1900,
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image'
          }
        ],
        subtotal: 6300,
        shipping: 150,
        discount: 0,
        total: 6450,
        paymentMethod: 'Cash on Delivery',
        shippingMethod: 'Standard Shipping',
        status: 'completed',
        date: '2024-01-10T10:30:00',
        acceptedDate: '2024-01-10T12:00:00',
        shippedDate: '2024-01-11T09:00:00',
        completedDate: '2024-01-13T15:30:00',
        trackingNumber: 'TRK123456789',
        rating: 4.8,
        feedback: {
          comment: 'Great quality products and fast delivery! Will definitely order again.',
          date: '2024-01-14T10:00:00',
          tags: ['Quality', 'Fast Delivery', 'Recommended']
        }
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
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image'
          }
        ],
        subtotal: 1800,
        shipping: 200,
        discount: 100,
        total: 1900,
        paymentMethod: 'Credit Card',
        shippingMethod: 'Express Shipping',
        status: 'completed',
        date: '2024-01-08T14:20:00',
        acceptedDate: '2024-01-08T15:00:00',
        shippedDate: '2024-01-09T08:00:00',
        completedDate: '2024-01-10T11:45:00',
        trackingNumber: 'TRK987654321',
        rating: 4.5,
        feedback: {
          comment: 'Product arrived earlier than expected. Good packaging.',
          date: '2024-01-11T09:30:00',
          tags: ['Fast Delivery', 'Good Packaging']
        }
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
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image'
          },
          {
            id: 5,
            name: 'Wooden Spoon Set',
            variant: '5-piece',
            quantity: 2,
            price: 850,
            image: 'https://via.placeholder.com/60x60/f3f4f6/6b7280?text=No+Image'
          }
        ],
        subtotal: 5200,
        shipping: 250,
        discount: 0,
        total: 5450,
        paymentMethod: 'GCash',
        shippingMethod: 'Standard Shipping',
        status: 'completed',
        date: '2024-01-05T16:45:00',
        acceptedDate: '2024-01-05T17:30:00',
        shippedDate: '2024-01-07T10:00:00',
        completedDate: '2024-01-09T14:20:00',
        trackingNumber: 'TRK456789123',
        rating: 4.9,
        feedback: {
          comment: 'Excellent craftsmanship! The pottery set is beautiful and well-made.',
          date: '2024-01-10T16:00:00',
          tags: ['Quality', 'Craftsmanship', 'Beautiful']
        }
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
          const orderDate = new Date(order.completedDate)
          const diffTime = now - orderDate
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          
          switch (selectedTimeFilter.value) {
            case 'today':
              return diffDays === 0
            case 'week':
              return diffDays <= 7
            case 'month':
              return diffDays <= 30
            case 'quarter':
              return diffDays <= 90
            case 'year':
              return diffDays <= 365
            default:
              return true
          }
        })
      }

      // Sort
      filtered.sort((a, b) => {
        switch (selectedSort.value) {
          case 'newest':
            return new Date(b.completedDate) - new Date(a.completedDate)
          case 'oldest':
            return new Date(a.completedDate) - new Date(b.completedDate)
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

    const completedCount = computed(() => orders.value.length)
    const totalRevenue = computed(() => {
      return orders.value.reduce((total, order) => total + order.total, 0)
    })
    const avgOrderValue = computed(() => {
      return completedCount.value > 0 ? totalRevenue.value / completedCount.value : 0
    })
    const successRate = computed(() => 100) // All completed orders are successful

    const avgProcessingTime = computed(() => {
      const totalDays = orders.value.reduce((total, order) => {
        const acceptedDate = new Date(order.acceptedDate)
        const completedDate = new Date(order.completedDate)
        const diffTime = completedDate - acceptedDate
        return total + Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      }, 0)
      return orders.value.length > 0 ? Math.round(totalDays / orders.value.length) : 0
    })

    const onTimeDelivery = computed(() => 95) // Mock data
    const avgCustomerRating = computed(() => {
      const totalRating = orders.value.reduce((total, order) => total + order.rating, 0)
      return orders.value.length > 0 ? (totalRating / orders.value.length).toFixed(1) : 0
    })
    const repeatCustomers = computed(() => 40) // Mock data

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

    const formatCompletedDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getOrderDuration = (order) => {
      const acceptedDate = new Date(order.acceptedDate)
      const completedDate = new Date(order.completedDate)
      const diffTime = completedDate - acceptedDate
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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

    const viewCustomerReview = (order) => {
      if (order.feedback) {
        alert(`Customer Review for Order ${order.id}:\n\nRating: ${order.rating}/5\nComment: ${order.feedback.comment}`)
      } else {
        alert('No customer review available for this order.')
      }
    }

    const createReorder = (order) => {
      alert(`Creating reorder for Order ${order.id}...`)
    }

    const exportCompletedReport = () => {
      alert('Exporting completed orders report...')
    }

    const generateSalesReport = () => {
      alert('Generating sales report...')
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
      completedCount,
      totalRevenue,
      avgOrderValue,
      successRate,
      avgProcessingTime,
      onTimeDelivery,
      avgCustomerRating,
      repeatCustomers,
      formatCurrency,
      formatDate,
      formatCompletedDate,
      getOrderDuration,
      filterOrders,
      searchOrders,
      sortOrders,
      changePage,
      viewOrderDetails,
      closeOrderModal,
      viewCustomerReview,
      createReorder,
      exportCompletedReport,
      generateSalesReport
    }
  }
}
</script>

<style scoped>
.completed-orders {
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
.order-completed,
.order-duration {
  font-size: 0.875rem;
  color: #6b7280;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view,
.btn-review,
.btn-reorder {
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

.btn-review {
  background-color: #f59e0b;
}

.btn-review:hover {
  background-color: #d97706;
}

.btn-reorder {
  background-color: #10b981;
}

.btn-reorder:hover {
  background-color: #059669;
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

.status-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: #d1fae5;
  color: #065f46;
}

.completion-info {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.completion-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.completion-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.completion-value {
  font-weight: 500;
  color: #374151;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating-stars .fas {
  font-size: 0.875rem;
  color: #f59e0b;
}

.rating-stars .filled {
  color: #f59e0b;
}

.rating-value {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  margin-left: 0.5rem;
}

.feedback-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.feedback-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.feedback-content {
  color: #374151;
  line-height: 1.5;
}

.feedback-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.feedback-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.feedback-tags {
  display: flex;
  gap: 0.5rem;
}

.feedback-tag {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  color: #374151;
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

.metrics-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.metric-icon {
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

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
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

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e5e7eb;
  margin-top: 4px;
  flex-shrink: 0;
}

.timeline-dot.completed {
  background-color: #10b981;
}

.timeline-content {
  flex: 1;
}

.timeline-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.timeline-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.customer-details {
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
  
  .completion-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .order-details-content {
    grid-template-columns: 1fr;
  }
  
  .modal-lg {
    max-width: 90vw;
  }
}
</style>