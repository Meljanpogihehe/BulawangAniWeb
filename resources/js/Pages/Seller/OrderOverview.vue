<template>
    <div class="order-overview">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Order Overview</h1>
        <div class="header-actions">
          <select v-model="selectedStatus" class="status-filter" @change="filterOrders">
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button class="btn-export" @click="exportOrders">
            <i class="fas fa-download"></i> Export Orders
          </button>
        </div>
      </div>

      <!-- Order Stats -->
      <div class="stats-grid">
        <div class="stat-card pending">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">New Orders</div>
            <div class="stat-value">{{ orderStats.pending }}</div>
            <div class="stat-change">Awaiting confirmation</div>
          </div>
        </div>

        <div class="stat-card processing">
          <div class="stat-icon">
            <i class="fas fa-cog"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Processing</div>
            <div class="stat-value">{{ orderStats.processing }}</div>
            <div class="stat-change">Being prepared</div>
          </div>
        </div>

        <div class="stat-card shipped">
          <div class="stat-icon">
            <i class="fas fa-truck"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Shipped</div>
            <div class="stat-value">{{ orderStats.shipped }}</div>
            <div class="stat-change">In transit</div>
          </div>
        </div>

        <div class="stat-card delivered">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Delivered</div>
            <div class="stat-value">{{ orderStats.delivered }}</div>
            <div class="stat-change">Successfully delivered</div>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="orders-section">
        <div class="section-header">
          <h2>Recent Orders</h2>
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

        <div class="orders-table">
          <div class="table-header">
            <div class="table-cell">Order ID</div>
            <div class="table-cell">Customer</div>
            <div class="table-cell">Products</div>
            <div class="table-cell">Total</div>
            <div class="table-cell">Status</div>
            <div class="table-cell">Date</div>
            <div class="table-cell">Actions</div>
          </div>

          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="table-row"
            :class="order.status"
          >
            <div class="table-cell">
              <div class="order-id">#{{ order.id }}</div>
              <div class="order-items">{{ order.items }} items</div>
            </div>
            <div class="table-cell">
              <div class="customer-info">
                <div class="customer-name">{{ order.customer.name }}</div>
                <div class="customer-location">{{ order.customer.location }}</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="product-list">
                <div v-for="product in order.products.slice(0, 2)" :key="product.id" class="product-item">
                  <img :src="product.image" :alt="product.name" class="product-thumb">
                  <span class="product-name">{{ product.name }}</span>
                </div>
                <div v-if="order.products.length > 2" class="more-products">
                  +{{ order.products.length - 2 }} more
                </div>
              </div>
            </div>
            <div class="table-cell">
              <div class="order-total">₱{{ formatCurrency(order.total) }}</div>
              <div class="order-fee">Fee: ₱{{ formatCurrency(order.fee) }}</div>
            </div>
            <div class="table-cell">
              <span class="status-badge" :class="order.status">{{ order.status }}</span>
            </div>
            <div class="table-cell">
              <div class="order-date">{{ formatDate(order.date) }}</div>
              <div class="order-time">{{ formatTime(order.date) }}</div>
            </div>
            <div class="table-cell">
              <div class="action-buttons">
                <button class="btn-view" @click="viewOrder(order.id)">
                  <i class="fas fa-eye"></i> View
                </button>
                <button
                  v-if="order.status === 'pending'"
                  class="btn-accept"
                  @click="acceptOrder(order.id)"
                >
                  <i class="fas fa-check"></i> Accept
                </button>
                <button
                  v-if="order.status === 'processing'"
                  class="btn-ship"
                  @click="markAsShipped(order.id)"
                >
                  <i class="fas fa-truck"></i> Ship
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
          <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <div class="action-card" @click="bulkAccept">
            <div class="action-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Accept All Pending</div>
              <div class="action-subtitle">{{ orderStats.pending }} orders to process</div>
            </div>
          </div>

          <div class="action-card" @click="generateShippingLabels">
            <div class="action-icon">
              <i class="fas fa-tags"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Generate Labels</div>
              <div class="action-subtitle">Print shipping labels</div>
            </div>
          </div>

          <div class="action-card" @click="updateTracking">
            <div class="action-icon">
              <i class="fas fa-shipping-fast"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Update Tracking</div>
              <div class="action-subtitle">Bulk tracking updates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'OrderOverview',
  components: {
    SellerLayout
  },
  setup() {
    const selectedStatus = ref('all')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10

    // Mock order data
    const orders = ref([
      {
        id: 'ORD-2024-001',
        customer: { name: 'Maria Santos', location: 'Manila' },
        products: [
          { id: 1, name: 'Handwoven Abaca Bag', image: '/images/products/bag1.jpg' },
          { id: 2, name: 'Traditional Weaving Set', image: '/images/products/weaving1.jpg' }
        ],
        total: 4500,
        fee: 225,
        status: 'pending',
        date: '2024-01-15T10:30:00',
        items: 2
      },
      {
        id: 'ORD-2024-002',
        customer: { name: 'Juan Dela Cruz', location: 'Cebu' },
        products: [
          { id: 3, name: 'Bamboo Home Decor', image: '/images/products/decor1.jpg' }
        ],
        total: 1800,
        fee: 90,
        status: 'processing',
        date: '2024-01-14T15:45:00',
        items: 1
      },
      {
        id: 'ORD-2024-003',
        customer: { name: 'Ana Reyes', location: 'Davao' },
        products: [
          { id: 4, name: 'Handmade Pottery Set', image: '/images/products/pottery1.jpg' },
          { id: 5, name: 'Wooden Spoon Set', image: '/images/products/spoon1.jpg' },
          { id: 6, name: 'Coconut Shell Bowl', image: '/images/products/bowl1.jpg' }
        ],
        total: 3200,
        fee: 160,
        status: 'shipped',
        date: '2024-01-13T09:20:00',
        items: 3
      },
      {
        id: 'ORD-2024-004',
        customer: { name: 'Pedro Gomez', location: 'Baguio' },
        products: [
          { id: 7, name: 'Traditional Weaving Set', image: '/images/products/weaving1.jpg' }
        ],
        total: 1900,
        fee: 95,
        status: 'delivered',
        date: '2024-01-12T14:15:00',
        items: 1
      },
      {
        id: 'ORD-2024-005',
        customer: { name: 'Liza Cruz', location: 'Iloilo' },
        products: [
          { id: 8, name: 'Handwoven Abaca Bag', image: '/images/products/bag1.jpg' }
        ],
        total: 2200,
        fee: 110,
        status: 'cancelled',
        date: '2024-01-11T11:30:00',
        items: 1
      }
    ])

    const orderStats = computed(() => {
      return {
        pending: orders.value.filter(o => o.status === 'pending').length,
        processing: orders.value.filter(o => o.status === 'processing').length,
        shipped: orders.value.filter(o => o.status === 'shipped').length,
        delivered: orders.value.filter(o => o.status === 'delivered').length
      }
    })

    const filteredOrders = computed(() => {
      let filtered = orders.value

      // Filter by status
      if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(order => order.status === selectedStatus.value)
      }

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.products.some(p => p.name.toLowerCase().includes(query))
        )
      }

      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredOrders.value.length / itemsPerPage)
    })

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredOrders.value.slice(start, end)
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
        month: 'short',
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

    const changePage = (page) => {
      currentPage.value = page
    }

    const viewOrder = (orderId) => {
      alert(`Viewing order: ${orderId}`)
    }

    const acceptOrder = (orderId) => {
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = 'processing'
      }
    }

    const markAsShipped = (orderId) => {
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = 'shipped'
      }
    }

    const exportOrders = () => {
      alert('Orders exported successfully!')
    }

    const bulkAccept = () => {
      orders.value.forEach(order => {
        if (order.status === 'pending') {
          order.status = 'processing'
        }
      })
    }

    const generateShippingLabels = () => {
      alert('Generating shipping labels...')
    }

    const updateTracking = () => {
      alert('Updating tracking information...')
    }

    return {
      selectedStatus,
      searchQuery,
      currentPage,
      orderStats,
      filteredOrders,
      totalPages,
      paginatedOrders,
      formatCurrency,
      formatDate,
      formatTime,
      filterOrders,
      searchOrders,
      changePage,
      viewOrder,
      acceptOrder,
      markAsShipped,
      exportOrders,
      bulkAccept,
      generateShippingLabels,
      updateTracking
    }
  }
}
</script>

