<template>
    <div class="seller-verification-page">
      <div class="page-header">
        <h1>Seller Verification</h1>
        <p>Verify new seller applications and documents</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="openAddModal">Add New Seller</button>
          <div class="filters">
            <select v-model="filterStatus">
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search sellers..." v-model="searchQuery" />
          </div>
        </div>
        
        <div class="table-container">
          <table class="verification-table">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Business Name</th>
                <th>Application Date</th>
                <th>Documents</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="seller in filteredSellers" :key="seller.id">
                <td>
                  <div class="seller-info">
                    <div class="seller-name">{{ seller.name }}</div>
                    <div class="seller-email">{{ seller.email }}</div>
                  </div>
                </td>
                <td>{{ seller.businessName }}</td>
                <td>{{ formatDate(seller.applicationDate) }}</td>
                <td>
                  <div class="documents">
                    <span class="doc-item" v-for="doc in seller.documents" :key="doc">
                      {{ doc }}
                    </span>
                  </div>
                </td>
                <td>
                  <span :class="['status-badge', seller.status.toLowerCase()]">
                    {{ seller.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-view" @click="viewSeller(seller)">View</button>
                  <button class="btn-verify" v-if="seller.status === 'Pending'" @click="verifySeller(seller)">Verify</button>
                  <button class="btn-reject" v-if="seller.status === 'Pending'" @click="rejectSeller(seller)">Reject</button>
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
        submitText="Submit for Verification"
        :isLoading="isSubmitting"
        @close="closeAddModal"
        @submit="addSeller"
      >
        <div class="form-group">
          <label for="add-name">Full Name</label>
          <input
            type="text"
            id="add-name"
            v-model="newSeller.name"
            placeholder="Enter seller full name"
            :class="{ 'error': addErrors.name }"
          />
          <span v-if="addErrors.name" class="error-message">{{ addErrors.name }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-email">Email Address</label>
          <input
            type="email"
            id="add-email"
            v-model="newSeller.email"
            placeholder="Enter seller email"
            :class="{ 'error': addErrors.email }"
          />
          <span v-if="addErrors.email" class="error-message">{{ addErrors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-business-name">Business Name</label>
          <input
            type="text"
            id="add-business-name"
            v-model="newSeller.businessName"
            placeholder="Enter business name"
            :class="{ 'error': addErrors.businessName }"
          />
          <span v-if="addErrors.businessName" class="error-message">{{ addErrors.businessName }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-documents">Documents</label>
          <div class="document-list">
            <label class="checkbox-label">
              <input type="checkbox" v-model="newSeller.documents" value="Business Permit" />
              Business Permit
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="newSeller.documents" value="Tax ID" />
              Tax ID
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="newSeller.documents" value="Bank Account" />
              Bank Account
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="newSeller.documents" value="Insurance" />
              Insurance
            </label>
          </div>
          <span v-if="addErrors.documents" class="error-message">{{ addErrors.documents }}</span>
        </div>
      </AdminModal>

      <!-- Delete Seller Modal -->
      <AdminModal
        :isOpen="showDeleteModal"
        title="Delete Seller"
        submitText="Delete Seller"
        :isLoading="isSubmitting"
        @close="closeDeleteModal"
        @submit="deleteSeller"
      >
        <div class="delete-warning">
          <p>Are you sure you want to delete this seller application?</p>
          <p class="delete-name">{{ deleteSellerData.name }}</p>
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
  name: 'SellerVerification',
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
      
      // Seller data
      sellers: [
        {
          id: 1,
          name: 'Maria Santos',
          email: 'maria@freshfarm.com',
          businessName: 'Fresh Farm Produce',
          applicationDate: '2024-01-15',
          status: 'Pending',
          documents: ['Business Permit', 'Tax ID', 'Bank Account']
        },
        {
          id: 2,
          name: 'Juan Dela Cruz',
          email: 'juan@organicvalley.com',
          businessName: 'Organic Valley',
          applicationDate: '2024-01-14',
          status: 'Verified',
          documents: ['Business Permit', 'Organic Certification', 'Tax ID']
        },
        {
          id: 3,
          name: 'Ana Reyes',
          email: 'ana@greenfields.com',
          businessName: 'Green Fields',
          applicationDate: '2024-01-13',
          status: 'Rejected',
          documents: ['Business Permit', 'Tax ID']
        },
        {
          id: 4,
          name: 'Pedro Gomez',
          email: 'pedro@pureharvest.com',
          businessName: 'Pure Harvest',
          applicationDate: '2024-01-12',
          status: 'Pending',
          documents: ['Business Permit', 'Tax ID', 'Bank Account', 'Insurance']
        }
      ],
      
      // Form data
      newSeller: {
        name: '',
        email: '',
        businessName: '',
        documents: []
      },
      deleteSellerData: {
        id: null,
        name: ''
      },
      
      // Form errors
      addErrors: {}
    }
  },
  computed: {
    filteredSellers() {
      let filtered = this.sellers
      
      // Filter by status
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(seller => seller.status.toLowerCase() === this.filterStatus)
      }
      
      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(seller =>
          seller.name.toLowerCase().includes(query) ||
          seller.email.toLowerCase().includes(query) ||
          seller.businessName.toLowerCase().includes(query) ||
          seller.status.toLowerCase().includes(query)
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
    
    openDeleteModal(seller) {
      this.deleteSellerData = { id: seller.id, name: seller.name }
      this.showDeleteModal = true
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteSellerData = { id: null, name: '' }
    },
    
    // Form reset methods
    resetAddForm() {
      this.newSeller = {
        name: '',
        email: '',
        businessName: '',
        documents: []
      }
      this.addErrors = {}
    },
    
    // Validation methods
    validateAddForm() {
      this.addErrors = {}
      let isValid = true
      
      if (!this.newSeller.name.trim()) {
        this.addErrors.name = 'Seller name is required'
        isValid = false
      }
      
      if (!this.newSeller.email.trim()) {
        this.addErrors.email = 'Email is required'
        isValid = false
      } else if (!this.isValidEmail(this.newSeller.email)) {
        this.addErrors.email = 'Please enter a valid email address'
        isValid = false
      }
      
      if (!this.newSeller.businessName.trim()) {
        this.addErrors.businessName = 'Business name is required'
        isValid = false
      }
      
      if (!this.newSeller.documents.length) {
        this.addErrors.documents = 'At least one document is required'
        isValid = false
      }
      
      return isValid
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    // CRUD operations
    async addSeller() {
      if (!this.validateAddForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Generate new seller ID
        const newId = Math.max(...this.sellers.map(s => s.id)) + 1
        
        // Add new seller to the list
        this.sellers.push({
          id: newId,
          name: this.newSeller.name.trim(),
          email: this.newSeller.email.trim(),
          businessName: this.newSeller.businessName.trim(),
          applicationDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          documents: [...this.newSeller.documents]
        })
        
        // Close modal and reset form
        this.closeAddModal()
        
        // Show success message
        this.showMessage('Seller application submitted successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('New seller added:', this.newSeller)
      } catch (error) {
        this.showMessage('Error submitting seller application. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async verifySeller(seller) {
      this.isSubmitting = true
      
      try {
        // Find and update the seller status
        const index = this.sellers.findIndex(s => s.id === seller.id)
        if (index !== -1) {
          this.sellers[index].status = 'Verified'
          
          // Show success message
          this.showMessage('Seller verified successfully!', 'success')
          
          // In a real application, you would make an API call here
          console.log('Seller verified:', seller)
        }
      } catch (error) {
        this.showMessage('Error verifying seller. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async rejectSeller(seller) {
      this.isSubmitting = true
      
      try {
        // Find and update the seller status
        const index = this.sellers.findIndex(s => s.id === seller.id)
        if (index !== -1) {
          this.sellers[index].status = 'Rejected'
          
          // Show success message
          this.showMessage('Seller rejected successfully!', 'success')
          
          // In a real application, you would make an API call here
          console.log('Seller rejected:', seller)
        }
      } catch (error) {
        this.showMessage('Error rejecting seller. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async deleteSeller() {
      this.isSubmitting = true
      
      try {
        // Remove seller from the list
        this.sellers = this.sellers.filter(seller => seller.id !== this.deleteSellerData.id)
        
        // Close modal
        this.closeDeleteModal()
        
        // Show success message
        this.showMessage('Seller application deleted successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('Seller deleted:', this.deleteSellerData)
      } catch (error) {
        this.showMessage('Error deleting seller application. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    // Other methods
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    
    viewSeller(seller) {
      // Implement view seller logic
      console.log('Viewing seller:', seller)
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
.seller-verification-page {
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

.verification-table {
  width: 100%;
  border-collapse: collapse;
}

.verification-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.verification-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.verification-table tr:hover {
  background: #f8faf7;
}

.seller-info {
  display: flex;
  flex-direction: column;
}

.seller-name {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.seller-email {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.documents {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.doc-item {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  background: #f8faf7;
  color: #2c3e50;
  border: 1px solid #e8f1e1;
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

.status-badge.verified {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.btn-view, .btn-verify, .btn-reject {
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

.btn-verify {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.btn-verify:hover {
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

/* Responsive Design */
@media (max-width: 768px) {
  .seller-verification-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters select, .search-box input {
    width: 100%;
  }
  
  .verification-table {
    font-size: 0.9rem;
  }
  
  .verification-table th, .verification-table td {
    padding: 0.75rem;
  }
  
  .documents {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>