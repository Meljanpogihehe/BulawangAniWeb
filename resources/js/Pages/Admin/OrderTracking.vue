<template>
    <div class="order-tracking-page">
      <div class="page-header">
        <h1>Order Status Tracking</h1>
        <p>Track and update order statuses in real-time</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="openAddModal">Add New Order</button>
          <div class="search-box">
            <input type="text" placeholder="Search order ID..." v-model="searchQuery" />
            <button class="btn-search">Search</button>
          </div>
        </div>
        
        <div class="order-details" v-if="selectedOrder">
          <div class="order-summary">
            <div class="summary-card">
              <h3>Order Information</h3>
              <div class="info-row">
                <span class="label">Order ID:</span>
                <span class="value">#{{ selectedOrder.id }}</span>
              </div>
              <div class="info-row">
                <span class="label">Customer:</span>
                <span class="value">{{ selectedOrder.customer }}</span>
              </div>
              <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">{{ formatDate(selectedOrder.date) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Total Amount:</span>
                <span class="value">₱{{ selectedOrder.amount }}</span>
              </div>
              <div class="info-row">
                <span class="label">Status:</span>
                <span :class="['status-badge', selectedOrder.status.toLowerCase()]">
                  {{ selectedOrder.status }}
                </span>
              </div>
            </div>
            
            <div class="summary-card">
              <h3>Shipping Information</h3>
              <div class="info-row">
                <span class="label">Shipping Method:</span>
                <span class="value">{{ selectedOrder.shippingMethod }}</span>
              </div>
              <div class="info-row">
                <span class="label">Tracking Number:</span>
                <span class="value">{{ selectedOrder.trackingNumber }}</span>
              </div>
              <div class="info-row">
                <span class="label">Estimated Delivery:</span>
                <span class="value">{{ formatDate(selectedOrder.estimatedDelivery) }}</span>
              </div>
            </div>
          </div>
          
          <div class="timeline">
            <h3>Order Timeline</h3>
            <div class="timeline-container">
              <div class="timeline-item" v-for="(event, index) in selectedOrder.timeline" :key="index">
                <div class="timeline-marker" :class="{ active: event.status === selectedOrder.status }">
                  <div class="marker-dot"></div>
                  <div class="marker-line" v-if="index < selectedOrder.timeline.length - 1"></div>
                </div>
                <div class="timeline-content">
                  <div class="timeline-status">{{ event.status }}</div>
                  <div class="timeline-date">{{ formatDate(event.date) }}</div>
                  <div class="timeline-description">{{ event.description }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="actions">
            <h3>Update Status</h3>
            <div class="status-actions">
              <button
                v-for="status in availableStatuses"
                :key="status"
                :class="['status-btn', { disabled: !canUpdateStatus(status) }]"
                @click="updateStatus(status)"
                :disabled="!canUpdateStatus(status)"
              >
                {{ status }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="no-selection" v-else>
          <div class="no-selection-content">
            <div class="icon">📦</div>
            <h3>No Order Selected</h3>
            <p>Search for an order ID to view tracking details</p>
          </div>
        </div>

        <!-- Add Order Modal -->
        <AdminModal
          :isOpen="showAddModal"
          title="Add New Order"
          submitText="Create Order"
          :isLoading="isSubmitting"
          @close="closeAddModal"
          @submit="addOrder"
        >
          <div class="form-group">
            <label for="add-customer">Customer Name</label>
            <input
              type="text"
              id="add-customer"
              v-model="newOrder.customer"
              placeholder="Enter customer name"
              :class="{ 'error': addErrors.customer }"
            />
            <span v-if="addErrors.customer" class="error-message">{{ addErrors.customer }}</span>
          </div>
          
          <div class="form-group">
            <label for="add-amount">Order Amount</label>
            <input
              type="number"
              id="add-amount"
              v-model.number="newOrder.amount"
              placeholder="Enter order amount"
              min="0"
              step="0.01"
              :class="{ 'error': addErrors.amount }"
            />
            <span v-if="addErrors.amount" class="error-message">{{ addErrors.amount }}</span>
          </div>
          
          <div class="form-group">
            <label for="add-shipping-method">Shipping Method</label>
            <select id="add-shipping-method" v-model="newOrder.shippingMethod" :class="{ 'error': addErrors.shippingMethod }">
              <option value="">Select Shipping Method</option>
              <option value="Standard Delivery">Standard Delivery</option>
              <option value="Express Delivery">Express Delivery</option>
              <option value="Same Day Delivery">Same Day Delivery</option>
            </select>
            <span v-if="addErrors.shippingMethod" class="error-message">{{ addErrors.shippingMethod }}</span>
          </div>
          
          <div class="form-group">
            <label for="add-tracking-number">Tracking Number</label>
            <input
              type="text"
              id="add-tracking-number"
              v-model="newOrder.trackingNumber"
              placeholder="Enter tracking number"
              :class="{ 'error': addErrors.trackingNumber }"
            />
            <span v-if="addErrors.trackingNumber" class="error-message">{{ addErrors.trackingNumber }}</span>
          </div>
          
          <div class="form-group">
            <label for="add-estimated-delivery">Estimated Delivery</label>
            <input
              type="date"
              id="add-estimated-delivery"
              v-model="newOrder.estimatedDelivery"
              :class="{ 'error': addErrors.estimatedDelivery }"
            />
            <span v-if="addErrors.estimatedDelivery" class="error-message">{{ addErrors.estimatedDelivery }}</span>
          </div>
        </AdminModal>

        <!-- Success/Error Messages -->
        <div v-if="message" class="message" :class="message.type">
          {{ message.text }}
        </div>
      </div>
    </div>
</template>

<script>
import AdminModal from '@/Components/AdminModal.vue'

export default {
  name: 'OrderTracking',
  components: {
    AdminModal
  },
  data() {
    return {
      searchQuery: '',
      isSubmitting: false,
      message: null,
      
      // Modal states
      showAddModal: false,
      
      // Order data
      selectedOrder: null,
      orders: [
        {
          id: 1001,
          customer: 'John Doe',
          date: '2024-01-15',
          amount: 2500,
          status: 'Shipped',
          shippingMethod: 'Express Delivery',
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2024-01-18',
          timeline: [
            { status: 'Pending', date: '2024-01-15', description: 'Order placed successfully' },
            { status: 'Processing', date: '2024-01-15', description: 'Order is being prepared' },
            { status: 'Shipped', date: '2024-01-16', description: 'Order has been shipped' },
            { status: 'Delivered', date: '2024-01-18', description: 'Order delivered to customer' }
          ]
        },
        {
          id: 1002,
          customer: 'Jane Smith',
          date: '2024-01-14',
          amount: 1200,
          status: 'Processing',
          shippingMethod: 'Standard Delivery',
          trackingNumber: 'TRK987654321',
          estimatedDelivery: '2024-01-19',
          timeline: [
            { status: 'Pending', date: '2024-01-14', description: 'Order placed successfully' },
            { status: 'Processing', date: '2024-01-14', description: 'Order is being prepared' },
            { status: 'Shipped', date: '2024-01-17', description: 'Order will be shipped soon' },
            { status: 'Delivered', date: '2024-01-19', description: 'Order will be delivered' }
          ]
        }
      ],
      
      // Form data
      newOrder: {
        customer: '',
        amount: 0,
        shippingMethod: '',
        trackingNumber: '',
        estimatedDelivery: ''
      },
      
      // Form errors
      addErrors: {}
    }
  },
  computed: {
    availableStatuses() {
      const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
      if (!this.selectedOrder) return []
      
      const currentIndex = statusOrder.indexOf(this.selectedOrder.status)
      return statusOrder.slice(currentIndex + 1)
    }
  },
  methods: {
    // Modal control methods
    openAddModal() {
      this.showAddModal = true
    },
    
    closeAddModal() {
      this.showAddModal = false
      this.resetAddForm()
    },
    
    // Form reset methods
    resetAddForm() {
      this.newOrder = {
        customer: '',
        amount: 0,
        shippingMethod: '',
        trackingNumber: '',
        estimatedDelivery: ''
      }
      this.addErrors = {}
    },
    
    // Validation methods
    validateAddForm() {
      this.addErrors = {}
      let isValid = true
      
      if (!this.newOrder.customer.trim()) {
        this.addErrors.customer = 'Customer name is required'
        isValid = false
      }
      
      if (!this.newOrder.amount || this.newOrder.amount <= 0) {
        this.addErrors.amount = 'Order amount must be greater than 0'
        isValid = false
      }
      
      if (!this.newOrder.shippingMethod) {
        this.addErrors.shippingMethod = 'Please select a shipping method'
        isValid = false
      }
      
      if (!this.newOrder.trackingNumber.trim()) {
        this.addErrors.trackingNumber = 'Tracking number is required'
        isValid = false
      }
      
      if (!this.newOrder.estimatedDelivery) {
        this.addErrors.estimatedDelivery = 'Estimated delivery date is required'
        isValid = false
      }
      
      return isValid
    },
    
    // CRUD operations
    async addOrder() {
      if (!this.validateAddForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Generate new order ID
        const newId = Math.max(...this.orders.map(o => o.id)) + 1
        
        // Add new order to the list
        this.orders.push({
          id: newId,
          customer: this.newOrder.customer.trim(),
          date: new Date().toISOString().split('T')[0],
          amount: parseFloat(this.newOrder.amount),
          status: 'Pending',
          shippingMethod: this.newOrder.shippingMethod,
          trackingNumber: this.newOrder.trackingNumber.trim(),
          estimatedDelivery: this.newOrder.estimatedDelivery,
          timeline: [
            { status: 'Pending', date: new Date().toISOString().split('T')[0], description: 'Order placed successfully' }
          ]
        })
        
        // Close modal and reset form
        this.closeAddModal()
        
        // Show success message
        this.showMessage('Order created successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('New order added:', this.newOrder)
      } catch (error) {
        this.showMessage('Error creating order. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    // Other methods
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    
    updateStatus(newStatus) {
      if (this.selectedOrder && this.canUpdateStatus(newStatus)) {
        this.selectedOrder.status = newStatus
        // Add new timeline event
        this.selectedOrder.timeline.push({
          status: newStatus,
          date: new Date().toISOString().split('T')[0],
          description: `Status updated to ${newStatus}`
        })
      }
    },
    
    canUpdateStatus(status) {
      if (!this.selectedOrder) return false
      return status !== 'Cancelled' || this.selectedOrder.status !== 'Delivered'
    },
    
    // Message handling
    showMessage(text, type) {
      this.message = { text, type }
      setTimeout(() => {
        this.message = null
      }, 3000)
    }
  },
  watch: {
    searchQuery(newQuery) {
      if (newQuery.length >= 3) {
        const orderId = parseInt(newQuery.replace('#', ''))
        this.selectedOrder = this.orders.find(order => order.id === orderId) || null
      } else {
        this.selectedOrder = null
      }
    }
  }
}
</script>

<style scoped>
.order-tracking-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #f8faf7, #f0f7ee);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: #5a6c5a;
  font-size: 1rem;
  font-weight: 600;
}

.page-content {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e8f1e1;
}

.controls {
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box input {
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  width: 400px;
  flex-grow: 1;
}

.search-box input:focus {
  border-color: #27ae60;
}

.btn-search {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
}

.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
}

.order-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.order-summary {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.summary-card {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
}

.summary-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e8f1e1;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 600;
}

.value {
  color: #2c3e50;
  font-weight: 700;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-badge.processing {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.status-badge.shipped {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.status-badge.delivered {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.timeline {
  grid-column: 1 / -1;
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
}

.timeline h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.timeline-container {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e8f1e1;
  border: 3px solid #27ae60;
  position: relative;
}

.marker-dot::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #27ae60;
  border-radius: 50%;
}

.marker-line {
  position: absolute;
  top: 16px;
  left: 50%;
  width: 2px;
  height: 2rem;
  background: #e8f1e1;
  transform: translateX(-50%);
}

.timeline-marker.active .marker-dot {
  background: #27ae60;
  border-color: #2ecc71;
}

.timeline-marker.active .marker-dot::after {
  background: white;
}

.timeline-content {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.timeline-status {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.timeline-date {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.timeline-description {
  font-size: 0.9rem;
  color: #5a6c5a;
}

.actions {
  grid-column: 1 / -1;
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
}

.actions h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.status-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.status-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #eafaf1;
  color: #27ae60;
  border: 1px solid #c3e6cb;
}

.status-btn:hover:not(.disabled) {
  background: #d4edda;
  transform: translateY(-2px);
}

.status-btn.disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
  border: 1px solid #dee2e6;
}

.no-selection {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
}

.no-selection-content {
  text-align: center;
  color: #7f8c8d;
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-selection-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.no-selection-content p {
  margin: 0;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .order-tracking-page {
    padding: 1rem;
  }
  
  .order-details {
    grid-template-columns: 1fr;
  }
  
  .order-summary {
    grid-template-columns: 1fr;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .timeline-container {
    padding-left: 1.5rem;
  }
  
  .timeline-marker {
    left: -1.5rem;
  }
  
  .status-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>