<template>
    <div class="products-page">
      <div class="page-header">
        <h1>All Products</h1>
        <p>Manage your product catalog and inventory</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="openAddModal">Add New Product</button>
          <div class="search-box">
            <input type="text" placeholder="Search products..." v-model="searchQuery" />
          </div>
        </div>
        
        <div class="table-container">
          <table class="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
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
                <td>{{ product.category }}</td>
                <td>₱{{ product.price }}</td>
                <td>{{ product.stock }}</td>
                <td>
                  <span :class="['status-badge', product.status.toLowerCase()]">
                    {{ product.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-view">View</button>
                  <button class="btn-edit" @click="openEditModal(product)">Edit</button>
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
        submitText="Create Product"
        :isLoading="isSubmitting"
        @close="closeAddModal"
        @submit="addProduct"
      >
        <div class="form-row">
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
        </div>
        
        <div class="form-row">
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
            <label for="add-status">Status</label>
            <select id="add-status" v-model="newProduct.status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="add-price">Price (₱)</label>
            <input
              type="number"
              id="add-price"
              v-model.number="newProduct.price"
              placeholder="0.00"
              min="0"
              step="0.01"
              :class="{ 'error': addErrors.price }"
            />
            <span v-if="addErrors.price" class="error-message">{{ addErrors.price }}</span>
          </div>
          
          <div class="form-group">
            <label for="add-stock">Stock Quantity</label>
            <input
              type="number"
              id="add-stock"
              v-model.number="newProduct.stock"
              placeholder="0"
              min="0"
              :class="{ 'error': addErrors.stock }"
            />
            <span v-if="addErrors.stock" class="error-message">{{ addErrors.stock }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="add-image">Product Image URL</label>
          <input
            type="url"
            id="add-image"
            v-model="newProduct.image"
            placeholder="https://example.com/product-image.jpg"
            :class="{ 'error': addErrors.image }"
          />
          <span v-if="addErrors.image" class="error-message">{{ addErrors.image }}</span>
          <div class="form-hint">Enter a valid image URL for your product</div>
        </div>
      </AdminModal>

      <!-- Edit Product Modal -->
      <AdminModal
        :isOpen="showEditModal"
        title="Edit Product"
        submitText="Update Product"
        :isLoading="isSubmitting"
        @close="closeEditModal"
        @submit="updateProduct"
      >
        <div class="form-row">
          <div class="form-group">
            <label for="edit-name">Product Name</label>
            <input
              type="text"
              id="edit-name"
              v-model="editProduct.name"
              placeholder="Enter product name"
              :class="{ 'error': editErrors.name }"
            />
            <span v-if="editErrors.name" class="error-message">{{ editErrors.name }}</span>
          </div>
          
          <div class="form-group">
            <label for="edit-sku">SKU</label>
            <input
              type="text"
              id="edit-sku"
              v-model="editProduct.sku"
              placeholder="Enter product SKU"
              :class="{ 'error': editErrors.sku }"
            />
            <span v-if="editErrors.sku" class="error-message">{{ editErrors.sku }}</span>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="edit-category">Category</label>
            <select id="edit-category" v-model="editProduct.category" :class="{ 'error': editErrors.category }">
              <option value="">Select Category</option>
              <option value="Grains">Grains</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Organic">Organic</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat & Poultry">Meat & Poultry</option>
            </select>
            <span v-if="editErrors.category" class="error-message">{{ editErrors.category }}</span>
          </div>
          
          <div class="form-group">
            <label for="edit-status">Status</label>
            <select id="edit-status" v-model="editProduct.status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="edit-price">Price (₱)</label>
            <input
              type="number"
              id="edit-price"
              v-model.number="editProduct.price"
              placeholder="0.00"
              min="0"
              step="0.01"
              :class="{ 'error': editErrors.price }"
            />
            <span v-if="editErrors.price" class="error-message">{{ editErrors.price }}</span>
          </div>
          
          <div class="form-group">
            <label for="edit-stock">Stock Quantity</label>
            <input
              type="number"
              id="edit-stock"
              v-model.number="editProduct.stock"
              placeholder="0"
              min="0"
              :class="{ 'error': editErrors.stock }"
            />
            <span v-if="editErrors.stock" class="error-message">{{ editErrors.stock }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="edit-image">Product Image URL</label>
          <input
            type="url"
            id="edit-image"
            v-model="editProduct.image"
            placeholder="https://example.com/product-image.jpg"
            :class="{ 'error': editErrors.image }"
          />
          <span v-if="editErrors.image" class="error-message">{{ editErrors.image }}</span>
          <div class="form-hint">Enter a valid image URL for your product</div>
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
          <p>Are you sure you want to delete this product?</p>
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
  name: 'Products',
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
      showEditModal: false,
      showDeleteModal: false,
      
      // Product data
      products: [
        { id: 1, name: 'Premium Dinorado Rice', sku: 'RICE-001', category: 'Grains', price: 2250, stock: 50, status: 'Active', image: 'https://images.unsplash.com/photo-1586201375761-6b6e044c1844?w=200' },
        { id: 2, name: 'Organic Benguet Tomatoes', sku: 'TOM-001', category: 'Vegetables', price: 120, stock: 100, status: 'Active', image: 'https://images.unsplash.com/photo-1592924357228-911d3e383fa4?w=200' },
        { id: 3, name: 'Davao Golden Bananas', sku: 'BAN-001', category: 'Fruits', price: 85, stock: 200, status: 'Active', image: 'https://images.unsplash.com/photo-1571771894821-ad99026107b8?w=200' },
        { id: 4, name: 'Wild Bukidnon Honey', sku: 'HON-001', category: 'Organic', price: 450, stock: 25, status: 'Active', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200' },
        { id: 5, name: 'Fresh Carrots', sku: 'CAR-001', category: 'Vegetables', price: 60, stock: 150, status: 'Active', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200' }
      ],
      
      // Form data
      newProduct: {
        name: '',
        sku: '',
        category: '',
        price: 0,
        stock: 0,
        status: 'Active',
        image: ''
      },
      editProduct: {
        id: null,
        name: '',
        sku: '',
        category: '',
        price: 0,
        stock: 0,
        status: '',
        image: ''
      },
      deleteProductData: {
        id: null,
        name: ''
      },
      
      // Form errors
      addErrors: {},
      editErrors: {}
    }
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery.trim()) {
        return this.products
      }
      const query = this.searchQuery.toLowerCase()
      return this.products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.status.toLowerCase().includes(query)
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
    
    openEditModal(product) {
      this.editProduct = { ...product }
      this.showEditModal = true
    },
    
    closeEditModal() {
      this.showEditModal = false
      this.resetEditForm()
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
        category: '',
        price: 0,
        stock: 0,
        status: 'Active',
        image: ''
      }
      this.addErrors = {}
    },
    
    resetEditForm() {
      this.editProduct = {
        id: null,
        name: '',
        sku: '',
        category: '',
        price: 0,
        stock: 0,
        status: '',
        image: ''
      }
      this.editErrors = {}
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
      
      if (!this.newProduct.category) {
        this.addErrors.category = 'Please select a category'
        isValid = false
      }
      
      if (!this.newProduct.price || this.newProduct.price <= 0) {
        this.addErrors.price = 'Price must be greater than 0'
        isValid = false
      }
      
      if (!this.newProduct.stock || this.newProduct.stock < 0) {
        this.addErrors.stock = 'Stock must be 0 or greater'
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
    
    validateEditForm() {
      this.editErrors = {}
      let isValid = true
      
      if (!this.editProduct.name.trim()) {
        this.editErrors.name = 'Product name is required'
        isValid = false
      }
      
      if (!this.editProduct.sku.trim()) {
        this.editErrors.sku = 'SKU is required'
        isValid = false
      }
      
      if (!this.editProduct.category) {
        this.editErrors.category = 'Please select a category'
        isValid = false
      }
      
      if (!this.editProduct.price || this.editProduct.price <= 0) {
        this.editErrors.price = 'Price must be greater than 0'
        isValid = false
      }
      
      if (!this.editProduct.stock || this.editProduct.stock < 0) {
        this.editErrors.stock = 'Stock must be 0 or greater'
        isValid = false
      }
      
      if (!this.editProduct.image.trim()) {
        this.editErrors.image = 'Product image URL is required'
        isValid = false
      } else if (!this.isValidUrl(this.editProduct.image)) {
        this.editErrors.image = 'Please enter a valid image URL'
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
          category: this.newProduct.category,
          price: parseFloat(this.newProduct.price),
          stock: parseInt(this.newProduct.stock),
          status: this.newProduct.status,
          image: this.newProduct.image.trim()
        })
        
        // Close modal and reset form
        this.closeAddModal()
        
        // Show success message
        this.showMessage('Product created successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('New product added:', this.newProduct)
      } catch (error) {
        this.showMessage('Error creating product. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async updateProduct() {
      if (!this.validateEditForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Find and update the product
        const index = this.products.findIndex(product => product.id === this.editProduct.id)
        if (index !== -1) {
          this.products[index] = { ...this.editProduct }
          
          // Close modal
          this.closeEditModal()
          
          // Show success message
          this.showMessage('Product updated successfully!', 'success')
          
          // In a real application, you would make an API call here
          console.log('Product updated:', this.editProduct)
        }
      } catch (error) {
        this.showMessage('Error updating product. Please try again.', 'error')
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
        this.showMessage('Product deleted successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('Product deleted:', this.deleteProductData)
      } catch (error) {
        this.showMessage('Error deleting product. Please try again.', 'error')
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
.products-page {
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

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.products-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.products-table tr:hover {
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

/* Enhanced Modal Form Styles */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background: #fff;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #27ae60;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

.form-group input.error,
.form-group select.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #e74c3c;
  font-size: 0.875rem;
  font-weight: 600;
}

.form-hint {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .products-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .products-table {
    font-size: 0.9rem;
  }
  
  .products-table th, .products-table td {
    padding: 0.75rem;
  }
  
  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>