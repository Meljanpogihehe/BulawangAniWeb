<template>
    <div class="product-list">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Product List</h1>
        <div class="header-actions">
          <button class="btn-secondary" @click="exportProducts">
            <i class="fas fa-download"></i> Export
          </button>
          <button class="btn-primary" @click="navigateTo('/seller/add-product')">
            <i class="fas fa-plus"></i> Add New Product
          </button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
            class="search-input"
            @input="searchProducts"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <div class="filter-group">
          <select v-model="selectedCategory" class="filter-select" @change="filterProducts">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          
          <select v-model="selectedStatus" class="filter-select" @change="filterProducts">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select v-model="selectedSort" class="filter-select" @change="sortProducts">
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="date">Sort by Date</option>
            <option value="stock">Sort by Stock</option>
          </select>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="stats-summary">
        <div class="stat-item">
          <span class="stat-label">Total Products:</span>
          <span class="stat-value">{{ filteredProducts.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Active:</span>
          <span class="stat-value active">{{ activeProducts }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Low Stock:</span>
          <span class="stat-value warning">{{ lowStockProducts }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Out of Stock:</span>
          <span class="stat-value danger">{{ outOfStockProducts }}</span>
        </div>
      </div>

      <!-- Products Table -->
      <div class="products-table-container">
        <div class="table-header">
          <div class="table-cell checkbox-cell">
            <input
              type="checkbox"
              v-model="selectAll"
              @change="toggleSelectAll"
            >
          </div>
          <div class="table-cell">Product</div>
          <div class="table-cell">Category</div>
          <div class="table-cell">Price</div>
          <div class="table-cell">Stock</div>
          <div class="table-cell">Status</div>
          <div class="table-cell">Actions</div>
        </div>

        <div v-if="filteredProducts.length === 0" class="empty-state">
          <i class="fas fa-box-open"></i>
          <h3>No products found</h3>
          <p>Start by adding your first product to your store.</p>
          <button class="btn-primary" @click="navigateTo('/seller/add-product')">
            Add Your First Product
          </button>
        </div>

        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="table-row"
          :class="{ 'low-stock': product.stock < product.lowStockThreshold, 'out-of-stock': product.stock === 0 }"
        >
          <div class="table-cell checkbox-cell">
            <input
              type="checkbox"
              v-model="selectedProducts"
              :value="product.id"
            >
          </div>
          <div class="table-cell product-cell">
            <div class="product-info">
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="product-details">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-sku">SKU: {{ product.sku }}</div>
                <div class="product-category">{{ getCategoryName(product.category) }}</div>
              </div>
            </div>
          </div>
          <div class="table-cell">{{ getCategoryName(product.category) }}</div>
          <div class="table-cell">
            <div class="price-info">
              <div class="price" :class="{ 'on-sale': product.salePrice }">
                ₱{{ formatCurrency(product.price) }}
              </div>
              <div v-if="product.salePrice" class="sale-price">
                ₱{{ formatCurrency(product.salePrice) }}
              </div>
            </div>
          </div>
          <div class="table-cell">
            <div class="stock-info">
              <div class="stock-quantity">{{ product.stock }}</div>
              <div class="stock-status" :class="getStockStatusClass(product)">
                {{ getStockStatusText(product) }}
              </div>
            </div>
          </div>
          <div class="table-cell">
            <span class="status-badge" :class="product.status">{{ product.status }}</span>
          </div>
          <div class="table-cell">
            <div class="action-buttons">
              <button class="btn-icon" @click="viewProduct(product.id)" title="View">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-icon" @click="editProduct(product.id)" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-icon" @click="duplicateProduct(product.id)" title="Duplicate">
                <i class="fas fa-copy"></i>
              </button>
              <button class="btn-icon" @click="deleteProduct(product.id)" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
              <button class="btn-icon" @click="toggleStatus(product.id)" title="Toggle Status">
                <i class="fas fa-power-off"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div v-if="selectedProducts.length > 0" class="bulk-actions">
        <div class="selected-info">
          {{ selectedProducts.length }} products selected
        </div>
        <div class="bulk-actions-group">
          <select v-model="bulkAction" class="bulk-select">
            <option value="">Bulk Actions</option>
            <option value="activate">Activate</option>
            <option value="deactivate">Deactivate</option>
            <option value="delete">Delete</option>
            <option value="export">Export</option>
          </select>
          <button class="btn-primary" @click="executeBulkAction">Apply</button>
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
        <div class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Next
        </button>
      </div>

      <!-- Quick Stats Cards -->
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value">₱{{ formatCurrency(totalRevenue) }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">{{ totalOrders }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-tags"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Average Rating</div>
            <div class="stat-value">{{ averageRating }} / 5.0</div>
          </div>
        </div>
      </div>

      <!-- Product View Modal -->
      <AdminModal :is-open="showViewModal" title="Product Details" @close="showViewModal = false">
        <template #footer></template>
        <div v-if="selectedProduct" class="product-detail-modal">
          <div class="product-detail-header">
            <img :src="selectedProduct.image" :alt="selectedProduct.name" class="product-detail-image">
            <div class="product-detail-basic">
              <h3 class="product-detail-name">{{ selectedProduct.name }}</h3>
              <p class="product-detail-sku">SKU: {{ selectedProduct.sku }}</p>
              <span class="status-badge" :class="selectedProduct.status">{{ selectedProduct.status }}</span>
            </div>
          </div>

          <div class="product-detail-content">
            <div class="detail-section">
              <h4>Product Information</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Category:</label>
                  <span>{{ getCategoryName(selectedProduct.category) }}</span>
                </div>
                <div class="detail-item">
                  <label>Price:</label>
                  <span>₱{{ formatCurrency(selectedProduct.price) }}</span>
                </div>
                <div class="detail-item" v-if="selectedProduct.salePrice">
                  <label>Sale Price:</label>
                  <span>₱{{ formatCurrency(selectedProduct.salePrice) }}</span>
                </div>
                <div class="detail-item">
                  <label>Stock:</label>
                  <span>{{ selectedProduct.stock }} units</span>
                </div>
                <div class="detail-item">
                  <label>Low Stock Threshold:</label>
                  <span>{{ selectedProduct.lowStockThreshold }} units</span>
                </div>
                <div class="detail-item">
                  <label>Stock Status:</label>
                  <span :class="getStockStatusClass(selectedProduct)">{{ getStockStatusText(selectedProduct) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Performance Metrics</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Rating:</label>
                  <span>{{ selectedProduct.rating }}/5.0</span>
                </div>
                <div class="detail-item">
                  <label>Total Orders:</label>
                  <span>{{ selectedProduct.orders }}</span>
                </div>
                <div class="detail-item">
                  <label>Total Revenue:</label>
                  <span>₱{{ formatCurrency(selectedProduct.revenue) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminModal from '@/Components/AdminModal.vue'

export default {
  name: 'ProductList',
  components: {
    AdminModal
  },
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const selectedStatus = ref('')
    const selectedSort = ref('name')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const selectedProducts = ref([])
    const bulkAction = ref('')
    const showViewModal = ref(false)
    const selectedProduct = ref(null)

    // Mock product data
    const products = ref([
      {
        id: 1,
        name: 'Handwoven Abaca Bag',
        sku: 'BAG-001',
        category: 'bags',
        price: 2200,
        salePrice: 1980,
        stock: 15,
        lowStockThreshold: 5,
        status: 'active',
        image: '/images/products/bag1.jpg',
        rating: 4.8,
        orders: 45,
        revenue: 89100
      },
      {
        id: 2,
        name: 'Traditional Weaving Set',
        sku: 'CFT-002',
        category: 'crafts',
        price: 1900,
        salePrice: 0,
        stock: 8,
        lowStockThreshold: 3,
        status: 'active',
        image: '/images/products/weaving1.jpg',
        rating: 4.9,
        orders: 32,
        revenue: 60800
      },
      {
        id: 3,
        name: 'Bamboo Home Decor',
        sku: 'HME-003',
        category: 'home',
        price: 1800,
        salePrice: 1620,
        stock: 2,
        lowStockThreshold: 5,
        status: 'active',
        image: '/images/products/decor1.jpg',
        rating: 4.7,
        orders: 28,
        revenue: 45360
      },
      {
        id: 4,
        name: 'Handmade Pottery Set',
        sku: 'HME-004',
        category: 'home',
        price: 1500,
        salePrice: 0,
        stock: 0,
        lowStockThreshold: 3,
        status: 'inactive',
        image: '/images/products/pottery1.jpg',
        rating: 4.6,
        orders: 25,
        revenue: 37500
      },
      {
        id: 5,
        name: 'Wooden Spoon Set',
        sku: 'KIT-005',
        category: 'kitchen',
        price: 850,
        salePrice: 765,
        stock: 25,
        lowStockThreshold: 10,
        status: 'active',
        image: '/images/products/spoon1.jpg',
        rating: 4.5,
        orders: 40,
        revenue: 30600
      },
      {
        id: 6,
        name: 'Coconut Shell Bowl',
        sku: 'HME-006',
        category: 'home',
        price: 650,
        salePrice: 0,
        stock: 12,
        lowStockThreshold: 5,
        status: 'pending',
        image: '/images/products/bowl1.jpg',
        rating: 4.4,
        orders: 18,
        revenue: 11700
      }
    ])

    const categories = [
      { id: 'bags', name: 'Bags & Accessories' },
      { id: 'crafts', name: 'Handicrafts' },
      { id: 'home', name: 'Home & Living' },
      { id: 'kitchen', name: 'Kitchen' },
      { id: 'fashion', name: 'Fashion' }
    ]

    const filteredProducts = computed(() => {
      let filtered = products.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        )
      }

      // Category filter
      if (selectedCategory.value) {
        filtered = filtered.filter(product => product.category === selectedCategory.value)
      }

      // Status filter
      if (selectedStatus.value) {
        filtered = filtered.filter(product => product.status === selectedStatus.value)
      }

      // Sort
      filtered.sort((a, b) => {
        switch (selectedSort.value) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'price':
            return a.price - b.price
          case 'date':
            return new Date(b.date) - new Date(a.date)
          case 'stock':
            return a.stock - b.stock
          default:
            return 0
        }
      })

      return filtered
    })

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredProducts.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage)
    })

    const activeProducts = computed(() => {
      return products.value.filter(p => p.status === 'active').length
    })

    const lowStockProducts = computed(() => {
      return products.value.filter(p => p.stock < p.lowStockThreshold && p.stock > 0).length
    })

    const outOfStockProducts = computed(() => {
      return products.value.filter(p => p.stock === 0).length
    })

    const totalRevenue = computed(() => {
      return products.value.reduce((total, product) => total + product.revenue, 0)
    })

    const totalOrders = computed(() => {
      return products.value.reduce((total, product) => total + product.orders, 0)
    })

    const averageRating = computed(() => {
      const total = products.value.reduce((sum, product) => sum + product.rating, 0)
      return products.value.length > 0 ? (total / products.value.length).toFixed(1) : 0
    })

    const selectAll = computed({
      get() {
        return selectedProducts.value.length === filteredProducts.value.length && filteredProducts.value.length > 0
      },
      set(value) {
        if (value) {
          selectedProducts.value = filteredProducts.value.map(p => p.id)
        } else {
          selectedProducts.value = []
        }
      }
    })

    const navigateTo = (path) => {
      router.push(path)
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    const getCategoryName = (categoryId) => {
      const category = categories.find(c => c.id === categoryId)
      return category ? category.name : categoryId
    }

    const getStockStatusClass = (product) => {
      if (product.stock === 0) return 'out-of-stock'
      if (product.stock < product.lowStockThreshold) return 'low-stock'
      return 'in-stock'
    }

    const getStockStatusText = (product) => {
      if (product.stock === 0) return 'Out of Stock'
      if (product.stock < product.lowStockThreshold) return 'Low Stock'
      return 'In Stock'
    }

    const searchProducts = () => {
      currentPage.value = 1
    }

    const filterProducts = () => {
      currentPage.value = 1
    }

    const sortProducts = () => {
      // Sorting is handled in computed property
    }

    const changePage = (page) => {
      currentPage.value = page
    }

    const viewProduct = (productId) => {
      selectedProduct.value = products.value.find(p => p.id === productId)
      showViewModal.value = true
    }

    const editProduct = (productId) => {
      alert(`Editing product: ${productId}`)
    }

    const duplicateProduct = (productId) => {
      alert(`Duplicating product: ${productId}`)
    }

    const deleteProduct = (productId) => {
      if (confirm('Are you sure you want to delete this product?')) {
        const index = products.value.findIndex(p => p.id === productId)
        if (index > -1) {
          products.value.splice(index, 1)
        }
      }
    }

    const toggleStatus = (productId) => {
      const product = products.value.find(p => p.id === productId)
      if (product) {
        product.status = product.status === 'active' ? 'inactive' : 'active'
      }
    }

    const toggleSelectAll = () => {
      // Handled by computed property
    }

    const executeBulkAction = () => {
      if (!bulkAction.value || selectedProducts.value.length === 0) return

      switch (bulkAction.value) {
        case 'activate':
          selectedProducts.value.forEach(id => {
            const product = products.value.find(p => p.id === id)
            if (product) product.status = 'active'
          })
          break
        case 'deactivate':
          selectedProducts.value.forEach(id => {
            const product = products.value.find(p => p.id === id)
            if (product) product.status = 'inactive'
          })
          break
        case 'delete':
          if (confirm(`Delete ${selectedProducts.value.length} products?`)) {
            selectedProducts.value.forEach(id => {
              const index = products.value.findIndex(p => p.id === id)
              if (index > -1) {
                products.value.splice(index, 1)
              }
            })
            selectedProducts.value = []
          }
          break
        case 'export':
          alert('Exporting selected products...')
          break
      }
      
      bulkAction.value = ''
    }

    const exportProducts = () => {
      alert('Exporting all products...')
    }

    return {
      searchQuery,
      selectedCategory,
      selectedStatus,
      selectedSort,
      currentPage,
      selectedProducts,
      bulkAction,
      products,
      categories,
      filteredProducts,
      paginatedProducts,
      totalPages,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalRevenue,
      totalOrders,
      averageRating,
      selectAll,
      navigateTo,
      formatCurrency,
      getCategoryName,
      getStockStatusClass,
      getStockStatusText,
      searchProducts,
      filterProducts,
      sortProducts,
      changePage,
      viewProduct,
      editProduct,
      duplicateProduct,
      deleteProduct,
      toggleStatus,
      toggleSelectAll,
      executeBulkAction,
      exportProducts,
      showViewModal,
      selectedProduct
    }
  }
}
</script>

<style scoped>
.product-list {
  max-width: 1400px;
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
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
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

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.stats-summary {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-value.active { color: #10b981; }
.stat-value.warning { color: #f59e0b; }
.stat-value.danger { color: #ef4444; }

.products-table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 50px 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
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

.checkbox-cell {
  justify-content: center;
}

.product-cell {
  gap: 1rem;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-weight: 600;
  color: #1f2937;
}

.product-sku {
  font-size: 0.75rem;
  color: #6b7280;
}

.product-category {
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price {
  font-weight: 600;
  color: #1f2937;
}

.price.on-sale {
  text-decoration: line-through;
  color: #6b7280;
  font-size: 0.875rem;
}

.sale-price {
  font-weight: 700;
  color: #10b981;
  font-size: 1.125rem;
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stock-quantity {
  font-weight: 600;
  color: #1f2937;
}

.stock-status {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
}

.stock-status.in-stock {
  background-color: #d1fae5;
  color: #065f46;
}

.stock-status.low-stock {
  background-color: #fef3c7;
  color: #92400e;
}

.stock-status.out-of-stock {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active { background-color: #d1fae5; color: #065f46; }
.status-badge.draft { background-color: #e0e7ff; color: #1e40af; }
.status-badge.pending { background-color: #fef3c7; color: #92400e; }
.status-badge.inactive { background-color: #fee2e2; color: #991b1b; }

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #9ca3af;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.selected-info {
  font-weight: 600;
  color: #374151;
}

.bulk-actions-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.bulk-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
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

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
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
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  background-color: #3b82f6;
}

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
}

.product-detail-modal {
  max-width: 800px;
}

.product-detail-header {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.product-detail-image {
  width: 120px;
  height: 120px;
  border-radius: 0.75rem;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.product-detail-basic {
  flex: 1;
}

.product-detail-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.product-detail-sku {
  color: #6b7280;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
}

.product-detail-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.detail-item label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.detail-item span {
  color: #1f2937;
  font-weight: 500;
}

.detail-item span.in-stock {
  color: #10b981;
}

.detail-item span.low-stock {
  color: #f59e0b;
}

.detail-item span.out-of-stock {
  color: #ef4444;
}

/* Responsive styles */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-container {
    width: 100%;
  }
  
  .filter-group {
    flex-wrap: wrap;
  }
  
  .stats-summary {
    flex-direction: column;
    gap: 1rem;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 40px 1fr;
    gap: 0.5rem;
  }
  
  .product-cell {
    grid-column: 1 / -1;
  }
  
  .bulk-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>