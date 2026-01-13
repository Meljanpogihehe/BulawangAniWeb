<template>
    <div class="stock-management">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Stock Management</h1>
        <div class="header-actions">
          <button class="btn-secondary" @click="exportStockReport">
            <i class="fas fa-download"></i> Export Report
          </button>
          <button class="btn-primary" @click="addStockAdjustment">
            <i class="fas fa-plus"></i> Add Adjustment
          </button>
        </div>
      </div>

      <!-- Stock Overview -->
      <div class="stock-overview">
        <div class="overview-grid">
          <div class="overview-card">
            <div class="card-icon">
              <i class="fas fa-boxes"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Total Products</div>
              <div class="card-value">{{ totalProducts }}</div>
            </div>
          </div>

          <div class="overview-card warning">
            <div class="card-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Low Stock Items</div>
              <div class="card-value">{{ lowStockItems }}</div>
            </div>
          </div>

          <div class="overview-card danger">
            <div class="card-icon">
              <i class="fas fa-times-circle"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Out of Stock</div>
              <div class="card-value">{{ outOfStockItems }}</div>
            </div>
          </div>

          <div class="overview-card success">
            <div class="card-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="card-content">
              <div class="card-label">In Stock</div>
              <div class="card-value">{{ inStockItems }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <select v-model="selectedCategory" class="filter-select" @change="filterStock">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          
          <select v-model="selectedStatus" class="filter-select" @change="filterStock">
            <option value="">All Status</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
            <option value="good">Good Stock</option>
          </select>
          
          <select v-model="selectedSort" class="filter-select" @change="sortStock">
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="value">Sort by Value</option>
            <option value="date">Sort by Last Update</option>
          </select>
        </div>
        
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
            class="search-input"
            @input="searchStock"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>

      <!-- Stock Table -->
      <div class="stock-table-container">
        <div class="table-header">
          <div class="table-cell">Product</div>
          <div class="table-cell">Category</div>
          <div class="table-cell">Current Stock</div>
          <div class="table-cell">Threshold</div>
          <div class="table-cell">Stock Value</div>
          <div class="table-cell">Status</div>
          <div class="table-cell">Actions</div>
        </div>

        <div v-if="filteredStock.length === 0" class="empty-state">
          <i class="fas fa-warehouse"></i>
          <h3>No stock items found</h3>
          <p>Add products to your inventory to manage stock levels.</p>
        </div>

        <div
          v-for="item in paginatedStock"
          :key="item.id"
          class="table-row"
          :class="getStockRowClass(item)"
        >
          <div class="table-cell product-cell">
            <div class="product-info">
              <img :src="item.image" :alt="item.name" class="product-image">
              <div class="product-details">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-sku">SKU: {{ item.sku }}</div>
              </div>
            </div>
          </div>
          <div class="table-cell">{{ getCategoryName(item.category) }}</div>
          <div class="table-cell">
            <div class="stock-quantity">{{ item.stock }}</div>
            <div class="stock-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getStockPercentage(item) + '%' }"></div>
              </div>
              <div class="progress-label">{{ getStockPercentage(item) }}% of threshold</div>
            </div>
          </div>
          <div class="table-cell">
            <div class="threshold-display">
              <span class="threshold-value">{{ item.lowStockThreshold }}</span>
              <button class="btn-edit-threshold" @click="editThreshold(item)">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </div>
          <div class="table-cell">
            <div class="stock-value">₱{{ formatCurrency(item.stockValue) }}</div>
            <div class="stock-unit-value">₱{{ formatCurrency(item.price) }} per unit</div>
          </div>
          <div class="table-cell">
            <span class="status-badge" :class="getStockStatusClass(item)">
              {{ getStockStatusText(item) }}
            </span>
          </div>
          <div class="table-cell">
            <div class="action-buttons">
              <button class="btn-icon" @click="adjustStock(item)" title="Adjust Stock">
                <i class="fas fa-plus-circle"></i>
              </button>
              <button class="btn-icon" @click="viewHistory(item.id)" title="View History">
                <i class="fas fa-history"></i>
              </button>
              <button class="btn-icon" @click="reorderStock(item)" title="Reorder">
                <i class="fas fa-truck"></i>
              </button>
            </div>
          </div>
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

      <!-- Stock Alerts -->
      <div class="alerts-section">
        <h3>Stock Alerts</h3>
        <div class="alerts-container">
          <div v-if="lowStockAlerts.length === 0" class="no-alerts">
            <i class="fas fa-bell-slash"></i>
            <span>No stock alerts at this time</span>
          </div>
          
          <div v-for="alert in lowStockAlerts" :key="alert.id" class="alert-item">
            <div class="alert-icon warning">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="alert-content">
              <div class="alert-title">{{ alert.name }}</div>
              <div class="alert-message">Stock level is below threshold ({{ alert.stock }} < {{ alert.threshold }})</div>
            </div>
            <div class="alert-actions">
              <button class="btn-primary small" @click="reorderStock(alert)">Reorder</button>
              <button class="btn-secondary small" @click="adjustThreshold(alert)">Adjust Threshold</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <div class="action-card" @click="bulkAdjustment">
            <div class="action-icon">
              <i class="fas fa-sliders-h"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Bulk Stock Adjustment</div>
              <div class="action-subtitle">Adjust multiple products at once</div>
            </div>
          </div>

          <div class="action-card" @click="importStock">
            <div class="action-icon">
              <i class="fas fa-file-import"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Import Stock</div>
              <div class="action-subtitle">Import from CSV file</div>
            </div>
          </div>

          <div class="action-card" @click="generateReport">
            <div class="action-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Generate Report</div>
              <div class="action-subtitle">Stock movement analysis</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Adjustment Modal -->
      <div v-if="showAdjustmentModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3>Adjust Stock: {{ selectedProduct?.name }}</h3>
            <button class="btn-close" @click="closeAdjustmentModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-content">
            <div class="adjustment-form">
              <div class="form-group">
                <label>Adjustment Type</label>
                <select v-model="adjustment.type">
                  <option value="add">Add Stock</option>
                  <option value="remove">Remove Stock</option>
                  <option value="set">Set Exact Quantity</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  v-model.number="adjustment.quantity"
                  :min="adjustment.type === 'remove' ? 1 : 0"
                  :max="adjustment.type === 'add' ? 9999 : selectedProduct?.stock"
                >
              </div>
              
              <div class="form-group">
                <label>Reason</label>
                <textarea v-model="adjustment.reason" placeholder="Enter reason for adjustment..."></textarea>
              </div>
              
              <div class="form-group">
                <label>Reference</label>
                <input type="text" v-model="adjustment.reference" placeholder="PO Number, Invoice, etc.">
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="closeAdjustmentModal">Cancel</button>
            <button class="btn-primary" @click="saveAdjustment">Save Adjustment</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'StockManagement',
  components: {
    SellerLayout
  },
  setup() {
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const selectedStatus = ref('')
    const selectedSort = ref('name')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const showAdjustmentModal = ref(false)
    const selectedProduct = ref(null)

    const categories = [
      { id: 'bags', name: 'Bags & Accessories' },
      { id: 'crafts', name: 'Handicrafts' },
      { id: 'home', name: 'Home & Living' },
      { id: 'kitchen', name: 'Kitchen' },
      { id: 'fashion', name: 'Fashion' }
    ]

    // Mock stock data
    const stockItems = ref([
      {
        id: 1,
        name: 'Handwoven Abaca Bag',
        sku: 'BAG-001',
        category: 'bags',
        stock: 15,
        lowStockThreshold: 5,
        price: 2200,
        image: '/images/products/bag1.jpg',
        lastUpdated: '2024-01-15T10:30:00'
      },
      {
        id: 2,
        name: 'Traditional Weaving Set',
        sku: 'CFT-002',
        category: 'crafts',
        stock: 3,
        lowStockThreshold: 5,
        price: 1900,
        image: '/images/products/weaving1.jpg',
        lastUpdated: '2024-01-14T15:45:00'
      },
      {
        id: 3,
        name: 'Bamboo Home Decor',
        sku: 'HME-003',
        category: 'home',
        stock: 0,
        lowStockThreshold: 3,
        price: 1800,
        image: '/images/products/decor1.jpg',
        lastUpdated: '2024-01-13T09:20:00'
      },
      {
        id: 4,
        name: 'Handmade Pottery Set',
        sku: 'HME-004',
        category: 'home',
        stock: 25,
        lowStockThreshold: 10,
        price: 1500,
        image: '/images/products/pottery1.jpg',
        lastUpdated: '2024-01-12T14:15:00'
      },
      {
        id: 5,
        name: 'Wooden Spoon Set',
        sku: 'KIT-005',
        category: 'kitchen',
        stock: 8,
        lowStockThreshold: 15,
        price: 850,
        image: '/images/products/spoon1.jpg',
        lastUpdated: '2024-01-11T11:30:00'
      }
    ])

    const adjustment = reactive({
      type: 'add',
      quantity: 0,
      reason: '',
      reference: ''
    })

    const filteredStock = computed(() => {
      let filtered = stockItems.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        )
      }

      // Category filter
      if (selectedCategory.value) {
        filtered = filtered.filter(item => item.category === selectedCategory.value)
      }

      // Status filter
      if (selectedStatus.value) {
        switch (selectedStatus.value) {
          case 'low':
            filtered = filtered.filter(item => item.stock < item.lowStockThreshold && item.stock > 0)
            break
          case 'out':
            filtered = filtered.filter(item => item.stock === 0)
            break
          case 'good':
            filtered = filtered.filter(item => item.stock >= item.lowStockThreshold)
            break
        }
      }

      // Sort
      filtered.sort((a, b) => {
        switch (selectedSort.value) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'stock':
            return a.stock - b.stock
          case 'value':
            return (b.stock * b.price) - (a.stock * a.price)
          case 'date':
            return new Date(b.lastUpdated) - new Date(a.lastUpdated)
          default:
            return 0
        }
      })

      return filtered
    })

    const paginatedStock = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredStock.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredStock.value.length / itemsPerPage)
    })

    const totalProducts = computed(() => stockItems.value.length)
    const lowStockItems = computed(() => {
      return stockItems.value.filter(item => item.stock < item.lowStockThreshold && item.stock > 0).length
    })
    const outOfStockItems = computed(() => {
      return stockItems.value.filter(item => item.stock === 0).length
    })
    const inStockItems = computed(() => {
      return stockItems.value.filter(item => item.stock >= item.lowStockThreshold).length
    })

    const lowStockAlerts = computed(() => {
      return stockItems.value
        .filter(item => item.stock < item.lowStockThreshold && item.stock > 0)
        .map(item => ({
          id: item.id,
          name: item.name,
          stock: item.stock,
          threshold: item.lowStockThreshold
        }))
    })

    const getStockRowClass = (item) => {
      if (item.stock === 0) return 'out-of-stock'
      if (item.stock < item.lowStockThreshold) return 'low-stock'
      return 'in-stock'
    }

    const getStockStatusClass = (item) => {
      if (item.stock === 0) return 'out-of-stock'
      if (item.stock < item.lowStockThreshold) return 'low-stock'
      return 'in-stock'
    }

    const getStockStatusText = (item) => {
      if (item.stock === 0) return 'Out of Stock'
      if (item.stock < item.lowStockThreshold) return 'Low Stock'
      return 'In Stock'
    }

    const getStockPercentage = (item) => {
      if (item.lowStockThreshold === 0) return 100
      return Math.round((item.stock / item.lowStockThreshold) * 100)
    }

    const getStockValue = (item) => {
      return item.stock * item.price
    }

    const getCategoryName = (categoryId) => {
      const category = categories.find(c => c.id === categoryId)
      return category ? category.name : categoryId
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    const filterStock = () => {
      currentPage.value = 1
    }

    const searchStock = () => {
      currentPage.value = 1
    }

    const sortStock = () => {
      // Sorting is handled in computed property
    }

    const changePage = (page) => {
      currentPage.value = page
    }

    const adjustStock = (item) => {
      selectedProduct.value = item
      showAdjustmentModal.value = true
    }

    const closeAdjustmentModal = () => {
      showAdjustmentModal.value = false
      selectedProduct.value = null
      adjustment.type = 'add'
      adjustment.quantity = 0
      adjustment.reason = ''
      adjustment.reference = ''
    }

    const saveAdjustment = () => {
      if (!selectedProduct.value || adjustment.quantity <= 0) return

      const item = selectedProduct.value
      let newStock = item.stock

      switch (adjustment.type) {
        case 'add':
          newStock += adjustment.quantity
          break
        case 'remove':
          newStock = Math.max(0, item.stock - adjustment.quantity)
          break
        case 'set':
          newStock = adjustment.quantity
          break
      }

      item.stock = newStock
      item.lastUpdated = new Date().toISOString()

      closeAdjustmentModal()
      alert('Stock adjustment saved successfully!')
    }

    const editThreshold = (item) => {
      const newThreshold = prompt('Enter new low stock threshold:', item.lowStockThreshold.toString())
      if (newThreshold && !isNaN(newThreshold)) {
        item.lowStockThreshold = parseInt(newThreshold)
      }
    }

    const viewHistory = (productId) => {
      alert(`Viewing stock history for product: ${productId}`)
    }

    const reorderStock = (item) => {
      alert(`Reordering stock for: ${item.name}`)
    }

    const adjustThreshold = (alert) => {
      const item = stockItems.value.find(s => s.id === alert.id)
      if (item) {
        editThreshold(item)
      }
    }

    const exportStockReport = () => {
      alert('Exporting stock report...')
    }

    const addStockAdjustment = () => {
      // Find first item with low stock to adjust
      const lowStockItem = stockItems.value.find(item => item.stock < item.lowStockThreshold)
      if (lowStockItem) {
        adjustStock(lowStockItem)
      } else {
        alert('No items need stock adjustment at this time.')
      }
    }

    const bulkAdjustment = () => {
      alert('Bulk stock adjustment feature')
    }

    const importStock = () => {
      alert('Import stock from CSV')
    }

    const generateReport = () => {
      alert('Generating stock report...')
    }

    return {
      searchQuery,
      selectedCategory,
      selectedStatus,
      selectedSort,
      currentPage,
      showAdjustmentModal,
      selectedProduct,
      adjustment,
      categories,
      stockItems,
      filteredStock,
      paginatedStock,
      totalPages,
      totalProducts,
      lowStockItems,
      outOfStockItems,
      inStockItems,
      lowStockAlerts,
      getStockRowClass,
      getStockStatusClass,
      getStockStatusText,
      getStockPercentage,
      getStockValue,
      getCategoryName,
      formatCurrency,
      filterStock,
      searchStock,
      sortStock,
      changePage,
      adjustStock,
      closeAdjustmentModal,
      saveAdjustment,
      editThreshold,
      viewHistory,
      reorderStock,
      adjustThreshold,
      exportStockReport,
      addStockAdjustment,
      bulkAdjustment,
      importStock,
      generateReport
    }
  }
}
</script>

