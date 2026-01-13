<template>
    <div class="admin-accounts-page">
      <div class="page-header">
        <h1>Admin Accounts</h1>
        <p>Manage administrator accounts and permissions</p>
      </div>
      
      <div class="page-content">
        <!-- Enhanced Controls -->
        <div class="controls">
          <div class="left-controls">
            <button class="btn-primary" @click="openAddModal">Add New Admin</button>
            <button
              v-if="hasSelectedAdmins"
              class="btn-bulk"
              @click="openBulkActions"
            >
              Bulk Actions ({{ selectedAdmins.length }})
            </button>
          </div>
          
          <div class="search-controls">
            <div class="search-box">
              <input
                type="text"
                placeholder="Search admins by name, email, role..."
                v-model="searchQuery"
                @input="applyFilters"
              />
              <span class="search-icon">🔍</span>
            </div>
            
            <button class="btn-filter" @click="showAdvancedFilters = !showAdvancedFilters">
              {{ showAdvancedFilters ? 'Hide' : 'Show' }} Filters
            </button>
          </div>
        </div>

        <!-- Advanced Filters -->
        <div v-if="showAdvancedFilters" class="advanced-filters">
          <div class="filter-group">
            <label>Role</label>
            <select v-model="advancedFilters.role" @change="applyFilters">
              <option value="">All Roles</option>
              <option v-for="role in roleOptions" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Status</label>
            <select v-model="advancedFilters.status" @change="applyFilters">
              <option value="">All Status</option>
              <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Department</label>
            <select v-model="advancedFilters.department" @change="applyFilters">
              <option value="">All Departments</option>
              <option v-for="dept in departmentOptions" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Date Range</label>
            <select v-model="advancedFilters.dateRange" @change="applyFilters">
              <option value="">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
          
          <button class="btn-clear" @click="clearFilters">Clear Filters</button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <span>Loading admin accounts...</span>
        </div>

        <!-- Admin Table -->
        <div v-else class="table-container">
          <div class="table-header">
            <div class="table-stats">
              <span class="stat-item">
                Total: {{ totalItems }}
              </span>
              <span class="stat-item">
                Active: {{ admins.filter(a => a.status === 'Active').length }}
              </span>
              <span class="stat-item">
                Selected: {{ selectedAdmins.length }}
              </span>
            </div>
            
            <div class="table-actions">
              <button class="btn-export" @click="exportAdmins">Export</button>
              <button class="btn-refresh" @click="fetchAdmins">Refresh</button>
            </div>
          </div>

          <table class="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    @change="selectAllAdmins"
                    :checked="selectedAdmins.length === paginatedAdmins.length && paginatedAdmins.length > 0"
                    :indeterminate="selectedAdmins.length > 0 && selectedAdmins.length < paginatedAdmins.length"
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Phone</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="admin in paginatedAdmins" :key="admin.id" :class="{ 'selected': selectedAdmins.includes(admin.id) }">
                <td>
                  <input
                    type="checkbox"
                    :value="admin.id"
                    @change="selectAdmin(admin.id)"
                    :checked="selectedAdmins.includes(admin.id)"
                  />
                </td>
                <td>
                  <div class="admin-info">
                    <div class="admin-name">{{ admin.name }}</div>
                    <div class="admin-id">ID: {{ admin.id }}</div>
                  </div>
                </td>
                <td>
                  <div class="email-info">
                    <span class="email">{{ admin.email }}</span>
                    <span v-if="admin.last_login" class="last-login-hint">
                      Last: {{ formatDate(admin.last_login) }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="role-pill" :style="{ borderColor: getRoleColor(admin.role) }">
                    {{ admin.role }}
                  </span>
                </td>
                <td>
                  <span class="dept-pill">{{ admin.department || 'N/A' }}</span>
                </td>
                <td>
                  <span :class="['status-badge', admin.status.toLowerCase()]">
                    {{ admin.status }}
                  </span>
                </td>
                <td>
                  <span class="phone">{{ admin.phone || 'N/A' }}</span>
                </td>
                <td>
                  <span class="login-time">{{ formatDate(admin.last_login) }}</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-edit" @click="openEditModal(admin)">Edit</button>
                    <button class="btn-permissions" @click="openPermissionsModal(admin)">Permissions</button>
                    <button class="btn-delete" @click="openDeleteModal(admin)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination-controls">
            <div class="pagination-info">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} admins
            </div>
            
            <div class="pagination-buttons">
              <button
                class="btn-page"
                @click="goToPage(1)"
                :disabled="currentPage === 1"
              >
                First
              </button>
              <button
                class="btn-page"
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
              >
                Previous
              </button>
              
              <span class="page-display">{{ currentPage }} of {{ totalPages }}</span>
              
              <button
                class="btn-page"
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
              >
                Next
              </button>
              <button
                class="btn-page"
                @click="goToPage(totalPages)"
                :disabled="currentPage === totalPages"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Admin Modal -->
      <AdminModal
        :isOpen="showAddModal"
        title="Add New Admin"
        submitText="Create Admin"
        :isLoading="isSubmitting"
        @close="closeAddModal"
        @submit="addAdmin"
      >
        <!-- Personal Information Section -->
        <div class="form-section">
          <div class="form-section-title">
            Personal Information
          </div>
          <div class="form-group">
            <label for="add-name">
              <span class="label-text">Full Name</span>
              <span class="required">*</span>
            </label>
            <input
              type="text"
              id="add-name"
              v-model="newAdmin.name"
              placeholder="Enter admin full name"
              :class="{ 'error': addErrors.name }"
              @input="clearError('name')"
            />
            <span v-if="addErrors.name" class="error-message">{{ addErrors.name }}</span>
          </div>
        </div>

        <!-- Account Information Section -->
        <div class="form-section">
          <div class="form-section-title">
            Account Information
          </div>
          <div class="form-group">
            <label for="add-email">
              <span class="label-text">Email Address</span>
              <span class="required">*</span>
            </label>
            <input
              type="email"
              id="add-email"
              v-model="newAdmin.email"
              placeholder="Enter admin email"
              :class="{ 'error': addErrors.email }"
              @input="clearError('email')"
            />
            <span v-if="addErrors.email" class="error-message">{{ addErrors.email }}</span>
            <div class="hint">This will be used for login and notifications</div>
          </div>

          <div class="form-group">
            <label for="add-role">
              <span class="label-text">Role</span>
              <span class="required">*</span>
            </label>
            <select id="add-role" v-model="newAdmin.role" :class="{ 'error': addErrors.role }" @change="clearError('role')">
              <option value="">Select Role</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Content Admin">Content Admin</option>
              <option value="Support Admin">Support Admin</option>
              <option value="Finance Admin">Finance Admin</option>
            </select>
            <span v-if="addErrors.role" class="error-message">{{ addErrors.role }}</span>
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
            <select id="add-status" v-model="newAdmin.status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div class="hint">New admins typically start as active</div>
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

      <!-- Edit Admin Modal -->
      <AdminModal
        :isOpen="showEditModal"
        title="Edit Admin"
        submitText="Update Admin"
        :isLoading="isSubmitting"
        @close="closeEditModal"
        @submit="updateAdmin"
      >
        <!-- Basic Information Section -->
        <div class="form-section">
          <div class="form-section-title">
            Basic Information
          </div>
          <div class="modal-form-grid">
            <div class="form-group">
              <label for="edit-name">
                <span class="label-text">Full Name</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="edit-name"
                  v-model="editAdmin.name"
                  placeholder="Enter admin full name"
                  :class="{ 'error': editErrors.name }"
                />
                <div class="input-icon">👤</div>
              </div>
              <span v-if="editErrors.name" class="error-message">{{ editErrors.name }}</span>
            </div>

            <div class="form-group">
              <label for="edit-email">
                <span class="label-text">Email Address</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  type="email"
                  id="edit-email"
                  v-model="editAdmin.email"
                  placeholder="Enter admin email"
                  :class="{ 'error': editErrors.email }"
                />
                <div class="input-icon">📧</div>
              </div>
              <span v-if="editErrors.email" class="error-message">{{ editErrors.email }}</span>
              <div class="hint">This will be used for login and notifications</div>
            </div>
          </div>
        </div>

        <!-- Account Settings Section -->
        <div class="form-section">
          <div class="form-section-title">
            Account Settings
          </div>
          <div class="form-group">
            <label for="edit-role">
              <span class="label-text">Role</span>
              <span class="required">*</span>
            </label>
            <div class="select-wrapper">
              <select id="edit-role" v-model="editAdmin.role" :class="{ 'error': editErrors.role }">
                <option value="">Select Role</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Content Admin">Content Admin</option>
                <option value="Support Admin">Support Admin</option>
                <option value="Finance Admin">Finance Admin</option>
              </select>
              <div class="select-icon">👑</div>
            </div>
            <span v-if="editErrors.role" class="error-message">{{ editErrors.role }}</span>
            <div class="hint">Super Admin has full system access, other roles have limited permissions</div>
          </div>

          <div class="form-group">
            <label for="edit-status">
              <span class="label-text">Status</span>
            </label>
            <div class="select-wrapper">
              <select id="edit-status" v-model="editAdmin.status">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div class="select-icon">📊</div>
            </div>
            <div class="hint">Active admins can log in, inactive ones are blocked</div>
          </div>
        </div>

        <!-- Progress Indicator -->
        <div v-if="isSubmitting" class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="progress-text">{{ progressText }}</div>
        </div>

        <!-- Admin Preview -->
        <div class="admin-preview">
          <h4>Admin Preview</h4>
          <div class="preview-card">
            <div class="preview-header">
              <span class="preview-icon">👤</span>
              <div class="preview-info">
                <div class="preview-name">{{ editAdmin.name || 'Admin Name' }}</div>
                <div class="preview-email">{{ editAdmin.email || 'admin@example.com' }}</div>
              </div>
            </div>
            <div class="preview-details">
              <div class="preview-role">
                <span class="role-badge" :class="editAdmin.role ? editAdmin.role.toLowerCase().replace(' ', '-') : 'default'">
                  {{ editAdmin.role || 'Role' }}
                </span>
              </div>
              <div class="preview-status">
                <span :class="['status-badge', editAdmin.status.toLowerCase()]">
                  {{ editAdmin.status || 'Status' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AdminModal>

      <!-- Delete Admin Modal -->
      <AdminModal
        :isOpen="showDeleteModal"
        title="Delete Admin"
        submitText="Delete Admin"
        :isLoading="isSubmitting"
        @close="closeDeleteModal"
        @submit="deleteAdmin"
      >
        <div class="delete-warning">
          <p>Are you sure you want to delete this admin account?</p>
          <p class="delete-name">{{ deleteAdminData.name }}</p>
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
  name: 'AdminAccounts',
  components: {
    AdminModal
  },
  data() {
    return {
      searchQuery: '',
      isSubmitting: false,
      isLoading: false,
      message: null,

      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,

      // Progress indicator
      progressPercent: 0,
      progressText: 'Creating admin account...',

      // Modal states
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showBulkActions: false,

      // Admin data
      admins: [],
      allAdmins: [], // For bulk operations

      // Form data
      newAdmin: {
        name: '',
        email: '',
        role: '',
        status: 'Active',
        permissions: [],
        department: '',
        phone: '',
        notes: ''
      },
      editAdmin: {
        id: null,
        name: '',
        email: '',
        role: '',
        status: '',
        permissions: [],
        department: '',
        phone: '',
        notes: ''
      },
      deleteAdminData: {
        id: null,
        name: ''
      },

      // Form errors
      addErrors: {},
      editErrors: {},

      // Bulk operations
      selectedAdmins: [],
      bulkAction: '',
      bulkConfirmation: '',

      // Advanced search
      advancedFilters: {
        role: '',
        status: '',
        dateRange: '',
        department: ''
      },

      // Permissions data
      permissionsList: [
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'orders.view', 'orders.edit', 'orders.manage',
        'reports.view', 'reports.generate', 'settings.manage'
      ]
    }
  },
  computed: {
    filteredAdmins() {
      let filtered = this.admins
      
      // Text search
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(admin =>
          admin.name.toLowerCase().includes(query) ||
          admin.email.toLowerCase().includes(query) ||
          admin.role.toLowerCase().includes(query) ||
          admin.department?.toLowerCase().includes(query)
        )
      }
      
      // Advanced filters
      if (this.advancedFilters.role) {
        filtered = filtered.filter(admin => admin.role === this.advancedFilters.role)
      }
      
      if (this.advancedFilters.status) {
        filtered = filtered.filter(admin => admin.status === this.advancedFilters.status)
      }
      
      if (this.advancedFilters.department) {
        filtered = filtered.filter(admin => admin.department === this.advancedFilters.department)
      }
      
      // Date range filter (mock implementation)
      if (this.advancedFilters.dateRange) {
        const now = new Date()
        const days = this.advancedFilters.dateRange === 'week' ? 7 :
                    this.advancedFilters.dateRange === 'month' ? 30 : 90
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(admin => new Date(admin.created_at || admin.created_at) >= cutoff)
      }
      
      this.totalItems = filtered.length
      return filtered
    },
    
    paginatedAdmins() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredAdmins.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredAdmins.length / this.itemsPerPage)
    },
    
    hasSelectedAdmins() {
      return this.selectedAdmins.length > 0
    },
    
    roleOptions() {
      return ['Super Admin', 'Content Admin', 'Support Admin', 'Finance Admin', 'Marketing Admin']
    },
    
    statusOptions() {
      return ['Active', 'Inactive', 'Pending', 'Suspended']
    },
    
    departmentOptions() {
      return ['Administration', 'Content', 'Support', 'Finance', 'Marketing', 'IT', 'HR']
    }
  },
  methods: {
    // Lifecycle methods
    async mounted() {
      this.isLoading = true
      try {
        await this.fetchAdmins()
      } catch (error) {
        this.showMessage('Failed to load admin accounts', 'error')
      } finally {
        this.isLoading = false
      }
    },

    // API Integration Methods
    async fetchAdmins() {
      // Mock API call - replace with real API endpoint
      const mockResponse = {
        data: [
          {
            id: 1, name: 'John Doe', email: 'john@example.com', role: 'Super Admin',
            status: 'Active', department: 'Administration', phone: '+639123456789',
            permissions: ['users.view', 'users.create', 'products.view', 'orders.manage'],
            created_at: '2025-12-01T10:00:00Z', last_login: '2026-01-08T14:30:00Z'
          },
          {
            id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Content Admin',
            status: 'Active', department: 'Content', phone: '+639123456788',
            permissions: ['products.view', 'products.create', 'products.edit'],
            created_at: '2025-11-15T09:00:00Z', last_login: '2026-01-09T09:15:00Z'
          },
          {
            id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Support Admin',
            status: 'Inactive', department: 'Support', phone: '+639123456787',
            permissions: ['orders.view', 'orders.edit'],
            created_at: '2025-10-20T11:00:00Z', last_login: '2025-12-15T16:45:00Z'
          }
        ],
        total: 3
      }
      
      this.admins = mockResponse.data
      this.allAdmins = [...this.admins]
      this.totalItems = mockResponse.total
    },

    async createAdmin(adminData) {
      // Mock API call - replace with real API endpoint
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        },
        body: JSON.stringify(adminData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create admin')
      }
      
      return await response.json()
    },

    async updateAdminAPI(id, adminData) {
      // Mock API call - replace with real API endpoint
      const response = await fetch(`/api/admins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        },
        body: JSON.stringify(adminData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update admin')
      }
      
      return await response.json()
    },

    async deleteAdminAPI(id) {
      // Mock API call - replace with real API endpoint
      const response = await fetch(`/api/admins/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete admin')
      }
    },

    async bulkDeleteAdmins(ids) {
      // Mock API call - replace with real API endpoint
      const response = await fetch('/api/admins/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        },
        body: JSON.stringify({ ids })
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete admins')
      }
    },

    // Modal control methods
    openAddModal() {
      this.showAddModal = true
    },
    
    closeAddModal() {
      this.showAddModal = false
      this.resetAddForm()
    },
    
    openEditModal(admin) {
      this.editAdmin = { ...admin }
      this.showEditModal = true
    },
    
    closeEditModal() {
      this.showEditModal = false
      this.resetEditForm()
    },
    
    openDeleteModal(admin) {
      this.deleteAdminData = { id: admin.id, name: admin.name }
      this.showDeleteModal = true
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteAdminData = { id: null, name: '' }
    },

    openBulkActions() {
      this.showBulkActions = true
    },

    closeBulkActions() {
      this.showBulkActions = false
      this.selectedAdmins = []
      this.bulkAction = ''
      this.bulkConfirmation = ''
    },
    
    // Form reset methods
    resetAddForm() {
      this.newAdmin = {
        name: '',
        email: '',
        role: '',
        status: 'Active',
        permissions: [],
        department: '',
        phone: '',
        notes: ''
      }
      this.addErrors = {}
    },
    
    resetEditForm() {
      this.editAdmin = {
        id: null,
        name: '',
        email: '',
        role: '',
        status: '',
        permissions: [],
        department: '',
        phone: '',
        notes: ''
      }
      this.editErrors = {}
    },
    
    // Validation methods
    validateAddForm() {
      this.addErrors = {}
      let isValid = true
      
      if (!this.newAdmin.name.trim()) {
        this.addErrors.name = 'Name is required'
        isValid = false
      } else if (this.newAdmin.name.trim().length < 2) {
        this.addErrors.name = 'Name must be at least 2 characters long'
        isValid = false
      }
      
      if (!this.newAdmin.email.trim()) {
        this.addErrors.email = 'Email is required'
        isValid = false
      } else if (!this.isValidEmail(this.newAdmin.email)) {
        this.addErrors.email = 'Please enter a valid email address'
        isValid = false
      } else if (this.admins.some(admin => admin.email === this.newAdmin.email)) {
        this.addErrors.email = 'An admin with this email already exists'
        isValid = false
      }
      
      if (!this.newAdmin.role) {
        this.addErrors.role = 'Please select a role'
        isValid = false
      }

      if (this.newAdmin.phone && !this.isValidPhone(this.newAdmin.phone)) {
        this.addErrors.phone = 'Please enter a valid phone number'
        isValid = false
      }
      
      return isValid
    },
    
    validateEditForm() {
      this.editErrors = {}
      let isValid = true
      
      if (!this.editAdmin.name.trim()) {
        this.editErrors.name = 'Name is required'
        isValid = false
      } else if (this.editAdmin.name.trim().length < 2) {
        this.editErrors.name = 'Name must be at least 2 characters long'
        isValid = false
      }
      
      if (!this.editAdmin.email.trim()) {
        this.editErrors.email = 'Email is required'
        isValid = false
      } else if (!this.isValidEmail(this.editAdmin.email)) {
        this.editErrors.email = 'Please enter a valid email address'
        isValid = false
      } else if (this.admins.some(admin =>
        admin.id !== this.editAdmin.id && admin.email === this.editAdmin.email
      )) {
        this.editErrors.email = 'An admin with this email already exists'
        isValid = false
      }
      
      if (!this.editAdmin.role) {
        this.editErrors.role = 'Please select a role'
        isValid = false
      }

      if (this.editAdmin.phone && !this.isValidPhone(this.editAdmin.phone)) {
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
      // Philippine phone number format
      const phoneRegex = /^(\+63|0)\d{10}$/
      return phoneRegex.test(phone.replace(/\s/g, ''))
    },
    
    // CRUD operations
    async addAdmin() {
      if (!this.validateAddForm()) {
        return
      }

      this.isSubmitting = true
      this.progressPercent = 0
      this.progressText = 'Validating admin information...'

      try {
        // Simulate progress steps
        await this.simulateProgress(20, 'Checking for duplicate accounts...')
        await this.simulateProgress(40, 'Creating admin profile...')
        await this.simulateProgress(60, 'Setting up permissions...')
        await this.simulateProgress(80, 'Sending welcome notification...')

        // Create admin via API
        const newAdminData = {
          ...this.newAdmin,
          permissions: this.newAdmin.permissions || [],
          created_at: new Date().toISOString()
        }

        const createdAdmin = await this.createAdmin(newAdminData)

        // Add to local state
        this.admins.push(createdAdmin)
        this.allAdmins.push(createdAdmin)

        await this.simulateProgress(100, 'Account created successfully!')

        // Close modal and reset form
        this.closeAddModal()

        // Show success message
        this.showMessage('Admin account created successfully!', 'success')

        console.log('New admin added:', createdAdmin)
      } catch (error) {
        this.showMessage('Error creating admin account. Please try again.', 'error')
        console.error('Add admin error:', error)
      } finally {
        this.isSubmitting = false
        this.progressPercent = 0
      }
    },
    
    async updateAdmin() {
      if (!this.validateEditForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // Update admin via API
        const updatedAdmin = await this.updateAdminAPI(this.editAdmin.id, this.editAdmin)
        
        // Update local state
        const index = this.admins.findIndex(admin => admin.id === this.editAdmin.id)
        if (index !== -1) {
          this.admins[index] = updatedAdmin
          this.allAdmins = [...this.admins]
        }
        
        // Close modal
        this.closeEditModal()
        
        // Show success message
        this.showMessage('Admin account updated successfully!', 'success')
        
        console.log('Admin updated:', updatedAdmin)
      } catch (error) {
        this.showMessage('Error updating admin account. Please try again.', 'error')
        console.error('Update admin error:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    
    async deleteAdmin() {
      this.isSubmitting = true
      
      try {
        // Delete admin via API
        await this.deleteAdminAPI(this.deleteAdminData.id)
        
        // Remove from local state
        this.admins = this.admins.filter(admin => admin.id !== this.deleteAdminData.id)
        this.allAdmins = [...this.admins]
        
        // Close modal
        this.closeDeleteModal()
        
        // Show success message
        this.showMessage('Admin account deleted successfully!', 'success')
        
        console.log('Admin deleted:', this.deleteAdminData)
      } catch (error) {
        this.showMessage('Error deleting admin account. Please try again.', 'error')
        console.error('Delete admin error:', error)
      } finally {
        this.isSubmitting = false
      }
    },

    // Bulk operations
    selectAdmin(adminId) {
      const index = this.selectedAdmins.indexOf(adminId)
      if (index === -1) {
        this.selectedAdmins.push(adminId)
      } else {
        this.selectedAdmins.splice(index, 1)
      }
    },

    selectAllAdmins() {
      if (this.selectedAdmins.length === this.paginatedAdmins.length) {
        this.selectedAdmins = []
      } else {
        this.selectedAdmins = this.paginatedAdmins.map(admin => admin.id)
      }
    },

    async executeBulkAction() {
      if (!this.bulkAction || this.selectedAdmins.length === 0) {
        this.showMessage('Please select an action and at least one admin', 'error')
        return
      }

      this.isSubmitting = true
      
      try {
        if (this.bulkAction === 'delete') {
          await this.bulkDeleteAdmins(this.selectedAdmins)
          this.admins = this.admins.filter(admin => !this.selectedAdmins.includes(admin.id))
          this.allAdmins = [...this.admins]
          this.showMessage(`Successfully deleted ${this.selectedAdmins.length} admin(s)`, 'success')
        } else if (this.bulkAction === 'activate') {
          await this.bulkUpdateStatus(this.selectedAdmins, 'Active')
          this.showMessage(`Successfully activated ${this.selectedAdmins.length} admin(s)`, 'success')
        } else if (this.bulkAction === 'deactivate') {
          await this.bulkUpdateStatus(this.selectedAdmins, 'Inactive')
          this.showMessage(`Successfully deactivated ${this.selectedAdmins.length} admin(s)`, 'success')
        }
        
        this.closeBulkActions()
        this.selectedAdmins = []
      } catch (error) {
        this.showMessage('Error executing bulk action. Please try again.', 'error')
        console.error('Bulk action error:', error)
      } finally {
        this.isSubmitting = false
      }
    },

    async bulkUpdateStatus(adminIds, status) {
      // Mock API call - replace with real API endpoint
      const response = await fetch('/api/admins/bulk-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
        },
        body: JSON.stringify({ ids: adminIds, status })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update admin status')
      }
    },
    
    // Error clearing method
    clearError(field) {
      if (this.addErrors[field]) {
        this.addErrors[field] = ''
      }
      if (this.editErrors[field]) {
        this.editErrors[field] = ''
      }
    },

    // Pagination methods
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },

    // Filter methods
    applyFilters() {
      this.currentPage = 1
    },

    clearFilters() {
      this.advancedFilters = {
        role: '',
        status: '',
        dateRange: '',
        department: ''
      }
      this.searchQuery = ''
      this.currentPage = 1
    },

    // Utility methods
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    getRoleColor(role) {
      const colors = {
        'Super Admin': '#e74c3c',
        'Content Admin': '#3498db',
        'Support Admin': '#f39c12',
        'Finance Admin': '#9b59b6',
        'Marketing Admin': '#2ecc71'
      }
      return colors[role] || '#95a5a6'
    },

    async simulateProgress(targetPercent, text) {
      const current = this.progressPercent
      const steps = 10
      const stepSize = (targetPercent - current) / steps
      const delay = 100
      
      for (let i = 1; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, delay))
        this.progressPercent = Math.floor(current + (stepSize * i))
        this.progressText = text
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
.admin-accounts-page {
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

.left-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-bulk {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
}

.btn-bulk:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(243, 156, 18, 0.4);
}

.search-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #5a6c5a;
  pointer-events: none;
}

.btn-filter {
  background: #e8f1e1;
  color: #27ae60;
  border: 2px solid #27ae60;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-filter:hover {
  background: #27ae60;
  color: white;
}

.advanced-filters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background: #f8faf7;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 700;
  color: #2c3e50;
  font-size: 0.9rem;
}

