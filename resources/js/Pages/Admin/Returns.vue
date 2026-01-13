<template>
    <div class="returns-page">
      <div class="page-header">
        <h1>Returns & Refunds</h1>
        <p>Manage customer returns and process refunds</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="openAddModal">Add New Return</button>
          <div class="filters">
            <select v-model="filterStatus">
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search returns..." v-model="searchQuery" />
          </div>
        </div>
        
        <div class="table-container">
          <table class="returns-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="returnItem in filteredReturns" :key="returnItem.id">
                <td>
                  <div class="return-id">#{{ returnItem.id }}</div>
                  <div class="return-amount">₱{{ returnItem.amount }}</div>
                </td>
                <td>#{{ returnItem.orderId }}</td>
                <td>{{ returnItem.customer }}</td>
                <td>{{ returnItem.product }}</td>
                <td>
                  <span class="reason-badge">{{ returnItem.reason }}</span>
                </td>
                <td>
                  <span :class="['status-badge', returnItem.status.toLowerCase()]">
                    {{ returnItem.status }}
                  </span>
                </td>
                <td>{{ formatDate(returnItem.date) }}</td>
                <td>
                  <button class="btn-view" @click="viewReturn(returnItem)">View</button>
                  <button class="btn-approve" v-if="returnItem.status === 'Pending'" @click="approveReturn(returnItem)">Approve</button>
                  <button class="btn-reject" v-if="returnItem.status === 'Pending'" @click="rejectReturn(returnItem)">Reject</button>
                  <button class="btn-refund" v-if="returnItem.status === 'Approved'" @click="processRefund(returnItem)">Process Refund</button>
                  <button class="btn-delete" @click="openDeleteModal(returnItem)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Return Modal -->
      <AdminModal
        :isOpen="showAddModal"
        title="Add New Return"
        submitText="Create Return"
        :isLoading="isSubmitting"
        @close="closeAddModal"
        @submit="addReturn"
      >
        <div class="form-group">
          <label for="add-order-id">Order ID</label>
          <input
            type="number"
            id="add-order-id"
            v-model.number="newReturn.orderId"
            placeholder="Enter order ID"
            min="1"
            :class="{ 'error': addErrors.orderId }"
          />
          <span v-if="addErrors.orderId" class="error-message">{{ addErrors.orderId }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-customer">Customer Name</label>
          <input
            type="text"
            id="add-customer"
            v-model="newReturn.customer"
            placeholder="Enter customer name"
            :class="{ 'error': addErrors.customer }"
          />
          <span v-if="addErrors.customer" class="error-message">{{ addErrors.customer }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-product">Product</label>
          <input
            type="text"
            id="add-product"
            v-model="newReturn.product"
            placeholder="Enter product name"
            :class="{ 'error': addErrors.product }"
          />
          <span v-if="addErrors.product" class="error-message">{{ addErrors.product }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-amount">Refund Amount</label>
          <input
            type="number"
            id="add-amount"
            v-model.number="newReturn.amount"
            placeholder="Enter refund amount"
            min="0"
            step="0.01"
            :class="{ 'error': addErrors.amount }"
          />
          <span v-if="addErrors.amount" class="error-message">{{ addErrors.amount }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-reason">Reason</label>
          <select id="add-reason" v-model="newReturn.reason" :class="{ 'error': addErrors.reason }">
            <option value="">Select Reason</option>
            <option value="Damaged Product">Damaged Product</option>
            <option value="Wrong Item">Wrong Item</option>
            <option value="Not as Described">Not as Described</option>
            <option value="Expired Product">Expired Product</option>
            <option value="Quality Issue">Quality Issue</option>
            <option value="Changed Mind">Changed Mind</option>
          </select>
          <span v-if="addErrors.reason" class="error-message">{{ addErrors.reason }}</span>
        </div>
      </AdminModal>

      <!-- Delete Return Modal -->
      <AdminModal
        :isOpen="showDeleteModal"
        title="Delete Return"
        submitText="Delete Return"
        :isLoading="isSubmitting"
        @close="closeDeleteModal"
        @submit="deleteReturn"
      >
        <div class="delete-warning">
          <p>Are you sure you want to delete this return request?</p>
          <p class="delete-name">{{ deleteReturnData.product }}</p>
          <p class="delete-warning-text">This action cannot be undone.</p>
        </div>
      </AdminModal>

      <!-- Success/Error Messages -->
      <div v-if="message" class="message" :class="message.type">
        {{ message.text }}
      </div>
    </div>
</template>

<script>
import AdminModal from '@/Components/AdminModal.vue'

export default {
  name: 'Returns',
  components: {
    AdminModal
  },
  data() {
    return {
      searchQuery: '',
      filterStatus: 'all',
      isSubmitting: false,
      message: null,
      
      // Modal states
      showAddModal: false,
      showDeleteModal: false,
      
      // Return data
      returns: [
        { id: 1001, orderId: 1001, customer: 'John Doe', product: 'Premium Dinorado Rice', reason: 'Damaged Product', amount: 2250, status: 'Pending', date: '2024-01-16' },
        { id: 1002, orderId: 1002, customer: 'Jane Smith', product: 'Organic Benguet Tomatoes', reason: 'Wrong Item', amount: 120, status: 'Approved', date: '2024-01-15' },
        { id: 1003, orderId: 1003, customer: 'Bob Wilson', product: 'Davao Golden Bananas', reason: 'Not as Described', amount: 85, status: 'Rejected', date: '2024-01-14' },
        { id: 1004, orderId: 1004, customer: 'Alice Johnson', product: 'Wild Bukidnon Honey', reason: 'Expired Product', amount: 450, status: 'Refunded', date: '2024-01-13' },
        { id: 1005, orderId: 1005, customer: 'Charlie Brown', product: 'Fresh Carrots', reason: 'Quality Issue', amount: 60, status: 'Pending', date: '2024-01-12' }
      ],
      
      // Form data
      newReturn: {
        orderId: 0,
        customer: '',
        product: '',
        amount: 0,
        reason: ''
      },
      deleteReturnData: {
        id: null,
        product: ''
      },
      
      // Form errors
      addErrors: {}
    }
  },
  computed: {
    filteredReturns() {
      let filtered = this.returns
      
      // Filter by status
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(returnItem => returnItem.status.toLowerCase() === this.filterStatus)
      }
      
      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(returnItem =>
          returnItem.customer.toLowerCase().includes(query) ||
          returnItem.product.toLowerCase().includes(query) ||
          returnItem.reason.toLowerCase().includes(query) ||
          returnItem.status.toLowerCase().includes(query) ||
          `#${returnItem.id}`.includes(query) ||
          `#${returnItem.orderId}`.includes(query)
        )
      }
      
      return filtered
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
    
    openDeleteModal(returnItem) {
      this.deleteReturnData = { id: returnItem.id, product: returnItem.product }
      this.showDeleteModal = true
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteReturnData = { id: null, product: '' }
    },
    
    // Form reset methods
    resetAddForm() {
      this.newReturn = {
        orderId: 0,
        customer: '',
        product: '',
        amount: 0,
        reason: ''
      }
      this.addErrors = {}
    },
    
    // Validation methods
    validateAddForm() {
      this.addErrors = {}
      let isValid = true
      
      if (!this.newReturn.orderId || this.newReturn.orderId <= 0) {
        this.addErrors.orderId = 'Valid order ID is required'
        isValid = false
      }
      
      if (!this.newReturn.customer.trim()) {
        this.addErrors.customer = 'Customer name is required'
        isValid = false
      }
      
      if (!this.newReturn.product.trim()) {
        this.addErrors.product = 'Product name is required'
        isValid = false
      }
      
      if (!this.newReturn.amount || this.newReturn.amount <= 0) {
        this.addErrors.amount = 'Refund amount must be greater than 0'
        isValid = false
      }
      
      if (!this.newReturn.reason) {
        this.addErrors.reason = 'Please select a reason'
        isValid = false
      }
      
      return isValid
    },
    
    // CRUD operations
    async addReturn() {
      if (!this.validateAddForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Generate new return ID
        const newId = Math.max(...this.returns.map(r => r.id)) + 1
        
        // Add new return to the list
        this.returns.push({
          id: newId,
          orderId: parseInt(this.newReturn.orderId),
          customer: this.newReturn.customer.trim(),
          product: this.newReturn.product.trim(),
          amount: parseFloat(this.newReturn.amount),
          reason: this.newReturn.reason,
          status: 'Pending',
          date: new Date().toISOString().split('T')[0]
        })
        
        // Close modal and reset form
        this.closeAddModal()
        
        // Show success message
        this.showMessage('Return request created successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('New return added:', this.newReturn)
      } catch (error) {
        this.showMessage('Error creating return request. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async approveReturn(returnItem) {
      this.isSubmitting = true
      
      try {
        // Find and update the return status
        const index = this.returns.findIndex(r => r.id === returnItem.id)
        if (index !== -1) {
          this.returns[index].status = 'Approved'
          
          // Show success message
          this.showMessage('Return approved successfully!', 'success')
          
          // In a real application, you would make an API call here
          console.log('Return approved:', returnItem)
        }
      } catch (error) {
        this.showMessage('Error approving return. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async rejectReturn(returnItem) {
      this.isSubmitting = true
      
      try {
        // Find and update the return status
        const index = this.returns.findIndex(r => r.id === returnItem.id)
        if (index !== -1) {
          this.returns[index].status = 'Rejected'
          
          // Show success message
          this.showMessage('Return rejected successfully!', 'success')
          
          // In a real application, you would make an API call here
          console.log('Return rejected:', returnItem)
        }
      } catch (error) {
        this.showMessage('Error rejecting return. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async processRefund(returnItem) {
      this.isSubmitting = true
      
      try {
        // Find and update the return status
        const index = this.returns.findIndex(r => r.id === returnItem.id)
        if (index !== -1) {
          this.returns[index].status = 'Refunded'
          
          // Show success message
          this.showMessage('Refund processed successfully!', 'success')
          
          // In a real application, you would make an API call here
          console.log('Refund processed:', returnItem)
        }
      } catch (error) {
        this.showMessage('Error processing refund. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async deleteReturn() {
      this.isSubmitting = true
      
      try {
        // Remove return from the list
        this.returns = this.returns.filter(returnItem => returnItem.id !== this.deleteReturnData.id)
        
        // Close modal
        this.closeDeleteModal()
        
        // Show success message
        this.showMessage('Return request deleted successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('Return deleted:', this.deleteReturnData)
      } catch (error) {
        this.showMessage('Error deleting return request. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    // Other methods
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    
    viewReturn(returnItem) {
      // Implement view return logic
      console.log('Viewing return:', returnItem)
    },
    
    // Message handling
    showMessage(text, type) {
      this.message = { text, type }
      setTimeout(() => {
        this.message = null
      }, 3000)
    }
  }
}
</script>

<style scoped>
.returns-page {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.filters select {
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;
  cursor: pointer;
  min-width: 200px;
}

.filters select:focus {
  border-color: #27ae60;
}

.search-box input {
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  width: 300px;
}

.search-box input:focus {
  border-color: #27ae60;
}

.returns-table {
  width: 100%;
  border-collapse: collapse;
}

.returns-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.returns-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.returns-table tr:hover {
  background: #f8faf7;
}

.return-id {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.return-amount {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.reason-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #e9ecef;
  color: #495057;
  border: 1px solid #dee2e6;
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

.status-badge.approved {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-badge.refunded {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.btn-view, .btn-approve, .btn-reject, .btn-refund {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
}

.btn-view {
  background: #eafaf1;
  color: #27ae60;
}

.btn-view:hover {
  background: #d4edda;
}

.btn-approve {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.btn-approve:hover {
  background: #c3e6cb;
}

.btn-reject {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.btn-reject:hover {
  background: #f5c6cb;
}

.btn-refund {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.btn-refund:hover {
  background: #bbdefb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .returns-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters select, .search-box input {
    width: 100%;
  }
  
  .returns-table {
    font-size: 0.9rem;
  }
  
  .returns-table th, .returns-table td {
    padding: 0.75rem;
  }
}
</style>