<style scoped>
.stock-management {
  max-width: 1200px;
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

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.stock-overview {
  margin-bottom: 2rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.overview-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s;
}

.overview-card:hover {
  transform: translateY(-2px);
}

.overview-card.warning { border-left: 4px solid #f59e0b; }
.overview-card.danger { border-left: 4px solid #ef4444; }
.overview-card.success { border-left: 4px solid #10b981; }

.card-icon {
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

.card-content {
  flex: 1;
}

.card-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
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

.stock-table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
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

.stock-quantity {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.stock-progress {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.threshold-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.threshold-value {
  font-weight: 600;
  color: #1f2937;
}

.btn-edit-threshold {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.btn-edit-threshold:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.stock-value {
  font-weight: 600;
  color: #1f2937;
}

.stock-unit-value {
  font-size: 0.75rem;
  color: #6b7280;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.in-stock { background-color: #d1fae5; color: #065f46; }
.status-badge.low-stock { background-color: #fef3c7; color: #92400e; }
.status-badge.out-of-stock { background-color: #fee2e2; color: #991b1b; }

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

.alerts-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.alerts-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1rem;
}

.no-alerts {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.alert-icon.warning { background-color: #f59e0b; }
.alert-icon.danger { background-color: #ef4444; }

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.alert-message {
  font-size: 0.875rem;
  color: #6b7280;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

.small {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.quick-actions h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 50px;
  height: 50px;
  background: #f3f4f6;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1.25rem;
}

.action-content {
  flex: 1;
}

.action-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.action-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  padding: 0;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.btn-close:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 1.5rem;
}

.adjustment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-group select,
.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
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
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .product-cell {
    grid-column: 1 / -1;
  }
  
  .alert-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>