<style scoped>
.order-overview {
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
  align-items: center;
}

.status-filter {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.btn-export {
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
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.pending { border-left: 4px solid #f59e0b; }
.stat-card.processing { border-left: 4px solid #3b82f6; }
.stat-card.shipped { border-left: 4px solid #8b5cf6; }
.stat-card.delivered { border-left: 4px solid #10b981; }

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.stat-card.pending .stat-icon { background-color: #f59e0b; }
.stat-card.processing .stat-icon { background-color: #3b82f6; }
.stat-card.shipped .stat-icon { background-color: #8b5cf6; }
.stat-card.delivered .stat-icon { background-color: #10b981; }

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.75rem;
  color: #6b7280;
}

.orders-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 2.5rem;
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

.orders-table {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.table-header {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.table-cell {
  display: flex;
  align-items: center;
  color: #374151;
}

.order-id {
  font-weight: 600;
  color: #1f2937;
}

.order-items {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

.customer-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.customer-location {
  font-size: 0.75rem;
  color: #6b7280;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-thumb {
  width: 30px;
  height: 30px;
  border-radius: 0.25rem;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.product-name {
  font-size: 0.875rem;
  color: #374151;
}

.more-products {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

.order-total {
  font-weight: 600;
  color: #1f2937;
}

.order-fee {
  font-size: 0.75rem;
  color: #6b7280;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending { background-color: #fef3c7; color: #92400e; }
.status-badge.processing { background-color: #dbeafe; color: #1e40af; }
.status-badge.shipped { background-color: #e9d5ff; color: #581c87; }
.status-badge.delivered { background-color: #d1fae5; color: #065f46; }
.status-badge.cancelled { background-color: #fee2e2; color: #991b1b; }

.order-date {
  font-weight: 500;
}

.order-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-view,
.btn-accept,
.btn-ship {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;
}

.btn-view:hover { background-color: #f3f4f6; }
.btn-accept { border-color: #10b981; color: #065f46; background-color: #ecfdf5; }
.btn-accept:hover { background-color: #d1fae5; }
.btn-ship { border-color: #8b5cf6; color: #581c87; background-color: #f3e8ff; }
.btn-ship:hover { background-color: #e9d5ff; }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
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

/* Responsive styles */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .search-container {
    width: 100%;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>