<template>
  <div class="payout-history">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Payout History</h1>
      <div class="header-actions">
        <select v-model="selectedPeriod" class="period-selector" @change="filterPayouts">
          <option value="all">All Time</option>
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="this-year">This Year</option>
          <option value="last-year">Last Year</option>
        </select>
        <button class="btn-export" @click="exportPayouts">
          <i class="fas fa-download"></i> Export
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="card-icon total">
          <i class="fas fa-wallet"></i>
        </div>
        <div class="card-content">
          <div class="card-label">Total Payouts</div>
          <div class="card-value">₱{{ formatCurrency(totalPayouts) }}</div>
          <div class="card-change">{{ payoutCount }} transactions</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon pending">
          <i class="fas fa-clock"></i>
        </div>
        <div class="card-content">
          <div class="card-label">Pending Payouts</div>
          <div class="card-value">₱{{ formatCurrency(pendingPayouts) }}</div>
          <div class="card-change">{{ pendingCount }} transactions</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon average">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="card-content">
          <div class="card-label">Average Payout</div>
          <div class="card-value">₱{{ formatCurrency(averagePayout) }}</div>
          <div class="card-change">per transaction</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon fees">
          <i class="fas fa-percentage"></i>
        </div>
        <div class="card-content">
          <div class="card-label">Total Fees</div>
          <div class="card-value">-₱{{ formatCurrency(totalFees) }}</div>
          <div class="card-change">Platform fees</div>
        </div>
      </div>
    </div>

    <!-- Payouts Table -->
    <div class="payouts-section">
      <h3>Payout Transactions</h3>
      <div class="payouts-table">
        <div class="table-header">
          <div class="table-cell">Date</div>
          <div class="table-cell">Amount</div>
          <div class="table-cell">Method</div>
          <div class="table-cell">Status</div>
          <div class="table-cell">Reference</div>
          <div class="table-cell">Actions</div>
        </div>

        <div v-if="filteredPayouts.length === 0" class="empty-state">
          <i class="fas fa-wallet"></i>
          <h3>No payouts found</h3>
          <p>No payout transactions match your current filters.</p>
        </div>

        <div 
          v-for="payout in paginatedPayouts" 
          :key="payout.id" 
          class="table-row"
          :class="payout.status"
        >
          <div class="table-cell">
            <div class="payout-date">{{ formatDate(payout.date) }}</div>
            <div class="payout-time">{{ formatTime(payout.date) }}</div>
          </div>
          <div class="table-cell">
            <div class="payout-amount">₱{{ formatCurrency(payout.amount) }}</div>
            <div class="payout-net">Net: ₱{{ formatCurrency(payout.netAmount) }}</div>
          </div>
          <div class="table-cell">
            <span class="method-badge">{{ payout.method }}</span>
          </div>
          <div class="table-cell">
            <span class="status-badge" :class="payout.status">{{ payout.status }}</span>
          </div>
          <div class="table-cell">{{ payout.reference }}</div>
          <div class="table-cell">
            <div class="action-buttons">
              <button class="btn-view" @click="viewPayoutDetails(payout)">
                <i class="fas fa-eye"></i> Details
              </button>
              <button class="btn-receipt" @click="downloadReceipt(payout)">
                <i class="fas fa-receipt"></i> Receipt
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
    </div>

    <!-- Payout Methods -->
    <div class="methods-section">
      <h3>Payout Methods</h3>
      <div class="methods-grid">
        <div 
          v-for="method in payoutMethods" 
          :key="method.id" 
          class="method-card"
          :class="{ active: method.active }"
        >
          <div class="method-header">
            <div class="method-info">
              <h4>{{ method.name }}</h4>
              <p>{{ method.description }}</p>
            </div>
            <div class="method-status">
              <span :class="['status-indicator', method.active ? 'active' : 'inactive']"></span>
              <span>{{ method.active ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
          
          <div class="method-details">
            <div class="detail-item">
              <span class="detail-label">Account:</span>
              <span class="detail-value">{{ method.account }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Processing Time:</span>
              <span class="detail-value">{{ method.processingTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Fees:</span>
              <span class="detail-value">{{ method.fees }}</span>
            </div>
          </div>
          
          <div class="method-actions">
            <button class="btn-primary" @click="setPrimaryMethod(method.id)">
              Set Primary
            </button>
            <button class="btn-secondary" @click="editMethod(method.id)">
              Edit
            </button>
          </div>
        </div>
      </div>
      
      <button class="btn-add-method" @click="addNewMethod">
        <i class="fas fa-plus"></i> Add New Method
      </button>
    </div>

    <!-- Payout Schedule -->
    <div class="schedule-section">
      <h3>Payout Schedule</h3>
      <div class="schedule-card">
        <div class="schedule-info">
          <div class="schedule-item">
            <span class="schedule-label">Schedule Type:</span>
            <span class="schedule-value">{{ schedule.type }}</span>
          </div>
          <div class="schedule-item">
            <span class="schedule-label">Next Payout:</span>
            <span class="schedule-value">{{ schedule.nextPayout }}</span>
          </div>
          <div class="schedule-item">
            <span class="schedule-label">Minimum Amount:</span>
            <span class="schedule-value">₱{{ formatCurrency(schedule.minimumAmount) }}</span>
          </div>
          <div class="schedule-item">
            <span class="schedule-label">Processing Time:</span>
            <span class="schedule-value">{{ schedule.processingTime }}</span>
          </div>
        </div>
        
        <div class="schedule-actions">
          <button class="btn-edit" @click="editSchedule">
            <i class="fas fa-edit"></i> Edit Schedule
          </button>
        </div>
      </div>
    </div>

    <!-- Payout Details Modal -->
    <div v-if="showPayoutModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Payout Details</h3>
          <button class="btn-close" @click="closePayoutModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="payout-details-content">
            <div class="detail-section">
              <h4>Payout Information</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Reference:</span>
                  <span class="detail-value">{{ selectedPayout?.reference }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">{{ formatDate(selectedPayout?.date) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Method:</span>
                  <span class="detail-value">{{ selectedPayout?.method }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">{{ selectedPayout?.status }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Financial Details</h4>
              <div class="financial-breakdown">
                <div class="breakdown-item">
                  <span class="breakdown-label">Gross Amount:</span>
                  <span class="breakdown-value">₱{{ formatCurrency(selectedPayout?.amount) }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">Platform Fees:</span>
                  <span class="breakdown-value">-₱{{ formatCurrency(selectedPayout?.fees) }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">Processing Fees:</span>
                  <span class="breakdown-value">-₱{{ formatCurrency(selectedPayout?.processingFees) }}</span>
                </div>
                <div class="breakdown-item total">
                  <span class="breakdown-label">Net Amount:</span>
                  <span class="breakdown-value">₱{{ formatCurrency(selectedPayout?.netAmount) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Orders Included</h4>
              <div class="orders-list">
                <div v-for="order in selectedPayout?.orders" :key="order.id" class="order-item">
                  <span class="order-id">#{{ order.id }}</span>
                  <span class="order-date">{{ formatDate(order.date) }}</span>
                  <span class="order-amount">₱{{ formatCurrency(order.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closePayoutModal">Close</button>
          <button class="btn-primary" @click="downloadReceipt(selectedPayout)">Download Receipt</button>
        </div>
      </div>
    </div>

    <!-- Add Method Modal -->
    <div v-if="showMethodModal" class="modal-overlay" @click="closeMethodModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Add Payout Method</h2>
          <button class="modal-close" @click="closeMethodModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="method-type">Method Type:</label>
            <select v-model="newMethod.type" id="method-type" class="form-input">
              <option value="bank">Bank Transfer</option>
              <option value="gcash">GCash</option>
              <option value="paypal">PayPal</option>
              <option value="paymaya">PayMaya</option>
            </select>
          </div>

          <div v-if="newMethod.type === 'bank'" class="form-group">
            <label for="bank-name">Bank Name:</label>
            <input v-model="newMethod.bankName" id="bank-name" type="text" class="form-input" placeholder="e.g., BDO, BPI, RCBC">
          </div>

          <div class="form-group">
            <label for="account-name">Account Name:</label>
            <input v-model="newMethod.accountName" id="account-name" type="text" class="form-input" placeholder="Full account name">
          </div>

          <div class="form-group">
            <label for="account-number">Account Number:</label>
            <input v-model="newMethod.accountNumber" id="account-number" type="text" class="form-input" placeholder="Account or phone number">
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeMethodModal">Cancel</button>
          <button class="btn-primary" @click="saveNewMethod">Add Method</button>
        </div>
      </div>
    </div>

    <!-- Edit Schedule Modal -->
    <div v-if="showScheduleModal" class="modal-overlay" @click="closeScheduleModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Edit Payout Schedule</h2>
          <button class="modal-close" @click="closeScheduleModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="schedule-type">Schedule Type:</label>
            <select v-model="editingSchedule.type" id="schedule-type" class="form-input">
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly (15th)">Monthly (15th)</option>
              <option value="Monthly (30th)">Monthly (30th)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="minimum-amount">Minimum Amount (₱):</label>
            <input v-model.number="editingSchedule.minimumAmount" id="minimum-amount" type="number" class="form-input" placeholder="5000">
          </div>

          <div class="form-group">
            <label for="processing-time">Processing Time:</label>
            <select v-model="editingSchedule.processingTime" id="processing-time" class="form-input">
              <option value="1-3 business days">1-3 business days</option>
              <option value="2-5 business days">2-5 business days</option>
              <option value="5-7 business days">5-7 business days</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeScheduleModal">Cancel</button>
          <button class="btn-primary" @click="saveSchedule">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Edit Payout Method Modal -->
    <div v-if="showEditMethodModal" class="modal-overlay" @click="closeEditMethodModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Edit Payout Method</h2>
          <button class="modal-close" @click="closeEditMethodModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="edit-method-type">Method Type:</label>
            <select v-model="editingMethod.type" id="edit-method-type" class="form-input">
              <option value="bank">Bank Transfer</option>
              <option value="gcash">GCash</option>
              <option value="paypal">PayPal</option>
              <option value="paymaya">PayMaya</option>
            </select>
          </div>

          <div v-if="editingMethod.type === 'bank'" class="form-group">
            <label for="edit-bank-name">Bank Name:</label>
            <input v-model="editingMethod.bankName" id="edit-bank-name" type="text" class="form-input" placeholder="e.g., BDO, BPI, RCBC">
          </div>

          <div class="form-group">
            <label for="edit-account-name">Account Name:</label>
            <input v-model="editingMethod.accountName" id="edit-account-name" type="text" class="form-input" placeholder="Full account name">
          </div>

          <div class="form-group">
            <label for="edit-account-number">Account Number:</label>
            <input v-model="editingMethod.accountNumber" id="edit-account-number" type="text" class="form-input" placeholder="Account or phone number">
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeEditMethodModal">Cancel</button>
          <button class="btn-primary" @click="saveEditMethod">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'PayoutHistory',
  setup() {
    const selectedPeriod = ref('all')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const showPayoutModal = ref(false)
    const selectedPayout = ref(null)
    const showMethodModal = ref(false)
    const showScheduleModal = ref(false)
    const showEditMethodModal = ref(false)
    const newMethod = ref({
      type: 'bank',
      accountName: '',
      accountNumber: '',
      bankName: ''
    })
    const editingMethod = ref({
      id: null,
      type: 'bank',
      accountName: '',
      accountNumber: '',
      bankName: ''
    })
    const editingSchedule = ref({
      type: 'Monthly (15th)',
      minimumAmount: 5000,
      processingTime: '1-3 business days'
    })

    // Mock payout data
    const payouts = ref([
      {
        id: 1,
        date: '2024-01-15T10:30:00',
        amount: 25000.00,
        netAmount: 24500.00,
        fees: 300.00,
        processingFees: 200.00,
        method: 'Bank Transfer',
        status: 'completed',
        reference: 'PYT-2024-001',
        orders: [
          { id: 'ORD-2024-001', date: '2024-01-10T14:20:00', amount: 12000.00 },
          { id: 'ORD-2024-002', date: '2024-01-12T09:45:00', amount: 13000.00 }
        ]
      },
      {
        id: 2,
        date: '2024-01-01T14:20:00',
        amount: 32000.00,
        netAmount: 31360.00,
        fees: 400.00,
        processingFees: 240.00,
        method: 'GCash',
        status: 'completed',
        reference: 'PYT-2023-012',
        orders: [
          { id: 'ORD-2023-125', date: '2023-12-25T16:30:00', amount: 18000.00 },
          { id: 'ORD-2023-126', date: '2023-12-28T11:15:00', amount: 14000.00 }
        ]
      },
      {
        id: 3,
        date: '2023-12-15T09:45:00',
        amount: 18500.00,
        netAmount: 18130.00,
        fees: 220.00,
        processingFees: 150.00,
        method: 'Bank Transfer',
        status: 'completed',
        reference: 'PYT-2023-011',
        orders: [
          { id: 'ORD-2023-110', date: '2023-12-10T13:20:00', amount: 8500.00 },
          { id: 'ORD-2023-111', date: '2023-12-12T15:45:00', amount: 10000.00 }
        ]
      },
      {
        id: 4,
        date: '2024-01-20T00:00:00',
        amount: 15000.00,
        netAmount: 14700.00,
        fees: 180.00,
        processingFees: 120.00,
        method: 'Bank Transfer',
        status: 'pending',
        reference: 'PYT-2024-002',
        orders: [
          { id: 'ORD-2024-003', date: '2024-01-18T10:30:00', amount: 7500.00 },
          { id: 'ORD-2024-004', date: '2024-01-19T14:20:00', amount: 7500.00 }
        ]
      }
    ])

    const payoutMethods = ref([
      {
        id: 1,
        name: 'Bank Transfer',
        description: 'Direct bank transfer to your account',
        account: '****1234',
        processingTime: '1-3 business days',
        fees: 'Free',
        active: true
      },
      {
        id: 2,
        name: 'GCash',
        description: 'Instant transfer to your GCash wallet',
        account: '0917****1234',
        processingTime: 'Instant',
        fees: '₱15 per transaction',
        active: false
      },
      {
        id: 3,
        name: 'PayPal',
        description: 'Transfer to your PayPal account',
        account: 'user@example.com',
        processingTime: '1-2 business days',
        fees: '2.9% + ₱15',
        active: false
      }
    ])

    const schedule = {
      type: 'Monthly (15th)',
      nextPayout: 'January 15, 2024',
      minimumAmount: 5000,
      processingTime: '1-3 business days'
    }

    const filteredPayouts = computed(() => {
      let filtered = payouts.value

      // Filter by period
      if (selectedPeriod.value !== 'all') {
        const now = new Date()
        filtered = filtered.filter(payout => {
          const payoutDate = new Date(payout.date)
          
          switch (selectedPeriod.value) {
            case 'this-month':
              return payoutDate.getMonth() === now.getMonth() && payoutDate.getFullYear() === now.getFullYear()
            case 'last-month':
              const lastMonth = new Date(now)
              lastMonth.setMonth(now.getMonth() - 1)
              return payoutDate.getMonth() === lastMonth.getMonth() && payoutDate.getFullYear() === lastMonth.getFullYear()
            case 'this-year':
              return payoutDate.getFullYear() === now.getFullYear()
            case 'last-year':
              return payoutDate.getFullYear() === now.getFullYear() - 1
            default:
              return true
          }
        })
      }

      return filtered
    })

    const paginatedPayouts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredPayouts.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredPayouts.value.length / itemsPerPage)
    })

    const totalPayouts = computed(() => {
      return filteredPayouts.value.reduce((total, payout) => total + payout.netAmount, 0)
    })

    const pendingPayouts = computed(() => {
      return filteredPayouts.value
        .filter(p => p.status === 'pending')
        .reduce((total, payout) => total + payout.netAmount, 0)
    })

    const pendingCount = computed(() => {
      return filteredPayouts.value.filter(p => p.status === 'pending').length
    })

    const payoutCount = computed(() => filteredPayouts.value.length)
    const averagePayout = computed(() => {
      return payoutCount.value > 0 ? totalPayouts.value / payoutCount.value : 0
    })
    const totalFees = computed(() => {
      return filteredPayouts.value.reduce((total, payout) => total + payout.fees + payout.processingFees, 0)
    })

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

    const formatTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const filterPayouts = () => {
      currentPage.value = 1
    }

    const changePage = (page) => {
      currentPage.value = page
    }

    const viewPayoutDetails = (payout) => {
      selectedPayout.value = payout
      showPayoutModal.value = true
    }

    const closePayoutModal = () => {
      showPayoutModal.value = false
      selectedPayout.value = null
    }

    const downloadReceipt = (payout) => {
      alert(`Downloading receipt for payout ${payout.reference}...`)
    }

    const setPrimaryMethod = (methodId) => {
      payoutMethods.value.forEach(method => {
        method.active = method.id === methodId
      })
      alert('Primary payout method updated!')
    }

    const editMethod = (methodId) => {
      const method = payoutMethods.value.find(m => m.id === methodId)
      if (method) {
        editingMethod.value = { ...method }
        showEditMethodModal.value = true
      }
    }

    const closeEditMethodModal = () => {
      showEditMethodModal.value = false
      editingMethod.value = {
        id: null,
        type: 'bank',
        accountName: '',
        accountNumber: '',
        bankName: ''
      }
    }

    const saveEditMethod = () => {
      const methodIndex = payoutMethods.value.findIndex(m => m.id === editingMethod.value.id)
      if (methodIndex > -1) {
        payoutMethods.value[methodIndex] = { ...editingMethod.value }
      }
      closeEditMethodModal()
    }

    const addNewMethod = () => {
      showMethodModal.value = true
      newMethod.value = {
        type: 'bank',
        accountName: '',
        accountNumber: '',
        bankName: ''
      }
    }

    const saveNewMethod = () => {
      if (newMethod.value.accountName && newMethod.value.accountNumber) {
        const method = {
          id: payoutMethods.value.length + 1,
          type: newMethod.value.type,
          accountName: newMethod.value.accountName,
          accountNumber: newMethod.value.accountNumber,
          bankName: newMethod.value.bankName || 'Bank',
          isPrimary: payoutMethods.value.length === 0
        }
        payoutMethods.value.push(method)
        closeMethodModal()
      }
    }

    const closeMethodModal = () => {
      showMethodModal.value = false
      newMethod.value = {
        type: 'bank',
        accountName: '',
        accountNumber: '',
        bankName: ''
      }
    }

    const editSchedule = () => {
      editingSchedule.value = {
        type: 'Monthly (15th)',
        minimumAmount: 5000,
        processingTime: '1-3 business days'
      }
      showScheduleModal.value = true
    }

    const closeScheduleModal = () => {
      showScheduleModal.value = false
    }

    const saveSchedule = () => {
      // Update schedule with edited values
      closeScheduleModal()
    }

    const exportPayouts = () => {
      alert('Exporting payout history...')
    }

    return {
      selectedPeriod,
      currentPage,
      showPayoutModal,
      selectedPayout,
      showMethodModal,
      newMethod,
      payouts,
      payoutMethods,
      schedule,
      filteredPayouts,
      paginatedPayouts,
      totalPages,
      totalPayouts,
      pendingPayouts,
      pendingCount,
      payoutCount,
      averagePayout,
      totalFees,
      formatCurrency,
      formatDate,
      formatTime,
      filterPayouts,
      changePage,
      viewPayoutDetails,
      closePayoutModal,
      downloadReceipt,
      setPrimaryMethod,
      editMethod,
      closeEditMethodModal,
      saveEditMethod,
      editingMethod,
      showEditMethodModal,
      addNewMethod,
      saveNewMethod,
      closeMethodModal,
      editSchedule,
      closeScheduleModal,
      saveSchedule,
      editingSchedule,
      showScheduleModal,
      exportPayouts
    }
  }
}
</script>

<style scoped>
.payout-history {
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
  align-items: center;
}

.period-selector {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.btn-export {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.summary-card {
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

.summary-card:hover {
  transform: translateY(-2px);
}

.summary-card.total { border-left: 4px solid #3b82f6; }
.summary-card.pending { border-left: 4px solid #f59e0b; }
.summary-card.average { border-left: 4px solid #8b5cf6; }
.summary-card.fees { border-left: 4px solid #ef4444; }

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

.card-icon.pending { background-color: #f59e0b; }
.card-icon.average { background-color: #8b5cf6; }
.card-icon.fees { background-color: #ef4444; }

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
  margin-bottom: 0.25rem;
}

.card-change {
  font-size: 0.75rem;
  color: #6b7280;
}

.payouts-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.payouts-table {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
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

.payout-date {
  font-weight: 600;
  color: #1f2937;
}

.payout-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.payout-amount {
  font-weight: 600;
  color: #1f2937;
}

.payout-net {
  font-size: 0.75rem;
  color: #6b7280;
}

.method-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #dbeafe;
  color: #1e40af;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.completed { background-color: #d1fae5; color: #065f46; }
.status-badge.pending { background-color: #fef3c7; color: #92400e; }
.status-badge.processing { background-color: #dbeafe; color: #1e40af; }

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-view,
.btn-receipt {
  background-color: #6b7280;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-view:hover {
  background-color: #4b5563;
}

.btn-receipt:hover {
  background-color: #4b5563;
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

.methods-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.method-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s;
}

.method-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.method-card.active {
  border-left: 4px solid #10b981;
}

.method-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.method-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.method-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.method-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ef4444;
}

.status-indicator.active {
  background-color: #10b981;
}

.method-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.method-actions {
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
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn-add-method {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-add-method:hover {
  background-color: #059669;
}

.schedule-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.schedule-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.schedule-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  min-width: 250px;
}

.schedule-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.schedule-value {
  font-weight: 600;
  color: #1f2937;
}

.schedule-actions {
  display: flex;
  align-items: flex-start;
}

.btn-edit {
  background: none;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
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
  background: white;
  border-radius: 0.75rem;
  padding: 0;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-body {
  padding: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.payout-details-content {
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

.financial-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.breakdown-item.total {
  background-color: #f3f4f6;
  font-weight: 700;
}

.breakdown-label {
  font-weight: 500;
  color: #374151;
}

.breakdown-value {
  font-weight: 700;
  color: #1f2937;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.order-id {
  font-weight: 600;
  color: #1f2937;
}

.order-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.order-amount {
  font-weight: 600;
  color: #1f2937;
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
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .schedule-card {
    flex-direction: column;
    gap: 1rem;
  }
  
  .schedule-item {
    min-width: auto;
  }
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>