.filter-group select {
  padding: 0.75rem;
  border: 2px solid #e8f1e1;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.filter-group select:focus {
  border-color: #27ae60;
}

.btn-clear {
  align-self: center;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-clear:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #5a6c5a;
  font-weight: 700;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #e8f1e1;
  border-top: 3px solid #27ae60;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e8f1e1;
}

.table-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  font-weight: 700;
  color: #2c3e50;
  background: #f8faf7;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #e8f1e1;
}

.table-actions {
  display: flex;
  gap: 1rem;
}

.btn-export, .btn-refresh {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-export:hover, .btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.admin-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.admin-name {
  font-weight: 700;
  color: #2c3e50;
}

.admin-id {
  font-size: 0.8rem;
  color: #5a6c5a;
  background: #f8faf7;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  border: 1px solid #e8f1e1;
}

.email-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.email {
  font-weight: 600;
  color: #2c3e50;
}

.last-login-hint {
  font-size: 0.8rem;
  color: #5a6c5a;
  background: #fff3cd;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  border: 1px solid #ffeaa7;
}

.role-pill {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  background: #f8faf7;
  border: 2px solid;
}

.dept-pill {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #eafaf1;
  color: #27ae60;
  border: 1px solid #d4edda;
}

.phone {
  font-family: monospace;
  color: #5a6c5a;
}

.login-time {
  font-size: 0.9rem;
  color: #5a6c5a;
  font-family: monospace;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-permissions {
  background: #9b59b6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-permissions:hover {
  background: #8e44ad;
  transform: translateY(-1px);
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #e8f1e1;
}

.pagination-info {
  color: #5a6c5a;
  font-weight: 600;
}

.pagination-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-page {
  background: white;
  border: 2px solid #e8f1e1;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-page:hover:not(:disabled) {
  background: #27ae60;
  color: white;
  border-color: #27ae60;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-display {
  font-weight: 700;
  color: #2c3e50;
  background: #f8faf7;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #e8f1e1;
}

.selected {
  background-color: #eafaf1 !important;
  border-left: 4px solid #27ae60;
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

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
}

.admin-table tr:hover {
  background: #f8faf7;
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


/* Status Badge Styles */
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
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
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

/* Form Section Styles */
.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8faf7;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.form-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #27ae60;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.label-text {
  color: #2c3e50;
}

.required {
  color: #e74c3c;
  margin-left: 0.25rem;
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
  font-size: 0.9rem;
  margin-top: 0.25rem;
  display: block;
}

.hint {
  color: #5a6c5a;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

/* Progress Indicator Styles */
.progress-indicator {
  margin-top: 2rem;
  text-align: center;
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
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Input and Select Wrapper Styles */
.input-wrapper, .select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input, .select-wrapper select {
  padding-right: 2.5rem;
}

.input-icon, .select-icon {
  position: absolute;
  right: 0.75rem;
  color: #27ae60;
  font-size: 1rem;
  pointer-events: none;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2327ae60' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

/* Modal Form Grid */
.modal-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Admin Preview Styles */
.admin-preview {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8faf7;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.admin-preview h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
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
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.preview-info {
  flex: 1;
}

.preview-name {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.preview-email {
  font-size: 0.9rem;
  color: #5a6c5a;
}

.preview-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-role .role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.role-badge.super-admin {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.role-badge.content-admin {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.role-badge.support-admin {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
}

.role-badge.finance-admin {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.role-badge.default {
  background: #e8f1e1;
  color: #5a6c5a;
}

/* Scrollable Modal Styles - Using standard AdminModal component */
/* The AdminModal component already handles scrollable content properly */
/* No custom modal-content styles needed here */

/* Responsive Design */
@media (max-width: 768px) {
  .admin-accounts-page {
    padding: 1rem;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box input {
    width: 100%;
  }

  .admin-table {
    font-size: 0.9rem;
  }

  .admin-table th, .admin-table td {
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

  .form-section {
    padding: 1rem;
  }

  .modal-form-grid {
    grid-template-columns: 1fr;
  }

  .preview-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>