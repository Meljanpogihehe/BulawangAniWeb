<template>
    <div class="vouchers">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Vouchers</h1>
        <div class="header-actions">
          <button class="btn-secondary" @click="exportVouchers">
            <i class="fas fa-download"></i> Export
          </button>
          <button class="btn-primary" @click="createVoucher">
            <i class="fas fa-plus"></i> Create Voucher
          </button>
        </div>
      </div>

      <!-- Stats Banner -->
      <div class="stats-banner">
        <div class="stat-item">
          <span class="stat-label">Total Vouchers:</span>
          <span class="stat-value">{{ totalVouchers }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Active:</span>
          <span class="stat-value">{{ activeVouchers }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Redeemed:</span>
          <span class="stat-value">{{ redeemedVouchers }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Value:</span>
          <span class="stat-value">₱{{ formatCurrency(totalValue) }}</span>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <select v-model="selectedType" class="filter-select" @change="filterVouchers">
            <option value="all">All Types</option>
            <option value="gift-card">Gift Card</option>
            <option value="promo-code">Promo Code</option>
            <option value="reward">Reward Voucher</option>
          </select>
          
          <select v-model="selectedStatus" class="filter-select" @change="filterVouchers">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="redeemed">Redeemed</option>
            <option value="expired">Expired</option>
          </select>
          
          <select v-model="selectedSort" class="filter-select" @change="sortVouchers">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Value</option>
            <option value="lowest">Lowest Value</option>
          </select>
        </div>
        
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search vouchers..." 
            class="search-input"
            @input="searchVouchers"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>

      <!-- Vouchers Grid -->
      <div class="vouchers-grid">
        <div v-if="filteredVouchers.length === 0" class="empty-state">
          <i class="fas fa-gift"></i>
          <h3>No vouchers found</h3>
          <p>Create your first voucher to start rewarding your customers.</p>
        </div>

        <div 
          v-for="voucher in paginatedVouchers" 
          :key="voucher.id" 
          class="voucher-card"
          :class="getVoucherClasses(voucher)"
        >
          <!-- Voucher Header -->
          <div class="voucher-header">
            <div class="voucher-type">{{ voucher.type }}</div>
            <div class="voucher-status" :class="voucher.status">{{ voucher.status }}</div>
          </div>

          <!-- Voucher Value -->
          <div class="voucher-value">
            <div class="value-amount">₱{{ formatCurrency(voucher.value) }}</div>
            <div class="value-label">Voucher Value</div>
          </div>

          <!-- Voucher Code -->
          <div class="voucher-code">
            <div class="code-label">Code</div>
            <div class="code-value">{{ voucher.code }}</div>
            <button class="btn-copy" @click="copyCode(voucher.code)">
              <i class="fas fa-copy"></i>
            </button>
          </div>

          <!-- Voucher Details -->
          <div class="voucher-details">
            <div class="detail-item">
              <span class="detail-label">Valid From:</span>
              <span class="detail-value">{{ formatDate(voucher.startDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Valid Until:</span>
              <span class="detail-value">{{ formatDate(voucher.endDate) }}</span>
            </div>
            <div v-if="voucher.recipient" class="detail-item">
              <span class="detail-label">Recipient:</span>
              <span class="detail-value">{{ voucher.recipient }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Usage:</span>
              <span class="detail-value">{{ voucher.usedCount }} / {{ voucher.maxUses }}</span>
            </div>
          </div>

          <!-- Voucher Actions -->
          <div class="voucher-actions">
            <button class="btn-view" @click="viewVoucherDetails(voucher)">
              <i class="fas fa-eye"></i> Details
            </button>
            <button class="btn-redeem" v-if="voucher.status === 'active'" @click="redeemVoucher(voucher.id)">
              <i class="fas fa-gift"></i> Redeem
            </button>
            <button class="btn-edit" @click="editVoucher(voucher.id)">
              <i class="fas fa-edit"></i> Edit
            </button>
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

      <!-- Voucher Analytics -->
      <div class="analytics-section">
        <h3>Voucher Analytics</h3>
        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-chart-pie"></i>
            </div>
            <div class="analytics-content">
              <div class="analytics-title">Redemption Rate</div>
              <div class="analytics-value">{{ redemptionRate }}%</div>
              <div class="analytics-change" :class="redemptionChange >= 0 ? 'positive' : 'negative'">
                {{ redemptionChange >= 0 ? '+' : '' }}{{ redemptionChange }}% vs last month
              </div>
            </div>
          </div>
          
          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="analytics-content">
              <div class="analytics-title">Unique Recipients</div>
              <div class="analytics-value">{{ uniqueRecipients }}</div>
              <div class="analytics-change positive">
                {{ recipientGrowth }}% growth
              </div>
            </div>
          </div>
          
          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="analytics-content">
              <div class="analytics-title">Avg Order Value</div>
              <div class="analytics-value">₱{{ formatCurrency(avgOrderValue) }}</div>
              <div class="analytics-change positive">
                +{{ aovIncrease }}% with vouchers
              </div>
            </div>
          </div>
          
          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="analytics-content">
              <div class="analytics-title">Revenue Generated</div>
              <div class="analytics-value">₱{{ formatCurrency(revenueGenerated) }}</div>
              <div class="analytics-change positive">
                {{ revenueGrowth }}% from vouchers
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <div class="action-card" @click="createGiftCards">
            <div class="action-icon">
              <i class="fas fa-credit-card"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Bulk Gift Cards</div>
              <div class="action-subtitle">Create multiple gift cards</div>
            </div>
          </div>

          <div class="action-card" @click="createPromoCodes">
            <div class="action-icon">
              <i class="fas fa-tags"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Seasonal Promo</div>
              <div class="action-subtitle">Holiday and event promos</div>
            </div>
          </div>

          <div class="action-card" @click="createLoyaltyVouchers">
            <div class="action-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Loyalty Program</div>
              <div class="action-subtitle">Reward loyal customers</div>
            </div>
          </div>

          <div class="action-card" @click="importVouchers">
            <div class="action-icon">
              <i class="fas fa-file-import"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Import Vouchers</div>
              <div class="action-subtitle">Import from CSV</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Voucher Details Modal -->
      <div v-if="showVoucherModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3>Voucher Details</h3>
            <button class="btn-close" @click="closeVoucherModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-content">
            <div class="voucher-details-content">
              <div class="detail-section">
                <h4>Voucher Information</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Code:</span>
                    <span class="detail-value">{{ selectedVoucher?.code }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">{{ selectedVoucher?.type }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Value:</span>
                    <span class="detail-value">₱{{ formatCurrency(selectedVoucher?.value) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">{{ selectedVoucher?.status }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4>Validity Period</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Valid From:</span>
                    <span class="detail-value">{{ formatDate(selectedVoucher?.startDate) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Valid Until:</span>
                    <span class="detail-value">{{ formatDate(selectedVoucher?.endDate) }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4>Usage Information</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Max Uses:</span>
                    <span class="detail-value">{{ selectedVoucher?.maxUses }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Used Count:</span>
                    <span class="detail-value">{{ selectedVoucher?.usedCount }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Remaining:</span>
                    <span class="detail-value">{{ selectedVoucher?.maxUses - selectedVoucher?.usedCount }}</span>
                  </div>
                </div>
              </div>

              <div v-if="selectedVoucher?.recipient" class="detail-section">
                <h4>Recipient Information</h4>
                <div class="detail-item">
                  <span class="detail-label">Recipient:</span>
                  <span class="detail-value">{{ selectedVoucher?.recipient }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="closeVoucherModal">Close</button>
            <button class="btn-primary" v-if="selectedVoucher?.status === 'active'" @click="redeemVoucher(selectedVoucher?.id)">
              Redeem Voucher
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'Vouchers',
  components: {
    SellerLayout
  },
  setup() {
    const searchQuery = ref('')
    const selectedType = ref('all')
    const selectedStatus = ref('all')
    const selectedSort = ref('newest')
    const currentPage = ref(1)
    const itemsPerPage = 12
    const showVoucherModal = ref(false)
    const selectedVoucher = ref(null)

    // Mock voucher data
    const vouchers = ref([
      {
        id: 1,
        code: 'GIFT1000',
        type: 'gift-card',
        value: 1000,
        status: 'active',
        startDate: '2024-01-01T00:00:00',
        endDate: '2024-12-31T23:59:59',
        maxUses: 1,
        usedCount: 0,
        recipient: 'Maria Santos'
      },
      {
        id: 2,
        code: 'WELCOME25',
        type: 'promo-code',
        value: 25,
        status: 'active',
        startDate: '2024-01-01T00:00:00',
        endDate: '2024-06-30T23:59:59',
        maxUses: 100,
        usedCount: 45,
        recipient: null
      },
      {
        id: 3,
        code: 'LOYALTY500',
        type: 'reward',
        value: 500,
        status: 'redeemed',
        startDate: '2024-01-10T00:00:00',
        endDate: '2024-02-10T23:59:59',
        maxUses: 1,
        usedCount: 1,
        recipient: 'Juan Dela Cruz'
      },
      {
        id: 4,
        code: 'HOLIDAY20',
        type: 'promo-code',
        value: 20,
        status: 'expired',
        startDate: '2023-12-01T00:00:00',
        endDate: '2023-12-31T23:59:59',
        maxUses: 500,
        usedCount: 320,
        recipient: null
      },
      {
        id: 5,
        code: 'BIRTHDAY100',
        type: 'gift-card',
        value: 100,
        status: 'active',
        startDate: '2024-01-15T00:00:00',
        endDate: '2024-02-15T23:59:59',
        maxUses: 1,
        usedCount: 0,
        recipient: 'Ana Reyes'
      },
      {
        id: 6,
        code: 'FREESHIP100',
        type: 'promo-code',
        value: 100,
        status: 'active',
        startDate: '2024-01-01T00:00:00',
        endDate: '2024-03-31T23:59:59',
        maxUses: 200,
        usedCount: 78,
        recipient: null
      }
    ])

    const filteredVouchers = computed(() => {
      let filtered = vouchers.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(voucher => 
          voucher.code.toLowerCase().includes(query) ||
          voucher.type.toLowerCase().includes(query) ||
          voucher.recipient?.toLowerCase().includes(query)
        )
      }

      // Type filter
      if (selectedType.value !== 'all') {
        filtered = filtered.filter(voucher => voucher.type === selectedType.value)
      }

      // Status filter
      if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(voucher => voucher.status === selectedStatus.value)
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

    const paginatedVouchers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredVouchers.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredVouchers.value.length / itemsPerPage)
    })

    const totalVouchers = computed(() => vouchers.value.length)
    const activeVouchers = computed(() => {
      return vouchers.value.filter(v => v.status === 'active').length
    })
    const redeemedVouchers = computed(() => {
      return vouchers.value.filter(v => v.status === 'redeemed').length
    })
    const totalValue = computed(() => {
      return vouchers.value.reduce((total, voucher) => total + voucher.value, 0)
    })

    const redemptionRate = computed(() => {
      const totalVouchers = vouchers.value.length
      const redeemedVouchers = vouchers.value.filter(v => v.status === 'redeemed').length
      return totalVouchers > 0 ? Math.round((redeemedVouchers / totalVouchers) * 100) : 0
    })

    const redemptionChange = computed(() => 12.5)
    const uniqueRecipients = computed(() => {
      const recipients = new Set(vouchers.value.map(v => v.recipient).filter(r => r))
      return recipients.size
    })
    const recipientGrowth = computed(() => 8.3)
    const avgOrderValue = computed(() => 1850.50)
    const aovIncrease = computed(() => 15.2)
    const revenueGenerated = computed(() => 45000)
    const revenueGrowth = computed(() => 22.7)

    const getVoucherClasses = (voucher) => {
      return {
        'status-active': voucher.status === 'active',
        'status-redeemed': voucher.status === 'redeemed',
        'status-expired': voucher.status === 'expired'
      }
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

    const filterVouchers = () => {
      currentPage.value = 1
    }

    const searchVouchers = () => {
      currentPage.value = 1
    }

    const sortVouchers = () => {
      // Sorting is handled in computed property
    }

    const changePage = (page) => {
      currentPage.value = page
    }

    const copyCode = (code) => {
      navigator.clipboard.writeText(code)
      alert(`Voucher code "${code}" copied to clipboard!`)
    }

    const viewVoucherDetails = (voucher) => {
      selectedVoucher.value = voucher
      showVoucherModal.value = true
    }

    const closeVoucherModal = () => {
      showVoucherModal.value = false
      selectedVoucher.value = null
    }

    const redeemVoucher = (voucherId) => {
      const voucher = vouchers.value.find(v => v.id === voucherId)
      if (voucher && voucher.status === 'active') {
        voucher.status = 'redeemed'
        voucher.usedCount++
        alert(`Voucher ${voucher.code} has been redeemed!`)
      }
    }

    const editVoucher = (voucherId) => {
      alert(`Editing voucher: ${voucherId}`)
    }

    const createVoucher = () => {
      alert('Creating new voucher...')
    }

    const createGiftCards = () => {
      alert('Creating bulk gift cards...')
    }

    const createPromoCodes = () => {
      alert('Creating seasonal promo codes...')
    }

    const createLoyaltyVouchers = () => {
      alert('Creating loyalty program vouchers...')
    }

    const importVouchers = () => {
      alert('Importing vouchers from CSV...')
    }

    const exportVouchers = () => {
      alert('Exporting vouchers...')
    }

    return {
      searchQuery,
      selectedType,
      selectedStatus,
      selectedSort,
      currentPage,
      showVoucherModal,
      selectedVoucher,
      vouchers,
      filteredVouchers,
      paginatedVouchers,
      totalPages,
      totalVouchers,
      activeVouchers,
      redeemedVouchers,
      totalValue,
      redemptionRate,
      redemptionChange,
      uniqueRecipients,
      recipientGrowth,
      avgOrderValue,
      aovIncrease,
      revenueGenerated,
      revenueGrowth,
      getVoucherClasses,
      formatCurrency,
      formatDate,
      filterVouchers,
      searchVouchers,
      sortVouchers,
      changePage,
      copyCode,
      viewVoucherDetails,
      closeVoucherModal,
      redeemVoucher,
      editVoucher,
      createVoucher,
      createGiftCards,
      createPromoCodes,
      createLoyaltyVouchers,
      importVouchers,
      exportVouchers
    }
  }
}
</script>

<style scoped>
.vouchers {
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

.vouchers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.empty-state {
  grid-column: 1 / -1;
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

.voucher-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.voucher-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.voucher-card.status-active {
  border-left: 4px solid #10b981;
}

.voucher-card.status-redeemed {
  border-left: 4px solid #ef4444;
  opacity: 0.7;
}

.voucher-card.status-expired {
  border-left: 4px solid #9ca3af;
  opacity: 0.6;
}

.voucher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.voucher-type {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.voucher-status {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.voucher-status.active {
  background-color: #d1fae5;
  color: #065f46;
}

.voucher-status.redeemed {
  background-color: #fee2e2;
  color: #991b1b;
}

.voucher-status.expired {
  background-color: #f3f4f6;
  color: #6b7280;
}

.voucher-value {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.value-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.value-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}

.voucher-code {
  position: relative;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px dashed #e5e7eb;
}

.code-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

.code-value {
  font-family: 'Courier New', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: 2px;
}

.btn-copy {
  position: absolute;
  top: 1rem;
  right: 1rem;
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

.voucher-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.detail-value {
  font-weight: 500;
  color: #374151;
}

.voucher-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view,
.btn-redeem,
.btn-edit {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  border: 1px solid #d1d5db;
}

.btn-view {
  background-color: #6b7280;
  color: white;
  border-color: #6b7280;
}

.btn-view:hover {
  background-color: #4b5563;
  border-color: #4b5563;
}

.btn-redeem {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-redeem:hover {
  background-color: #059669;
  border-color: #059669;
}

.btn-edit {
  background-color: white;
  color: #374151;
  border-color: #d1d5db;
}

.btn-edit:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
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
  margin-bottom: 3rem;
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
  max-width: 600px;
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

.voucher-details-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-section h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  font-weight: 500;
  color: #374151;
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
  
  .vouchers-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>