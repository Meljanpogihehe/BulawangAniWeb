<template>
    <div class="seller-accounts-page">
      <div class="page-header">
        <h1>Seller Accounts</h1>
        <p>Manage seller accounts and verify new applications</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="openAddModal">Add New Seller</button>
          <div class="search-box">
            <input type="text" placeholder="Search sellers..." v-model="searchQuery" />
          </div>
        </div>
        
        <div class="table-container">
          <table class="seller-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Owner</th>
                <th>Email</th>
                <th>Status</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="seller in filteredSellers" :key="seller.id">
                <td>{{ seller.businessName }}</td>
                <td>{{ seller.ownerName }}</td>
                <td>{{ seller.email }}</td>
                <td>
                  <span :class="['status-badge', seller.status.toLowerCase()]">
                    {{ seller.status }}
                  </span>
                </td>
                <td>{{ seller.productCount }}</td>
                <td>
                  <button class="btn-view">View</button>
                  <button class="btn-edit" @click="openEditModal(seller)">Edit</button>
                  <button class="btn-delete" @click="openDeleteModal(seller)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Seller Modal -->
      <AdminModal
        :isOpen="showAddModal"
        title="Add New Seller"
        submitText="Create Seller"
        :isLoading="isSubmitting"
        @close="closeAddModal"
        @submit="addSeller"
      >
        <!-- Business Information Section -->
        <div class="form-section">
          <div class="form-section-title">
            Business Information
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label for="add-business-name">
                <span class="label-text">Business Name</span>
                <span class="required">*</span>
              </label>
              <input
                type="text"
                id="add-business-name"
                v-model="newSeller.businessName"
                placeholder="e.g., Fresh Farm Produce"
                :class="{ 'error': addErrors.businessName }"
                @input="clearError('businessName')"
              />
              <span v-if="addErrors.businessName" class="error-message">{{ addErrors.businessName }}</span>
            </div>

            <div class="form-group">
              <label for="add-owner-name">
                <span class="label-text">Owner Name</span>
                <span class="required">*</span>
              </label>
              <input
                type="text"
                id="add-owner-name"
                v-model="newSeller.ownerName"
                placeholder="e.g., Maria Santos"
                :class="{ 'error': addErrors.ownerName }"
                @input="clearError('ownerName')"
              />
              <span v-if="addErrors.ownerName" class="error-message">{{ addErrors.ownerName }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="add-business-type">
              <span class="label-text">Business Type</span>
              <span class="required">*</span>
            </label>
            <select id="add-business-type" v-model="newSeller.businessType" :class="{ 'error': addErrors.businessType }" @change="clearError('businessType')">
              <option value="">Select Business Type</option>
              <option value="Farm">Farm</option>
              <option value="Cooperative">Cooperative</option>
              <option value="Small Business">Small Business</option>
              <option value="Large Business">Large Business</option>
            </select>
            <span v-if="addErrors.businessType" class="error-message">{{ addErrors.businessType }}</span>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div class="form-section">
          <div class="form-section-title">
            Contact Information
          </div>
          <div class="form-group">
            <label for="add-email">
              <span class="label-text">Business Email</span>
              <span class="required">*</span>
            </label>
            <input
              type="email"
              id="add-email"
              v-model="newSeller.email"
              placeholder="e.g., contact@freshfarm.com"
              :class="{ 'error': addErrors.email }"
              @input="clearError('email')"
            />
            <span v-if="addErrors.email" class="error-message">{{ addErrors.email }}</span>
          </div>

          <div class="form-group">
            <label for="add-phone">
              <span class="label-text">Phone Number</span>
              <span class="required">*</span>
            </label>
            <input
              type="tel"
              id="add-phone"
              v-model="newSeller.phone"
              placeholder="+63 9XX XXX XXXX"
              :class="{ 'error': addErrors.phone }"
              @input="clearError('phone')"
            />
            <span v-if="addErrors.phone" class="error-message">{{ addErrors.phone }}</span>
          </div>
        </div>

        <!-- Address Information Section -->
        <div class="form-section">
          <div class="form-section-title">
            Business Address
          </div>
          <div class="form-group">
            <label for="add-address">
              <span class="label-text">Complete Address</span>
              <span class="required">*</span>
            </label>
            <input
              type="text"
              id="add-address"
              v-model="newSeller.address"
              placeholder="e.g., 123 Farm Road, City, Province"
              :class="{ 'error': addErrors.address }"
              @input="clearError('address')"
            />
            <span v-if="addErrors.address" class="error-message">{{ addErrors.address }}</span>
          </div>
        </div>

        <!-- Account Settings Section -->
        <div class="form-section">
          <div class="form-section-title">
            Account Settings
          </div>
          <div class="form-group">
            <label for="add-status">
              <span class="label-text">Initial Status</span>
            </label>
            <select id="add-status" v-model="newSeller.status">
              <option value="Pending">Pending Review</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
            <div class="hint">New sellers typically start as 'Pending' for verification</div>
          </div>
        </div>

        <!-- Progress Indicator -->
        <div v-if="isSubmitting" class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="progress-text">{{ progressText }}</div>
        </div>
      </AdminModal>

      <!-- Edit Seller Modal -->
      <AdminModal
        :isOpen="showEditModal"
        title="Edit Seller"
        submitText="Update Seller"
        :isLoading="isSubmitting"
        @close="closeEditModal"
        @submit="updateSeller"
      >
        <!-- Basic Information Section -->
        <div class="form-section">
          <div class="form-section-title">
            Basic Information
          </div>
          <div class="modal-form-grid">
            <div class="form-group">
              <label for="edit-business-name">
                <span class="label-text">Business Name</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="edit-business-name"
                  v-model="editSeller.businessName"
                  placeholder="e.g., Fresh Farm Produce"
                  :class="{ 'error': editErrors.businessName }"
                />
                <div class="input-icon">🏢</div>
              </div>
              <span v-if="editErrors.businessName" class="error-message">{{ editErrors.businessName }}</span>
            </div>

            <div class="form-group">
              <label for="edit-owner-name">
                <span class="label-text">Owner Name</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="edit-owner-name"
                  v-model="editSeller.ownerName"
                  placeholder="e.g., Maria Santos"
                  :class="{ 'error': editErrors.ownerName }"
                />
                <div class="input-icon">👤</div>
              </div>
              <span v-if="editErrors.ownerName" class="error-message">{{ editErrors.ownerName }}</span>
            </div>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div class="form-section">
          <div class="form-section-title">
            Contact Information
          </div>
          <div class="modal-form-grid">
            <div class="form-group">
              <label for="edit-email">
                <span class="label-text">Business Email</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  type="email"
                  id="edit-email"
                  v-model="editSeller.email"
                  placeholder="e.g., contact@freshfarm.com"
                  :class="{ 'error': editErrors.email }"
                />
                <div class="input-icon">📧</div>
              </div>
              <span v-if="editErrors.email" class="error-message">{{ editErrors.email }}</span>
              <div class="hint">This will be used for notifications and support</div>
            </div>

            <div class="form-group">
              <label for="edit-phone">
                <span class="label-text">Phone Number</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  type="tel"
                  id="edit-phone"
                  v-model="editSeller.phone"
                  placeholder="+63 9XX XXX XXXX"
                  :class="{ 'error': editErrors.phone }"
                />
                <div class="input-icon">📱</div>
              </div>
              <span v-if="editErrors.phone" class="error-message">{{ editErrors.phone }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="edit-address">
              <span class="label-text">Business Address</span>
              <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <input
                type="text"
                id="edit-address"
                v-model="editSeller.address"
                placeholder="e.g., 123 Farm Road, City, Province"
                :class="{ 'error': editErrors.address }"
              />
              <div class="input-icon">📍</div>
            </div>
            <span v-if="editErrors.address" class="error-message">{{ editErrors.address }}</span>
            <div class="hint">Complete address for delivery and verification purposes</div>
          </div>
        </div>

        <!-- Business Settings Section -->
        <div class="form-section">
          <div class="form-section-title">
            Business Settings
          </div>
          <div class="form-group">
            <label for="edit-business-type">
              <span class="label-text">Business Type</span>
              <span class="required">*</span>
            </label>
            <div class="select-wrapper">
              <select id="edit-business-type" v-model="editSeller.businessType" :class="{ 'error': editErrors.businessType }">
                <option value="">Select Business Type</option>
                <option value="Farm">Farm</option>
                <option value="Cooperative">Cooperative</option>
                <option value="Small Business">Small Business</option>
                <option value="Large Business">Large Business</option>
              </select>
              <div class="select-icon">🏭</div>
            </div>
            <span v-if="editErrors.businessType" class="error-message">{{ editErrors.businessType }}</span>
            <div class="hint">Business type affects commission rates and verification requirements</div>
          </div>

          <div class="form-group">
            <label for="edit-status">
              <span class="label-text">Account Status</span>
            </label>
            <div class="select-wrapper">
              <select id="edit-status" v-model="editSeller.status">
                <option value="Pending">Pending Review</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
              <div class="select-icon">📊</div>
            </div>
            <div class="hint">Active sellers can list products, suspended ones cannot</div>
          </div>
        </div>

        <!-- Progress Indicator -->
        <div v-if="isSubmitting" class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="progress-text">{{ progressText }}</div>
        </div>

        <!-- Seller Preview -->
        <div class="seller-preview">
          <h4>Seller Preview</h4>
          <div class="preview-card">
            <div class="preview-header">
              <span class="preview-icon">🏢</span>
              <div class="preview-info">
                <div class="preview-business">{{ editSeller.businessName || 'Business Name' }}</div>
                <div class="preview-owner">{{ editSeller.ownerName || 'Owner Name' }}</div>
                <div class="preview-email">{{ editSeller.email || 'email@example.com' }}</div>
              </div>
            </div>
            <div class="preview-details">
              <div class="preview-type">
                <span class="type-badge" :class="editSeller.businessType ? editSeller.businessType.toLowerCase().replace(' ', '-') : 'default'">
                  {{ editSeller.businessType || 'Business Type' }}
                </span>
              </div>
              <div class="preview-status">
                <span :class="['status-badge', editSeller.status.toLowerCase()]">
                  {{ editSeller.status || 'Status' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AdminModal>

      <!-- Delete Seller Modal -->
      <AdminModal
        :isOpen="showDeleteModal"
        title="Delete Seller Account"
        submitText="Delete Account"
        :isLoading="isSubmitting"
        @close="closeDeleteModal"
        @submit="deleteSeller"
      >
        <div class="delete-warning">
          <h4>Are you sure you want to delete this seller account?</h4>
          <p class="delete-name">{{ deleteSellerData.businessName }}</p>
          <div class="warning-details">
            <p><strong>This action will:</strong></p>
            <ul>
              <li>Remove the seller account permanently</li>
              <li>Hide all associated products from the marketplace</li>
              <li>Cancel any pending orders</li>
              <li>Cannot be undone</li>
            </ul>
          </div>
          <p class="confirmation-text">Please type "<strong>{{ deleteSellerData.businessName }}</strong>" to confirm:</p>
          <input
            type="text"
            v-model="deleteConfirmation"
            placeholder="Type the business name to confirm"
            class="confirmation-input"
          />
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
  name: 'SellerAccounts',
  components: {
    AdminModal
  },
  data() {
    return {
      searchQuery: '',
      isSubmitting: false,
      message: null,

      // Progress indicator
      progressPercent: 0,
      progressText: 'Creating seller account...',

      // Modal states
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      
      // Seller data
      sellers: [
        { id: 1, businessName: 'Fresh Farm Produce', ownerName: 'Maria Santos', email: 'maria@freshfarm.com', status: 'Active', productCount: 15 },
        { id: 2, businessName: 'Organic Valley', ownerName: 'Juan Dela Cruz', email: 'juan@organicvalley.com', status: 'Pending', productCount: 8 },
        { id: 3, businessName: 'Green Fields', ownerName: 'Ana Reyes', email: 'ana@greenfields.com', status: 'Suspended', productCount: 12 },
        { id: 4, businessName: 'Pure Harvest', ownerName: 'Pedro Gomez', email: 'pedro@pureharvest.com', status: 'Active', productCount: 20 }
      ],
      
      // Form data
      newSeller: {
        businessName: '',
        ownerName: '',
        email: '',
        address: '',
        phone: '',
        businessType: '',
        status: 'Pending'
      },
      editSeller: {
        id: null,
        businessName: '',
        ownerName: '',
        email: '',
        address: '',
        phone: '',
        businessType: '',
        status: ''
      },
      deleteSellerData: {
        id: null,
        businessName: ''
      },
      
      // Form errors
      addErrors: {},
      editErrors: {},
      
      // Delete confirmation
      deleteConfirmation: ''
    }
  },
  computed: {
    filteredSellers() {
      if (!this.searchQuery.trim()) {
        return this.sellers
      }
      const query = this.searchQuery.toLowerCase()
      return this.sellers.filter(seller =>
        seller.businessName.toLowerCase().includes(query) ||
        seller.ownerName.toLowerCase().includes(query) ||
        seller.email.toLowerCase().includes(query) ||
        seller.status.toLowerCase().includes(query)
      )
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
    
    openEditModal(seller) {
      this.editSeller = { ...seller }
      this.showEditModal = true
    },
    
    closeEditModal() {
      this.showEditModal = false
      this.resetEditForm()
    },
    
    openDeleteModal(seller) {
      this.deleteSellerData = { id: seller.id, businessName: seller.businessName }
      this.showDeleteModal = true
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteSellerData = { id: null, businessName: '' }
    },
    
    // Form reset methods
    resetAddForm() {
      this.newSeller = {
        businessName: '',
        ownerName: '',
        email: '',
        address: '',
        phone: '',
        businessType: '',
        status: 'Pending'
      }
      this.addErrors = {}
      this.deleteConfirmation = ''
    },
    
    resetEditForm() {
      this.editSeller = {
        id: null,
        businessName: '',
        ownerName: '',
        email: '',
        address: '',
        phone: '',
        businessType: '',
        status: ''
      }
      this.editErrors = {}
    },

    // Error handling
    clearError(field) {
      if (this.addErrors[field]) {
        this.addErrors[field] = ''
      }
      if (this.editErrors[field]) {
        this.editErrors[field] = ''
      }
    },
    
    // Validation methods
    validateAddForm() {
      this.addErrors = {}
      let isValid = true
      
      if (!this.newSeller.businessName.trim()) {
        this.addErrors.businessName = 'Business name is required'
        isValid = false
      }
      
      if (!this.newSeller.ownerName.trim()) {
        this.addErrors.ownerName = 'Owner name is required'
        isValid = false
      }
      
      if (!this.newSeller.email.trim()) {
        this.addErrors.email = 'Email is required'
        isValid = false
      } else if (!this.isValidEmail(this.newSeller.email)) {
        this.addErrors.email = 'Please enter a valid email address'
        isValid = false
      }
      
      if (!this.newSeller.address.trim()) {
        this.addErrors.address = 'Business address is required'
        isValid = false
      }
      
      if (!this.newSeller.phone.trim()) {
        this.addErrors.phone = 'Phone number is required'
        isValid = false
      } else if (!this.isValidPhone(this.newSeller.phone)) {
        this.addErrors.phone = 'Please enter a valid phone number'
        isValid = false
      }
      
      if (!this.newSeller.businessType) {
        this.addErrors.businessType = 'Please select a business type'
        isValid = false
      }
      
      return isValid
    },
    
    validateEditForm() {
      this.editErrors = {}
      let isValid = true
      
      if (!this.editSeller.businessName.trim()) {
        this.editErrors.businessName = 'Business name is required'
        isValid = false
      }
      
      if (!this.editSeller.ownerName.trim()) {
        this.editErrors.ownerName = 'Owner name is required'
        isValid = false
      }
      
      if (!this.editSeller.email.trim()) {
        this.editErrors.email = 'Email is required'
        isValid = false
      } else if (!this.isValidEmail(this.editSeller.email)) {
        this.editErrors.email = 'Please enter a valid email address'
        isValid = false
      }
      
      if (!this.editSeller.address.trim()) {
        this.editErrors.address = 'Business address is required'
        isValid = false
      }
      
      if (!this.editSeller.phone.trim()) {
        this.editErrors.phone = 'Phone number is required'
        isValid = false
      } else if (!this.isValidPhone(this.editSeller.phone)) {
        this.editErrors.phone = 'Please enter a valid phone number'
        isValid = false
      }
      
      if (!this.editSeller.businessType) {
        this.editErrors.businessType = 'Please select a business type'
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
    async addSeller() {
      if (!this.validateAddForm()) {
        return
      }

      this.isSubmitting = true
      this.progressPercent = 0
      this.progressText = 'Validating seller information...'

      try {
        // Simulate progress steps
        await this.simulateProgress(20, 'Checking for duplicate accounts...')
        await this.simulateProgress(40, 'Creating seller profile...')
        await this.simulateProgress(60, 'Setting up account permissions...')
        await this.simulateProgress(80, 'Sending welcome notification...')

        // Generate new seller ID
        const newId = Math.max(...this.sellers.map(s => s.id)) + 1

        // Add new seller to the list
        this.sellers.push({
          id: newId,
          businessName: this.newSeller.businessName.trim(),
          ownerName: this.newSeller.ownerName.trim(),
          email: this.newSeller.email.trim(),
          status: this.newSeller.status,
          productCount: 0
        })

        await this.simulateProgress(100, 'Account created successfully!')

        // Close modal and reset form
        this.closeAddModal()

        // Show success message
        this.showMessage('Seller account created successfully!', 'success')

        // In a real application, you would make an API call here
        console.log('New seller added:', this.newSeller)
      } catch (error) {
        this.showMessage('Error creating seller account. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
        this.progressPercent = 0
      }
    },
    
    async updateSeller() {
      if (!this.validateEditForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Find and update the seller
        const index = this.sellers.findIndex(seller => seller.id === this.editSeller.id)
        if (index !== -1) {
          this.sellers[index] = { ...this.editSeller }
          
          // Close modal
          this.closeEditModal()
          
          // Show success message
          this.showMessage('Seller account updated successfully!', 'success')
          
          // In a real application, you would make an API call here
          console.log('Seller updated:', this.editSeller)
        }
      } catch (error) {
        this.showMessage('Error updating seller account. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async deleteSeller() {
      this.isSubmitting = true
      
      try {
        // Validate confirmation
        if (this.deleteConfirmation.trim() !== this.deleteSellerData.businessName) {
          this.showMessage('Please type the exact business name to confirm deletion.', 'error')
          return
        }
        
        // Remove seller from the list
        this.sellers = this.sellers.filter(seller => seller.id !== this.deleteSellerData.id)
        
        // Close modal
        this.closeDeleteModal()
        
        // Show success message
        this.showMessage('Seller account deleted successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('Seller deleted:', this.deleteSellerData)
      } catch (error) {
        this.showMessage('Error deleting seller account. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    // Progress simulation
    async simulateProgress(percent, text) {
      this.progressPercent = percent
      this.progressText = text
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate delay
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
.seller-accounts-page {
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

.btn-primary {
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

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
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

.seller-table {
  width: 100%;
  border-collapse: collapse;
}

.seller-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.seller-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
}

.seller-table tr:hover {
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

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
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


/* Message Styles */
.message {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideInRight 0.3s ease-out;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Delete Warning Styles */
.delete-warning {
  text-align: center;
  padding: 1rem;
}

.delete-warning p {
  margin: 0.5rem 0;
  color: #5a6c5a;
}

.delete-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 1rem 0;
}

.delete-warning-text {
  color: #e74c3c;
  font-style: italic;
}

/* Progress Indicator Styles */
.progress-indicator {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8faf7;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e8f1e1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #5a6c5a;
  font-weight: 600;
  text-align: center;
}

/* Form Section Styles */
.form-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8faf7;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.form-section-title {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e8f1e1;
}

.section-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.label-text {
  margin-right: 0.25rem;
}

.required {
  color: #e74c3c;
}

.tooltip-icon {
  cursor: help;
  font-size: 0.9rem;
  opacity: 0.7;
}

.tooltip-icon:hover {
  opacity: 1;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e8f1e1;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #27ae60;
}

.form-group input.error,
.form-group select.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  font-weight: 600;
}

.hint {
  font-size: 0.8rem;
  color: #5a6c5a;
  margin-top: 0.25rem;
  font-style: italic;
}

/* Delete Warning Styles */
.delete-warning {
  text-align: center;
  padding: 1rem;
}

.delete-warning p {
  margin: 0.5rem 0;
  color: #5a6c5a;
}

.delete-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 1rem 0;
}

.warning-details {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: left;
}

.warning-details ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.warning-details li {
  margin-bottom: 0.25rem;
  color: #856404;
}

.confirmation-text {
  font-weight: 600;
  color: #2c3e50;
  margin: 1rem 0 0.5rem 0;
}

.confirmation-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e8f1e1;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.confirmation-input:focus {
  border-color: #e74c3c;
}

/* Input and Select Wrappers */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  padding-right: 3rem;
}

.input-icon {
  position: absolute;
  right: 0.75rem;
  font-size: 1.2rem;
  color: #5a6c5a;
  pointer-events: none;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrapper select {
  padding-right: 3rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a6c5a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.select-icon {
  position: absolute;
  right: 0.75rem;
  font-size: 1.2rem;
  color: #5a6c5a;
  pointer-events: none;
  z-index: 1;
}

.select-wrapper select:focus + .select-icon {
  color: #27ae60;
}

/* Modal Form Grid */
.modal-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Seller Preview Styles */
.seller-preview {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8faf7;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.seller-preview h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 700;
}

.preview-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e8f1e1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.preview-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.preview-icon {
  font-size: 1.5rem;
}

.preview-info {
  flex: 1;
}

.preview-business {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.preview-owner {
  color: #5a6c5a;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.preview-email {
  color: #5a6c5a;
  font-size: 0.85rem;
}

.preview-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.preview-type .type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.farm {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.type-badge.cooperative {
  background: #fff3e0;
  color: #ef6c00;
  border: 1px solid #ffcc02;
}

.type-badge.small-business {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.type-badge.large-business {
  background: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #ce93d8;
}

.type-badge.default {
  background: #f5f5f5;
  color: #616161;
  border: 1px solid #e0e0e0;
}

.preview-status .status-badge {
  font-size: 0.75rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .seller-accounts-page {
    padding: 1rem;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box input {
    width: 100%;
  }

  .seller-table {
    font-size: 0.9rem;
  }

  .seller-table th, .seller-table td {
    padding: 0.75rem;
  }

  .modal-content {
    margin: 1rem;
    max-height: 85vh;
  }

  .modal-header {
    padding: 1.5rem;
  }

  .modal-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-secondary,
  .btn-primary {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-form-grid {
    grid-template-columns: 1fr;
  }

  .progress-indicator {
    margin-top: 1rem;
    padding: 0.75rem;
  }

  .preview-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>