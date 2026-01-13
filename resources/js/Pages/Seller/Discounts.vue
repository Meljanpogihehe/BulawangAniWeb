<template>
  <div class="discounts">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Discounts</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="exportDiscounts">
          <i class="fas fa-download"></i> Export
        </button>
        <button class="btn-primary" @click="addNewDiscount">
          <i class="fas fa-plus"></i> Add Discount
        </button>
      </div>
    </div>

    <!-- Stats Banner -->
    <div class="stats-banner">
      <div class="stat-item">
        <span class="stat-label">Active Discounts:</span>
        <span class="stat-value">{{ activeDiscounts }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total Savings:</span>
        <span class="stat-value">₱{{ formatCurrency(totalSavings) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Avg Discount:</span>
        <span class="stat-value">{{ avgDiscount }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Revenue Impact:</span>
        <span class="stat-value danger">-{{ revenueImpact }}%</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <select v-model="selectedType" class="filter-select" @change="filterDiscounts">
          <option value="all">All Types</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
          <option value="buy-one-get-one">Buy One Get One</option>
        </select>
        
        <select v-model="selectedStatus" class="filter-select" @change="filterDiscounts">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="upcoming">Upcoming</option>
        </select>
        
        <select v-model="selectedSort" class="filter-select" @change="sortDiscounts">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Discount</option>
          <option value="lowest">Lowest Discount</option>
        </select>
      </div>
      
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search discounts..." 
          class="search-input"
          @input="searchDiscounts"
        >
        <i class="fas fa-search search-icon"></i>
      </div>
    </div>

    <!-- Discounts List -->
    <div class="discounts-list">
      <div v-if="filteredDiscounts.length === 0" class="empty-state">
        <i class="fas fa-tags"></i>
        <h3>No discounts found</h3>
        <p>Create your first discount to attract more customers.</p>
      </div>

      <div 
        v-for="discount in paginatedDiscounts" 
        :key="discount.id" 
        class="discount-card"
        :class="getDiscountClasses(discount)"
      >
        <!-- Discount Header -->
        <div class="discount-header">
          <div class="discount-info">
            <div class="discount-title">{{ discount.name }}</div>
            <div class="discount-code">
              <span class="code-label">Code:</span>
              <span class="code-value">{{ discount.code }}</span>
              <button class="btn-copy" @click="copyCode(discount.code)">
                <i class="fas fa-copy"></i>
              </button>
            </div>
            <div class="discount-type">{{ discount.type }}</div>
          </div>
          
          <div class="discount-actions">
            <button class="btn-edit" @click="editDiscount(discount.id)">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-toggle" @click="toggleDiscount(discount.id)">
              <i class="fas fa-power-off"></i> {{ discount.active ? 'Deactivate' : 'Activate' }}
            </button>
            <button class="btn-delete" @click="deleteDiscount(discount.id)">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>

        <!-- Discount Details -->
        <div class="discount-details">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Discount Value:</span>
              <span class="detail-value">{{ getDiscountValue(discount) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Valid From:</span>
              <span class="detail-value">{{ formatDate(discount.startDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Valid Until:</span>
              <span class="detail-value">{{ formatDate(discount.endDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Usage:</span>
              <span class="detail-value">{{ discount.usedCount }} / {{ discount.maxUses || 'Unlimited' }}</span>
            </div>
          </div>
        </div>

        <!-- Applicable Products -->
        <div class="applicable-products">
          <h4>Applicable Products</h4>
          <div class="product-tags">
            <span v-for="product in discount.products.slice(0, 3)" :key="product.id" class="product-tag">
              {{ product.name }}
            </span>
            <span v-if="discount.products.length > 3" class="more-products">
              +{{ discount.products.length - 3 }} more
            </span>
          </div>
        </div>

        <!-- Discount Status -->
        <div class="discount-status">
          <div class="status-info">
            <span class="status-badge" :class="getDiscountStatusClass(discount)">
              {{ getDiscountStatusText(discount) }}
            </span>
            <span class="status-date">{{ getStatusDate(discount) }}</span>
          </div>
          <div class="usage-progress">
            <div class="progress-label">
              <span>Usage</span>
              <span>{{ discount.usedCount }}/{{ discount.maxUses || '∞' }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getUsagePercentage(discount) + '%' }"></div>
            </div>
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

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <div class="action-card" @click="createSeasonalSale">
          <div class="action-icon">
            <i class="fas fa-gift"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Seasonal Sale</div>
            <div class="action-subtitle">Create holiday discounts</div>
          </div>
        </div>

        <div class="action-card" @click="createBundleDiscount">
          <div class="action-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Bundle Discount</div>
            <div class="action-subtitle">Multi-product offers</div>
          </div>
        </div>

        <div class="action-card" @click="createLoyaltyProgram">
          <div class="action-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Loyalty Program</div>
            <div class="action-subtitle">Reward repeat customers</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Discount Analytics -->
    <div class="analytics-section">
      <h3>Discount Analytics</h3>
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="analytics-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
          <div class="analytics-content">
            <div class="analytics-title">Conversion Rate</div>
            <div class="analytics-value">{{ conversionRate }}%</div>
            <div class="analytics-change" :class="conversionChange >= 0 ? 'positive' : 'negative'">
              {{ conversionChange >= 0 ? '+' : '' }}{{ conversionChange }}% vs last month
            </div>
          </div>
        </div>
        
        <div class="analytics-card">
          <div class="analytics-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="analytics-content">
            <div class="analytics-title">Average Order Value</div>
            <div class="analytics-value">₱{{ formatCurrency(avgOrderValue) }}</div>
            <div class="analytics-change" :class="aovChange >= 0 ? 'positive' : 'negative'">
              {{ aovChange >= 0 ? '+' : '' }}{{ aovChange }}% with discounts
            </div>
          </div>
        </div>
        
        <div class="analytics-card">
          <div class="analytics-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="analytics-content">
            <div class="analytics-title">New Customers</div>
            <div class="analytics-value">{{ newCustomers }}</div>
            <div class="analytics-change positive">
              {{ newCustomerGrowth }}% from discount campaigns
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Discounts',
  setup() {
    const searchQuery = ref('')
    const selectedType = ref('all')
    const selectedStatus = ref('all')
    const selectedSort = ref('newest')
    const currentPage = ref(1)
    const itemsPerPage = 10

    // Mock discount data
    const discounts = ref([
      {
        id: 1,
        name: 'New Year Sale',
        code: 'NEWYEAR2024',
        type: 'percentage',
        value: 20,
        startDate: '2024-01-01T00:00:00',
        endDate: '2024-01-31T23:59:59',
        active: true,
        maxUses: 100,
        usedCount: 45,
        products: [
          { id: 1, name: 'Handwoven Abaca Bag' },
          { id: 2, name: 'Traditional Weaving Set' },
          { id: 3, name: 'Bamboo Home Decor' }
        ]
      },
      {
        id: 2,
        name: 'Free Shipping',
        code: 'FREESHIP',
        type: 'fixed',
        value: 150,
        startDate: '2024-01-10T00:00:00',
        endDate: '2024-02-10T23:59:59',
        active: true,
        maxUses: 50,
        usedCount: 23,
        products: []
      },
      {
        id: 3,
        name: 'Buy One Get One 50% Off',
        code: 'BOGO50',
        type: 'buy-one-get-one',
        value: 50,
        startDate: '2024-01-15T00:00:00',
        endDate: '2024-01-25T23:59:59',
        active: true,
        maxUses: 200,
        usedCount: 89,
        products: [
          { id: 4, name: 'Handmade Pottery Set' },
          { id: 5, name: 'Wooden Spoon Set' }
        ]
      },
      {
        id: 4,
        name: 'Holiday Special',
        code: 'HOLIDAY2023',
        type: 'percentage',
        value: 30,
        startDate: '2023-12-01T00:00:00',
        endDate: '2023-12-31T23:59:59',
        active: false,
        maxUses: 150,
        usedCount: 150,
        products: [
          { id: 6, name: 'Coconut Shell Bowl' }
        ]
      }
    ])

    const filteredDiscounts = computed(() => {
      let filtered = discounts.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(discount => 
          discount.name.toLowerCase().includes(query) ||
          discount.code.toLowerCase().includes(query) ||
          discount.type.toLowerCase().includes(query)
        )
      }

      // Type filter
      if (selectedType.value !== 'all') {
        filtered = filtered.filter(discount => discount.type === selectedType.value)
      }

      // Status filter
      if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(discount => {
          const now = new Date()
          const startDate = new Date(discount.startDate)
          const endDate = new Date(discount.endDate)
          
          switch (selectedStatus.value) {
            case 'active':
              return discount.active && now >= startDate && now <= endDate
            case 'expired':
              return !discount.active || now > endDate
            case 'upcoming':
              return discount.active && now < startDate
            default:
              return true
          }
        })
      }

      // Sort
      filtered.sort((a, b) => {
        switch (selectedSort.value) {
          case 'newest':
            return new Date(b.startDate) - new Date(a.startDate)
          case 'oldest':
            return new Date(a.startDate) - new Date(b.startDate)
          case 'highest':
            return b.value - a.value
          case 'lowest':
            return a.value - b.value
          default:
            return 0
        }
      })

      return filtered
    })

    const paginatedDiscounts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredDiscounts.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredDiscounts.value.length / itemsPerPage)
    })

    const activeDiscounts = computed(() => {
      const now = new Date()
      return discounts.value.filter(d => {
        const startDate = new Date(d.startDate)
        const endDate = new Date(d.endDate)
        return d.active && now >= startDate && now <= endDate
      }).length
    })

    const totalSavings = computed(() => {
      // Mock calculation based on discount usage
      return discounts.value.reduce((total, discount) => {
        const savings = discount.value * discount.usedCount
        return total + savings
      }, 0)
    })

    const avgDiscount = computed(() => {
      const totalValue = discounts.value.reduce((total, discount) => total + discount.value, 0)
      return discounts.value.length > 0 ? Math.round(totalValue / discounts.value.length) : 0
    })

    const revenueImpact = computed(() => 15) // Mock data

    const conversionRate = computed(() => 25.5)
    const conversionChange = computed(() => 3.2)
    const avgOrderValue = computed(() => 1250.75)
    const aovChange = computed(() => 8.5)
    const newCustomers = computed(() => 123)
    const newCustomerGrowth = computed(() => 18.7)

    const getDiscountClasses = (discount) => {
      const now = new Date()
      const startDate = new Date(discount.startDate)
      const endDate = new Date(discount.endDate)
      
      return {
        'status-active': discount.active && now >= startDate && now <= endDate,
        'status-expired': !discount.active || now > endDate,
        'status-upcoming': discount.active && now < startDate
      }
    }

    const getDiscountValue = (discount) => {
      switch (discount.type) {
        case 'percentage':
          return `${discount.value}% off`
        case 'fixed':
          return `₱${discount.value} off`
        case 'buy-one-get-one':
          return `Buy One Get ${discount.value}% Off`
        default:
          return 'N/A'
      }
    }

    const getDiscountStatusClass = (discount) => {
      const now = new Date()
      const startDate = new Date(discount.startDate)
      const endDate = new Date(discount.endDate)
      
      if (discount.active && now >= startDate && now <= endDate) return 'active'
      if (!discount.active || now > endDate) return 'expired'
      if (discount.active && now < startDate) return 'upcoming'
      return 'inactive'
    }

    const getDiscountStatusText = (discount) => {
      const now = new Date()
      const startDate = new Date(discount.startDate)
      const endDate = new Date(discount.endDate)
      
      if (discount.active && now >= startDate && now <= endDate) return 'Active'
      if (!discount.active || now > endDate) return 'Expired'
      if (discount.active && now < startDate) return 'Upcoming'
      return 'Inactive'
    }

    const getStatusDate = (discount) => {
      const now = new Date()
      const startDate = new Date(discount.startDate)
      const endDate = new Date(discount.endDate)
      
      if (discount.active && now >= startDate && now <= endDate) {
        return `Ends ${formatDate(endDate)}`
      } else if (!discount.active || now > endDate) {
        return `Ended ${formatDate(endDate)}`
      } else {
        return `Starts ${formatDate(startDate)}`
      }
    }

    const getUsagePercentage = (discount) => {
      if (!discount.maxUses) return 0
      return Math.round((discount.usedCount / discount.maxUses) * 100)
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const filterDiscounts = () => {
      currentPage.value = 1
    }

    const searchDiscounts = () => {
      currentPage.value = 1
    }

    const sortDiscounts = () => {
      // Sorting is handled in computed property
    }

    const changePage = (page) => {
      currentPage.value = page
    }

    const copyCode = (code) => {
      navigator.clipboard.writeText(code)
      alert(`Discount code "${code}" copied to clipboard!`)
    }

    const editDiscount = (discountId) => {
      alert(`Editing discount: ${discountId}`)
    }

    const toggleDiscount = (discountId) => {
      const discount = discounts.value.find(d => d.id === discountId)
      if (discount) {
        discount.active = !discount.active
        alert(`Discount ${discount.active ? 'activated' : 'deactivated'}!`)
      }
    }

    const deleteDiscount = (discountId) => {
      if (confirm('Are you sure you want to delete this discount?')) {
        const index = discounts.value.findIndex(d => d.id === discountId)
        if (index > -1) {
          discounts.value.splice(index, 1)
        }
      }
    }

    const addNewDiscount = () => {
      alert('Adding new discount...')
    }

    const createSeasonalSale = () => {
      alert('Creating seasonal sale...')
    }

    const createBundleDiscount = () => {
      alert('Creating bundle discount...')
    }

    const createLoyaltyProgram = () => {
      alert('Creating loyalty program...')
    }

    const exportDiscounts = () => {
      alert('Exporting discounts...')
    }

    return {
      searchQuery,
      selectedType,
      selectedStatus,
      selectedSort,
      currentPage,
      discounts,
      filteredDiscounts,
      paginatedDiscounts,
      totalPages,
      activeDiscounts,
      totalSavings,
      avgDiscount,
      revenueImpact,
      conversionRate,
      conversionChange,
      avgOrderValue,
      aovChange,
      newCustomers,
      newCustomerGrowth,
      getDiscountClasses,
      getDiscountValue,
      getDiscountStatusClass,
      getDiscountStatusText,
      getStatusDate,
      getUsagePercentage,
      formatCurrency,
      formatDate,
      filterDiscounts,
      searchDiscounts,
      sortDiscounts,
      changePage,
      copyCode,
      editDiscount,
      toggleDiscount,
      deleteDiscount,
      addNewDiscount,
      createSeasonalSale,
      createBundleDiscount,
      createLoyaltyProgram,
      exportDiscounts
    }
  }
}
</script>

<style scoped>
.discounts {
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

.stats-banner {
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

.stat-value.danger {
  color: #ef4444;
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

.discounts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
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

.discount-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s;
}

.discount-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.discount-card.status-active {
  border-left: 4px solid #10b981;
}

.discount-card.status-expired {
  border-left: 4px solid #ef4444;
  opacity: 0.7;
}

.discount-card.status-upcoming {
  border-left: 4px solid #f59e0b;
}

.discount-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.discount-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.discount-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.discount-code {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: fit-content;
}

.code-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.code-value {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #1f2937;
  background-color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
}

.btn-copy {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.btn-copy:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.discount-type {
  font-size: 0.875rem;
  color: #6b7280;
  background-color: #e5e7eb;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  display: inline-block;
  width: fit-content;
}

.discount-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-toggle,
.btn-delete {
  background: none;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn-toggle:hover {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.btn-delete:hover {
  background-color: #fee2e2;
  border-color: #fecaca;
  color: #991b1b;
}

.discount-details {
  margin-bottom: 1.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.detail-value {
  font-weight: 600;
  color: #1f2937;
}

.applicable-products h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.product-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
  color: #374151;
}

.more-products {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

.discount-status {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.expired {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-badge.upcoming {
  background-color: #fef3c7;
  color: #92400e;
}

.status-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.usage-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  width: 200px;
  font-size: 0.75rem;
  color: #6b7280;
}

.progress-bar {
  width: 200px;
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

.analytics-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.analytics-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.analytics-icon {
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

.analytics-content {
  flex: 1;
}

.analytics-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.analytics-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.analytics-change {
  font-size: 0.75rem;
  font-weight: 600;
}

.analytics-change.positive { color: #10b981; }
.analytics-change.negative { color: #ef4444; }

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
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .discount-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .discount-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .progress-label {
    width: 100%;
  }
  
  .progress-bar {
    width: 100%;
  }
}
</style>