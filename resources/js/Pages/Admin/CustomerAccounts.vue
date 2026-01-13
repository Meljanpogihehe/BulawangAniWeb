<template>
    <div class="customer-accounts-page">
      <div class="page-header">
        <h1>Customer Accounts</h1>
        <p>Manage customer accounts and monitor user activity</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="openAddModal">Add New Customer</button>
          <div class="search-box">
            <input type="text" placeholder="Search customers..." v-model="searchQuery" />
          </div>
          <div class="filters">
            <select v-model="filterStatus">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        
        <div class="table-container">
          <table class="customer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in filteredCustomers" :key="customer.id">
                <td>{{ customer.name }}</td>
                <td>{{ customer.email }}</td>
                <td>{{ customer.phone }}</td>
                <td>{{ customer.orderCount }}</td>
                <td>₱{{ customer.totalSpent }}</td>
                <td>
                  <span :class="['status-badge', customer.status.toLowerCase()]">
                    {{ customer.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-view">View</button>
                  <button class="btn-edit" @click="openEditModal(customer)">Edit</button>
                  <button class="btn-delete" @click="openDeleteModal(customer)">{{ customer.status === 'Suspended' ? 'Activate' : 'Suspend' }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Customer Modal -->
      <AdminModal
        :isOpen="showAddModal"
        title="Add New Customer"
        submitText="Create Customer"
        :isLoading="isSubmitting"
        @close="closeAddModal"
        @submit="addCustomer"
      >
        <div class="form-group">
          <label for="add-name">Full Name</label>
          <input
            type="text"
            id="add-name"
            v-model="newCustomer.name"
            placeholder="Enter customer full name"
            :class="{ 'error': addErrors.name }"
          />
          <span v-if="addErrors.name" class="error-message">{{ addErrors.name }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-email">Email Address</label>
          <input
            type="email"
            id="add-email"
            v-model="newCustomer.email"
            placeholder="Enter customer email"
            :class="{ 'error': addErrors.email }"
          />
          <span v-if="addErrors.email" class="error-message">{{ addErrors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-phone">Phone Number</label>
          <input
            type="tel"
            id="add-phone"
            v-model="newCustomer.phone"
            placeholder="Enter phone number"
            :class="{ 'error': addErrors.phone }"
          />
          <span v-if="addErrors.phone" class="error-message">{{ addErrors.phone }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-status">Status</label>
          <select id="add-status" v-model="newCustomer.status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </AdminModal>

      <!-- Edit Customer Modal -->
      <AdminModal
        :isOpen="showEditModal"
        title="Edit Customer"
        submitText="Update Customer"
        :isLoading="isSubmitting"
        @close="closeEditModal"
        @submit="updateCustomer"
      >
        <div class="form-group">
          <label for="edit-name">Full Name</label>
          <input
            type="text"
            id="edit-name"
            v-model="editCustomer.name"
            placeholder="Enter customer full name"
            :class="{ 'error': editErrors.name }"
          />
          <span v-if="editErrors.name" class="error-message">{{ editErrors.name }}</span>
        </div>
        
        <div class="form-group">
          <label for="edit-email">Email Address</label>
          <input
            type="email"
            id="edit-email"
            v-model="editCustomer.email"
            placeholder="Enter customer email"
            :class="{ 'error': editErrors.email }"
          />
          <span v-if="editErrors.email" class="error-message">{{ editErrors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="edit-phone">Phone Number</label>
          <input
            type="tel"
            id="edit-phone"
            v-model="editCustomer.phone"
            placeholder="Enter phone number"
            :class="{ 'error': editErrors.phone }"
          />
          <span v-if="editErrors.phone" class="error-message">{{ editErrors.phone }}</span>
        </div>
        
        <div class="form-group">
          <label for="edit-status">Status</label>
          <select id="edit-status" v-model="editCustomer.status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </AdminModal>

      <!-- Delete Customer Modal -->
      <AdminModal
        :isOpen="showDeleteModal"
        title="Delete Customer"
        submitText="Delete Customer"
        :isLoading="isSubmitting"
        @close="closeDeleteModal"
        @submit="deleteCustomer"
      >
        <div class="delete-warning">
          <p>Are you sure you want to delete this customer account?</p>
          <p class="delete-name">{{ deleteCustomerData.name }}</p>
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
  name: 'CustomerAccounts',
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
      showEditModal: false,
      showDeleteModal: false,
      
      // Customer data
      customers: [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+63 912 345 6789', orderCount: 12, totalSpent: 15000, status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+63 923 456 7890', orderCount: 8, totalSpent: 8500, status: 'Active' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '+63 934 567 8901', orderCount: 3, totalSpent: 2500, status: 'Inactive' },
        { id: 4, name: 'Alice Johnson', email: 'alice@example.com', phone: '+63 945 678 9012', orderCount: 15, totalSpent: 22000, status: 'Active' },
        { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+63 956 789 0123', orderCount: 1, totalSpent: 800, status: 'Suspended' }
      ],
      
      // Form data
      newCustomer: {
        name: '',
        email: '',
        phone: '',
        status: 'Active'
      },
      editCustomer: {
        id: null,
        name: '',
        email: '',
        phone: '',
        status: ''
      },
      deleteCustomerData: {
        id: null,
        name: ''
      },
      
      // Form errors
      addErrors: {},
      editErrors: {}
    }
  },
  computed: {
    filteredCustomers() {
      let filtered = this.customers
      
      // Filter by status
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(customer => customer.status.toLowerCase() === this.filterStatus)
      }
      
      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(customer =>
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query) ||
          customer.status.toLowerCase().includes(query)
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
    
    openEditModal(customer) {
      this.editCustomer = { ...customer }
      this.showEditModal = true
    },
    
    closeEditModal() {
      this.showEditModal = false
      this.resetEditForm()
    },
    
    openDeleteModal(customer) {
      this.deleteCustomerData = { id: customer.id, name: customer.name }
      this.showDeleteModal = true
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteCustomerData = { id: null, name: '' }
    },
    
    // Form reset methods
    resetAddForm() {
      this.newCustomer = {
        name: '',
        email: '',
        phone: '',
        status: 'Active'
      }
      this.addErrors = {}
    },
    
    resetEditForm() {
      this.editCustomer = {
        id: null,
        name: '',
        email: '',
        phone: '',
        status: ''
      }
      this.editErrors = {}
    },
    
    // Validation methods
    validateAddForm() {
      this.addErrors = {}
      let isValid = true
      
      if (!this.newCustomer.name.trim()) {
        this.addErrors.name = 'Name is required'
        isValid = false
      }
      
      if (!this.newCustomer.email.trim()) {
        this.addErrors.email = 'Email is required'
        isValid = false
      } else if (!this.isValidEmail(this.newCustomer.email)) {
        this.addErrors.email = 'Please enter a valid email address'
        isValid = false
      }
      
      if (!this.newCustomer.phone.trim()) {
        this.addErrors.phone = 'Phone number is required'
        isValid = false
      } else if (!this.isValidPhone(this.newCustomer.phone)) {
        this.addErrors.phone = 'Please enter a valid phone number'
        isValid = false
      }
      
      return isValid
    },
    
    validateEditForm() {
      this.editErrors = {}
      let isValid = true
      
      if (!this.editCustomer.name.trim()) {
        this.editErrors.name = 'Name is required'
        isValid = false
      }
      
      if (!this.editCustomer.email.trim()) {
        this.editErrors.email = 'Email is required'
        isValid = false
      } else if (!this.isValidEmail(this.editCustomer.email)) {
        this.editErrors.email = 'Please enter a valid email address'
        isValid = false
      }
      
      if (!this.editCustomer.phone.trim()) {
        this.editErrors.phone = 'Phone number is required'
        isValid = false
      } else if (!this.isValidPhone(this.editCustomer.phone)) {
        this.editErrors.phone = 'Please enter a valid phone number'
        isValid = false
      }
      
      return isValid
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    isValidPhone(phone) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/
      return phoneRegex.test(phone)
    },
    
    // CRUD operations
    async addCustomer() {
      if (!this.validateAddForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Generate new customer ID
        const newId = Math.max(...this.customers.map(c => c.id)) + 1
        
        // Add new customer to the list
        this.customers.push({
          id: newId,
          name: this.newCustomer.name.trim(),
          email: this.newCustomer.email.trim(),
          phone: this.newCustomer.phone.trim(),
          orderCount: 0,
          totalSpent: 0,
          status: this.newCustomer.status
        })
        
        // Close modal and reset form
        this.closeAddModal()
        
        // Show success message
        this.showMessage('Customer account created successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('New customer added:', this.newCustomer)
      } catch (error) {
        this.showMessage('Error creating customer account. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async updateCustomer() {
      if (!this.validateEditForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Find and update the customer
        const index = this.customers.findIndex(customer => customer.id === this.editCustomer.id)
        if (index !== -1) {
          this.customers[index] = { ...this.editCustomer }
          
          // Close modal
          this.closeEditModal()
          
          // Show success message
          this.showMessage('Customer account updated successfully!', 'success')
          
          // In a real application, you would make an API call here
          console.log('Customer updated:', this.editCustomer)
        }
      } catch (error) {
        this.showMessage('Error updating customer account. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async deleteCustomer() {
      this.isSubmitting = true
      
      try {
        // Remove customer from the list
        this.customers = this.customers.filter(customer => customer.id !== this.deleteCustomerData.id)
        
        // Close modal
        this.closeDeleteModal()
        
        // Show success message
        this.showMessage('Customer account deleted successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('Customer deleted:', this.deleteCustomerData)
      } catch (error) {
        this.showMessage('Error deleting customer account. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
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
.customer-accounts-page {
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

.filters select {
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;
  cursor: pointer;
}

.filters select:focus {
  border-color: #27ae60;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
}

.customer-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.customer-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
}

.customer-table tr:hover {
  background: #f8faf7;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.inactive {
  background: #e2e3e5;
  color: #383d41;
  border: 1px solid #d6d8db;
}

.status-badge.suspended {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.btn-view, .btn-edit, .btn-delete {
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

.btn-edit {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-edit:hover {
  background: #bbdefb;
}

.btn-delete {
  background: #fff3cd;
  color: #856404;
}

.btn-delete:hover {
  background: #ffeaa7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .customer-accounts-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input, .filters select {
    width: 100%;
  }
  
  .customer-table {
    font-size: 0.9rem;
  }
  
  .customer-table th, .customer-table td {
    padding: 0.75rem;
  }
}
</style>