<template>
    <div class="categories-page">
      <div class="page-header">
        <h1>Product Categories</h1>
        <p>Organize and manage product categories</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="openAddModal">Add New Category</button>
          <div class="search-box">
            <input type="text" placeholder="Search categories..." v-model="searchQuery" />
          </div>
        </div>
        
        <div class="table-container">
          <table class="categories-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in filteredCategories" :key="category.id">
                <td>
                  <div class="category-info">
                    <div class="category-icon">{{ category.icon }}</div>
                    <div>
                      <div class="category-name">{{ category.name }}</div>
                      <div class="category-slug">{{ category.slug }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ category.description }}</td>
                <td>{{ category.productCount }}</td>
                <td>
                  <span :class="['status-badge', category.status.toLowerCase()]">
                    {{ category.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-edit" @click="openEditModal(category)">Edit</button>
                  <button class="btn-delete" @click="openDeleteModal(category)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Category Modal -->
      <AdminModal
        :isOpen="showAddModal"
        title="Add New Category"
        submitText="Create Category"
        :isLoading="isSubmitting"
        @close="closeAddModal"
        @submit="addCategory"
      >
        <div class="form-group">
          <label for="add-name">Category Name</label>
          <input
            type="text"
            id="add-name"
            v-model="newCategory.name"
            placeholder="Enter category name"
            :class="{ 'error': addErrors.name }"
          />
          <span v-if="addErrors.name" class="error-message">{{ addErrors.name }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-slug">Category Slug</label>
          <input
            type="text"
            id="add-slug"
            v-model="newCategory.slug"
            placeholder="Enter category slug (e.g., fruits, vegetables)"
            :class="{ 'error': addErrors.slug }"
          />
          <span v-if="addErrors.slug" class="error-message">{{ addErrors.slug }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-description">Description</label>
          <textarea
            id="add-description"
            v-model="newCategory.description"
            placeholder="Enter category description"
            rows="3"
            :class="{ 'error': addErrors.description }"
          ></textarea>
          <span v-if="addErrors.description" class="error-message">{{ addErrors.description }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-icon">Icon</label>
          <input
            type="text"
            id="add-icon"
            v-model="newCategory.icon"
            placeholder="Enter category icon (e.g., 🍎, 🥦, 🌾)"
            :class="{ 'error': addErrors.icon }"
          />
          <span v-if="addErrors.icon" class="error-message">{{ addErrors.icon }}</span>
        </div>
        
        <div class="form-group">
          <label for="add-status">Status</label>
          <select id="add-status" v-model="newCategory.status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </AdminModal>

      <!-- Edit Category Modal -->
      <AdminModal
        :isOpen="showEditModal"
        title="Edit Category"
        submitText="Update Category"
        :isLoading="isSubmitting"
        @close="closeEditModal"
        @submit="updateCategory"
      >
        <!-- Basic Information Section -->
        <div class="form-section">
          <div class="form-section-title">
            Basic Information
          </div>
          <div class="modal-form-grid">
            <div class="form-group">
              <label for="edit-name">
                <span class="label-text">Category Name</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="edit-name"
                  v-model="editCategory.name"
                  placeholder="Enter category name"
                  :class="{ 'error': editErrors.name }"
                />
                <div class="input-icon">🏷️</div>
              </div>
              <span v-if="editErrors.name" class="error-message">{{ editErrors.name }}</span>
            </div>

            <div class="form-group">
              <label for="edit-slug">
                <span class="label-text">Category Slug</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="edit-slug"
                  v-model="editCategory.slug"
                  placeholder="Enter category slug (e.g., fruits, vegetables)"
                  :class="{ 'error': editErrors.slug }"
                />
                <div class="input-icon">🔗</div>
              </div>
              <span v-if="editErrors.slug" class="error-message">{{ editErrors.slug }}</span>
              <div class="hint">Used in URLs and should contain only lowercase letters, numbers, and hyphens</div>
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="form-section">
          <div class="form-section-title">
            Description
          </div>
          <div class="form-group">
            <label for="edit-description">
              <span class="label-text">Category Description</span>
              <span class="required">*</span>
            </label>
            <div class="textarea-wrapper">
              <textarea
                id="edit-description"
                v-model="editCategory.description"
                placeholder="Enter category description"
                rows="3"
                :class="{ 'error': editErrors.description }"
              ></textarea>
              <div class="textarea-icon">📝</div>
            </div>
            <span v-if="editErrors.description" class="error-message">{{ editErrors.description }}</span>
            <div class="hint">Provide a clear description of what products belong in this category</div>
          </div>
        </div>

        <!-- Visual Elements Section -->
        <div class="form-section">
          <div class="form-section-title">
            Visual Elements
          </div>
          <div class="form-group">
            <label for="edit-icon">
              <span class="label-text">Category Icon</span>
              <span class="required">*</span>
            </label>
            <div class="icon-input-wrapper">
              <input
                type="text"
                id="edit-icon"
                v-model="editCategory.icon"
                placeholder="Enter category icon (e.g., 🍎, 🥦, 🌾)"
                :class="{ 'error': editErrors.icon }"
              />
              <div class="icon-preview">{{ editCategory.icon || '🍎' }}</div>
            </div>
            <span v-if="editErrors.icon" class="error-message">{{ editErrors.icon }}</span>
            <div class="hint">Choose an emoji or symbol that represents this category</div>
          </div>
        </div>

        <!-- Settings Section -->
        <div class="form-section">
          <div class="form-section-title">
            Settings
          </div>
          <div class="form-group">
            <label for="edit-status">
              <span class="label-text">Status</span>
            </label>
            <div class="select-wrapper">
              <select id="edit-status" v-model="editCategory.status">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div class="select-icon">📊</div>
            </div>
            <div class="hint">Active categories are visible to customers, inactive ones are hidden</div>
          </div>
        </div>

        <!-- Progress Indicator -->
        <div v-if="isSubmitting" class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="progress-text">{{ progressText }}</div>
        </div>

        <!-- Category Preview -->
        <div class="category-preview">
          <h4>Category Preview</h4>
          <div class="preview-card">
            <div class="preview-header">
              <span class="preview-icon">{{ editCategory.icon || '🍎' }}</span>
              <div class="preview-info">
                <div class="preview-name">{{ editCategory.name || 'Category Name' }}</div>
                <div class="preview-slug">{{ editCategory.slug || 'category-slug' }}</div>
              </div>
            </div>
            <div class="preview-description">{{ editCategory.description || 'Category description will appear here...' }}</div>
            <div class="preview-status">
              <span :class="['status-badge', editCategory.status.toLowerCase()]">
                {{ editCategory.status || 'Status' }}
              </span>
            </div>
          </div>
        </div>
      </AdminModal>

      <!-- Delete Category Modal -->
      <AdminModal
        :isOpen="showDeleteModal"
        title="Delete Category"
        submitText="Delete Category"
        :isLoading="isSubmitting"
        @close="closeDeleteModal"
        @submit="deleteCategory"
      >
        <div class="delete-warning">
          <p>Are you sure you want to delete this category?</p>
          <p class="delete-name">{{ deleteCategoryData.name }}</p>
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
  name: 'Categories',
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
      progressText: 'Updating category...',

      // Modal states
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      
      // Category data
      categories: [
        { id: 1, name: 'Grains', slug: 'grains', description: 'Rice, wheat, and other staple grains', productCount: 15, status: 'Active', icon: '🌾' },
        { id: 2, name: 'Vegetables', slug: 'vegetables', description: 'Fresh and organic vegetables', productCount: 25, status: 'Active', icon: '🥦' },
        { id: 3, name: 'Fruits', slug: 'fruits', description: 'Fresh fruits and dried fruits', productCount: 18, status: 'Active', icon: '🍎' },
        { id: 4, name: 'Organic', slug: 'organic', description: 'Certified organic products', productCount: 12, status: 'Active', icon: '🌿' },
        { id: 5, name: 'Dairy', slug: 'dairy', description: 'Milk, cheese, and dairy products', productCount: 8, status: 'Active', icon: '🥛' },
        { id: 6, name: 'Meat & Poultry', slug: 'meat-poultry', description: 'Fresh meat and poultry products', productCount: 10, status: 'Active', icon: '🥩' }
      ],
      
      // Form data
      newCategory: {
        name: '',
        slug: '',
        description: '',
        icon: '',
        status: 'Active'
      },
      editCategory: {
        id: null,
        name: '',
        slug: '',
        description: '',
        icon: '',
        status: ''
      },
      deleteCategoryData: {
        id: null,
        name: ''
      },
      
      // Form errors
      addErrors: {},
      editErrors: {}
    }
  },
  computed: {
    filteredCategories() {
      if (!this.searchQuery.trim()) {
        return this.categories
      }
      const query = this.searchQuery.toLowerCase()
      return this.categories.filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.status.toLowerCase().includes(query)
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
    
    openEditModal(category) {
      this.editCategory = { ...category }
      this.showEditModal = true
    },
    
    closeEditModal() {
      this.showEditModal = false
      this.resetEditForm()
    },
    
    openDeleteModal(category) {
      this.deleteCategoryData = { id: category.id, name: category.name }
      this.showDeleteModal = true
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteCategoryData = { id: null, name: '' }
    },
    
    // Form reset methods
    resetAddForm() {
      this.newCategory = {
        name: '',
        slug: '',
        description: '',
        icon: '',
        status: 'Active'
      }
      this.addErrors = {}
    },
    
    resetEditForm() {
      this.editCategory = {
        id: null,
        name: '',
        slug: '',
        description: '',
        icon: '',
        status: ''
      }
      this.editErrors = {}
    },
    
    // Validation methods
    validateAddForm() {
      this.addErrors = {}
      let isValid = true
      
      if (!this.newCategory.name.trim()) {
        this.addErrors.name = 'Category name is required'
        isValid = false
      }
      
      if (!this.newCategory.slug.trim()) {
        this.addErrors.slug = 'Category slug is required'
        isValid = false
      } else if (!/^[a-z0-9-]+$/.test(this.newCategory.slug)) {
        this.addErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
        isValid = false
      }
      
      if (!this.newCategory.description.trim()) {
        this.addErrors.description = 'Description is required'
        isValid = false
      }
      
      if (!this.newCategory.icon.trim()) {
        this.addErrors.icon = 'Category icon is required'
        isValid = false
      } else if (this.newCategory.icon.length > 5) {
        this.addErrors.icon = 'Icon should be a single emoji or short symbol'
        isValid = false
      }
      
      return isValid
    },
    
    validateEditForm() {
      this.editErrors = {}
      let isValid = true
      
      if (!this.editCategory.name.trim()) {
        this.editErrors.name = 'Category name is required'
        isValid = false
      }
      
      if (!this.editCategory.slug.trim()) {
        this.editErrors.slug = 'Category slug is required'
        isValid = false
      } else if (!/^[a-z0-9-]+$/.test(this.editCategory.slug)) {
        this.editErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
        isValid = false
      }
      
      if (!this.editCategory.description.trim()) {
        this.editErrors.description = 'Description is required'
        isValid = false
      }
      
      if (!this.editCategory.icon.trim()) {
        this.editErrors.icon = 'Category icon is required'
        isValid = false
      } else if (this.editCategory.icon.length > 5) {
        this.editErrors.icon = 'Icon should be a single emoji or short symbol'
        isValid = false
      }
      
      return isValid
    },
    
    // CRUD operations
    async addCategory() {
      if (!this.validateAddForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Generate new category ID
        const newId = Math.max(...this.categories.map(c => c.id)) + 1
        
        // Add new category to the list
        this.categories.push({
          id: newId,
          name: this.newCategory.name.trim(),
          slug: this.newCategory.slug.trim().toLowerCase().replace(/\s+/g, '-'),
          description: this.newCategory.description.trim(),
          icon: this.newCategory.icon.trim(),
          productCount: 0,
          status: this.newCategory.status
        })
        
        // Close modal and reset form
        this.closeAddModal()
        
        // Show success message
        this.showMessage('Category created successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('New category added:', this.newCategory)
      } catch (error) {
        this.showMessage('Error creating category. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async updateCategory() {
      if (!this.validateEditForm()) {
        return
      }

      this.isSubmitting = true
      this.progressPercent = 0
      this.progressText = 'Validating category information...'

      try {
        // Simulate progress steps
        await this.simulateProgress(20, 'Checking for duplicate slugs...')
        await this.simulateProgress(40, 'Updating category details...')
        await this.simulateProgress(60, 'Refreshing category cache...')
        await this.simulateProgress(80, 'Updating product associations...')
        await this.simulateProgress(100, 'Category updated successfully!')

        // Find and update the category
        const index = this.categories.findIndex(category => category.id === this.editCategory.id)
        if (index !== -1) {
          this.categories[index] = { ...this.editCategory }

          // Close modal
          this.closeEditModal()

          // Show success message
          this.showMessage('Category updated successfully!', 'success')

          // In a real application, you would make an API call here
          console.log('Category updated:', this.editCategory)
        }
      } catch (error) {
        this.showMessage('Error updating category. Please try again.', 'error')
      } finally {
        this.isSubmitting = false
        this.progressPercent = 0
        this.progressText = 'Updating category...'
      }
    },
    
    async deleteCategory() {
      this.isSubmitting = true
      
      try {
        // Remove category from the list
        this.categories = this.categories.filter(category => category.id !== this.deleteCategoryData.id)
        
        // Close modal
        this.closeDeleteModal()
        
        // Show success message
        this.showMessage('Category deleted successfully!', 'success')
        
        // In a real application, you would make an API call here
        console.log('Category deleted:', this.deleteCategoryData)
      } catch (error) {
        this.showMessage('Error deleting category. Please try again.', 'error')
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
    },

    // Progress simulation
    simulateProgress(percent, text) {
      return new Promise(resolve => {
        setTimeout(() => {
          this.progressPercent = percent
          this.progressText = text
          resolve()
        }, 500) // 500ms delay for each step
      })
    }
  }
}
</script>

<style scoped>
.categories-page {
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

.categories-table {
  width: 100%;
  border-collapse: collapse;
}

.categories-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.categories-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.categories-table tr:hover {
  background: #f8faf7;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8faf7;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.category-name {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.category-slug {
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

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
}

.btn-edit {
  background: #eafaf1;
  color: #27ae60;
}

.btn-edit:hover {
  background: #d4edda;
}

.btn-delete {
  background: #fff3cd;
  color: #856404;
}

.btn-delete:hover {
  background: #ffeaa7;
}

/* Modal Form Enhancements */
.modal-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #27ae60;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1), 0 4px 8px rgba(0,0,0,0.08);
  transform: translateY(-1px);
}

.form-group input.error,
.form-group textarea.error,
.form-group select.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  flex: 1;
  padding-right: 3rem;
}

.input-icon {
  position: absolute;
  right: 1rem;
  font-size: 1.2rem;
  color: #7f8c8d;
  pointer-events: none;
  transition: color 0.3s ease;
}

.input-wrapper input:focus + .input-icon {
  color: #27ae60;
}

.textarea-wrapper {
  position: relative;
}

.textarea-wrapper textarea {
  padding-right: 3rem;
}

.textarea-icon {
  position: absolute;
  top: 0.875rem;
  right: 1rem;
  font-size: 1.2rem;
  color: #7f8c8d;
  pointer-events: none;
  transition: color 0.3s ease;
}

.textarea-wrapper textarea:focus + .textarea-icon {
  color: #27ae60;
}

.icon-input-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-input-wrapper input {
  flex: 1;
}

.icon-preview {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8faf7, #f0f7ee);
  border: 2px solid #e8f1e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
}

.icon-input-wrapper input:focus + .icon-preview {
  border-color: #27ae60;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1), 0 4px 12px rgba(0,0,0,0.1);
  transform: scale(1.05);
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  padding-right: 2.5rem;
  appearance: none;
  background: white;
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #7f8c8d;
  pointer-events: none;
  transition: color 0.3s ease;
}

.select-wrapper select:focus + .select-icon {
  color: #27ae60;
}

/* Form Sections */
.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8faf7, #f0f7ee);
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.form-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
}

.form-section-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  border-radius: 2px;
}

/* Labels and Required Indicators */
.label-text {
  font-weight: 600;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
  margin-left: 0.25rem;
  font-weight: 700;
}

/* Hints */
.hint {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
  font-style: italic;
  line-height: 1.4;
}

/* Error Messages */
.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideInError 0.3s ease-out;
}

.error-message::before {
  content: '⚠️';
  font-size: 1rem;
}

@keyframes slideInError {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Delete Modal Styling */
.delete-warning {
  text-align: center;
  padding: 1rem 0;
}

.delete-warning p {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
  line-height: 1.6;
}

.delete-name {
  font-weight: 700;
  color: #e74c3c;
  font-size: 1.2rem;
  margin-bottom: 1rem !important;
  padding: 0.5rem 1rem;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  display: inline-block;
}

.delete-warning-text {
  color: #7f8c8d;
  font-style: italic;
  font-weight: 600;
}

/* Category Preview */
.category-preview {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e8f1e1;
}

.category-preview h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-card {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.preview-card:hover {
  background: #f0f7ee;
  border-color: #d4edda;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.preview-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.preview-info {
  flex: 1;
}

.preview-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.preview-slug {
  font-size: 0.875rem;
  color: #7f8c8d;
  font-family: 'Courier New', monospace;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #e8f1e1;
  display: inline-block;
}

.preview-description {
  color: #5a6c5a;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.preview-status {
  display: flex;
  justify-content: flex-end;
}

/* Progress Indicator */
.progress-indicator {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e8f1e1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
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

/* Responsive Design */
@media (max-width: 768px) {
  .categories-page {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box input {
    width: 100%;
  }

  .categories-table {
    font-size: 0.9rem;
  }

  .categories-table th, .categories-table td {
    padding: 0.75rem;
  }

  .category-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .modal-form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-section {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .form-section-title {
    font-size: 1rem;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 0.75rem;
    font-size: 0.95rem;
  }

  .icon-preview {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .preview-icon {
    align-self: center;
  }

  .progress-indicator {
    padding: 0.75rem;
  }

  .progress-text {
    font-size: 0.8rem;
  }

  .delete-warning p {
    font-size: 1rem;
  }

  .delete-name {
    font-size: 1.1rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .categories-page {
    padding: 0.5rem;
  }

  .page-content {
    padding: 1rem;
  }

  .page-header {
    margin-bottom: 1rem;
  }

  .page-header h1 {
    font-size: 1.25rem;
  }

  .btn-primary {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }

  .categories-table th, .categories-table td {
    padding: 0.5rem;
  }

  .btn-edit, .btn-delete {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
    margin-right: 0.25rem;
  }

  .form-section {
    padding: 0.75rem;
  }

  .modal-form-grid {
    gap: 0.75rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .preview-card {
    padding: 1rem;
  }

  .preview-name {
    font-size: 1.1rem;
  }
}
</style>