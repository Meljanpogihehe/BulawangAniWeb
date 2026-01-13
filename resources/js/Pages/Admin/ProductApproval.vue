<template>
    <div class="product-approval-page">
      <div class="page-header">
        <h1>Product Approval</h1>
        <p>Review and approve new product submissions</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="openAddModal">Add New Product</button>
          <div class="filters">
            <select v-model="filterStatus">
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search products..." v-model="searchQuery" />
          </div>
        </div>
        
        <div class="table-container">
          <table class="approval-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Seller</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id">
                <td>
                  <div class="product-info">
                    <img :src="product.image" :alt="product.name" class="product-image" />
                    <div>
                      <div class="product-name">{{ product.name }}</div>
                      <div class="product-sku">SKU: {{ product.sku }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ product.seller }}</td>
                <td>{{ product.category }}</td>
                <td>₱{{ product.price }}</td>
                <td>
                  <span :class="['status-badge', product.status.toLowerCase()]">
                    {{ product.status }}
                  </span>
                </td>
                <td>{{ formatDate(product.submittedAt) }}</td>
                <td>
                  <button class="btn-view" @click="viewProduct(product)">View</button>
                  <button class="btn-approve" v-if="product.status === 'Pending'" @click="approveProduct(product)">Approve</button>
                  <button class="btn-reject" v-if="product.status === 'Pending'" @click="rejectProduct(product)">Reject</button>
                  <button class="btn-delete" @click="openDeleteModal(product)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Product Modal -->
      <AdminModal
        :isOpen="showAddModal"
        title="Add New Product"
        submitText="Submit for Approval"
        :isLoading="isSubmitting"
        @close="closeAddModal"
        @submit="addProduct"
      >
        <div class="form-group">
          <label for="add-name">Product Name</label>
          <input
            type="text"
            id="add-name"
            v-model="newProduct.name"
            placeholder="Enter product name"
            :class="{ 'error': addErrors.name }"
          />
          <span v-if="addErrors.name" class="error-message">{{ addErrors.name }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-sku">SKU</label>
          <input
            type="text"
            id="add-sku"
            v-model="newProduct.sku"
            placeholder="Enter product SKU"
            :class="{ 'error': addErrors.sku }"
          />
          <span v-if="addErrors.sku" class="error-message">{{ addErrors.sku }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-seller">Seller</label>
          <input
            type="text"
            id="add-seller"
            v-model="newProduct.seller"
            placeholder="Enter seller name"
            :class="{ 'error': addErrors.seller }"
          />
          <span v-if="addErrors.seller" class="error-message">{{ addErrors.seller }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-category">Category</label>
          <select id="add-category" v-model="newProduct.category" :class="{ 'error': addErrors.category }">
            <option value="">Select Category</option>
            <option value="Grains">Grains</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Organic">Organic</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat & Poultry">Meat & Poultry</option>
          </select>
          <span v-if="addErrors.category" class="error-message">{{ addErrors.category }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-price">Price</label>
          <input
            type="number"
            id="add-price"
            v-model.number="newProduct.price"
            placeholder="Enter product price"
            min="0"
            step="0.01"
            :class="{ 'error': addErrors.price }"
          />
          <span v-if="addErrors.price" class="error-message">{{ addErrors.price }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-image">Image URL</label>
          <input
            type="url"
            id="add-image"
            v-model="newProduct.image"
            placeholder="Enter product image URL"
            :class="{ 'error': addErrors.image }"
          />
          <span v-if="addErrors.image" class="error-message">{{ addErrors.image }}</span>
        </div>
      </AdminModal>

      <!-- Delete Product Modal -->
      <AdminModal
        :isOpen="showDeleteModal"
        title="Delete Product"
        submitText="Delete Product"
        :isLoading="isSubmitting"
        @close="closeDeleteModal"
        @submit="deleteProduct"
      >
        <div class="delete-warning">
          <p>Are you sure you want to delete this product submission?</p>
          <p class="delete-name">{{ deleteProductData.name }}</p>
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
  name: 'ProductApproval',
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
      
      // Product data
      products: [
        { id: 1, name: 'Organic Mangoes', sku: 'MANGO-001', seller: 'Tropical Farms', category: 'Fruits', price: 150, status: 'Pending', submittedAt: '2024-01-15', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200' },
        { id: 2, name: 'Fresh Milk', sku: 'MILK-001', seller: 'Dairy Plus', category: 'Dairy', price: 80, status: 'Approved', submittedAt: '2024-01-14', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200' },
        { id: 3, name: 'Free Range Eggs', sku: 'EGG-001', seller: 'Happy Hens Farm', category: 'Dairy', price: 120, status: 'Pending', submittedAt: '2024-01-13', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200' },
        { id: 4, name: 'Herbal Tea', sku: 'TEA-001', seller: 'Nature\'s Brew', category: 'Beverages', price: 200, status: 'Rejected', submittedAt: '2024-01-12', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200' },
        { id: 5, name: 'Whole Wheat Bread', sku: 'BREAD-001', seller: 'Bakery Delight', category: 'Bakery', price: 90, status: 'Approved', submittedAt: '2024-01-11', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200' }
      ],
      
      // Form data
      newProduct: {
        name: '',
        sku: '',
        seller: '',
        category: '',
        price: 0,
        image: ''
      },
      deleteProductData: {
        id: null,
        name: ''
      },
      
      // Form errors
      addErrors: {}
    }
  },
  computed: {
    filteredProducts() {
      let filtered = this.products
      
      // Filter by status
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(product => product.status.toLowerCase() === this.filterStatus)
      }
      
      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.seller.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.status.toLowerCase().includes(query)
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
    
    openDeleteModal(product) {
      this.deleteProductData = { id: product.id, name: product.name }
      this.showDeleteModal = true
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteProductData = { id: null, name: '' }
    },
    
    // Form reset methods
    resetAddForm() {
      this.newProduct = {
        name: '',
        sku: '',
        seller: '',
        category: '',
        price: 0,
        image: ''
      }
      this.addErrors = {}
    },
    
    // Validation methods
    validateAddForm() {
      this.addErrors = {}
      let isValid = true
      
      if (!this.newProduct.name.trim()) {
        this.addErrors.name = 'Product name is required'
        isValid = false
      }
      
      if (!this.newProduct.sku.trim()) {
        this.addErrors.sku = 'SKU is required'
        isValid = false
      }
      
      if (!this.newProduct.seller.trim()) {
        this.addErrors.seller = 'Seller name is required'
        isValid = false
      }
      
      if (!this.newProduct.category) {
        this.addErrors.category = 'Please select a category'
        isValid = false
      }
      
      if (!this.newProduct.price || this.newProduct.price <= 0) {
        this.addErrors.price = 'Price must be greater than 0'
        isValid = false
      }
      
      if (!this.newProduct.image.trim()) {
        this.addErrors.image = 'Product image URL is required'
        isValid = false
      } else if (!this.isValidUrl(this.newProduct.image)) {
        this.addErrors.image = 'Please enter a valid image URL'
        isValid = false
      }
      
      return isValid
    },
    
    isValidUrl(string) {
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    },
    
    // CRUD operations
    async addProduct() {
      if (!this.validateAddForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Generate new product ID
        const newId = Math.max(...this.products.map(p => p.id)) + 1
        
        // Add new product to the list
        this.products.push({
          id: newId,
          name: this.newProduct.name.trim(),
          sku: this.newProduct.sku.trim().toUpperCase(),
          seller: this.newProduct.seller.trim(),
          category: this.newProduct.category,
          price: parseFloat(this.newProduct.price),
          status: 'Pending',
          submittedAt: new Date().toISOString().split('T')[0],
          image: this.newProduct.image.trim()
        })
        
        // Close modal and reset form
        this.closeAddModal()
        
        // Show success message
        this.showMessage('Product submitted for approval successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('New product submitted:', this.newProduct)
      } catch (error) {
        this.showMessage('Error submitting product. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async approveProduct(product) {
      this.isSubmitting = true
      
      try {
        // Find and update the product status
        const index = this.products.findIndex(p => p.id === product.id)
        if (index !== -1) {
          this.products[index].status = 'Approved'
          
          // Show success message
          this.showMessage('Product approved successfully!', 'success')
          
          // In a real application, you would make an API call here
          console.log('Product approved:', product)
        }
      } catch (error) {
        this.showMessage('Error approving product. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async rejectProduct(product) {
      this.isSubmitting = true
      
      try {
        // Find and update the product status
        const index = this.products.findIndex(p => p.id === product.id)
        if (index !== -1) {
          this.products[index].status = 'Rejected'
          
          // Show success message
          this.showMessage('Product rejected successfully!', 'success')
          
          // In a real application, you would make an API call here
          console.log('Product rejected:', product)
        }
      } catch (error) {
        this.showMessage('Error rejecting product. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async deleteProduct() {
      this.isSubmitting = true
      
      try {
        // Remove product from the list
        this.products = this.products.filter(product => product.id !== this.deleteProductData.id)
        
        // Close modal
        this.closeDeleteModal()
        
        // Show success message
        this.showMessage('Product submission deleted successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('Product deleted:', this.deleteProductData)
      } catch (error) {
        this.showMessage('Error deleting product. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    // Other methods
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    
    viewProduct(product) {
      // Implement view product logic
      console.log('Viewing product:', product)
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
.product-approval-page {
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

.approval-table {
  width: 100%;
  border-collapse: collapse;
}

.approval-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.approval-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.approval-table tr:hover {
  background: #f8faf7;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e8f1e1;
}

.product-name {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.product-sku {
  font-size: 0.8rem;
  color: #7f8c8d;
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

.btn-view, .btn-approve, .btn-reject {
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

/* Responsive Design */
@media (max-width: 768px) {
  .product-approval-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters select, .search-box input {
    width: 100%;
  }
  
  .approval-table {
    font-size: 0.9rem;
  }
  
  .approval-table th, .approval-table td {
    padding: 0.75rem;
  }
  
  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>