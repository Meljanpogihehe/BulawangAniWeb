<template>
  <div class="earnings">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Earnings</h1>
      <div class="header-actions">
        <select v-model="selectedPeriod" class="period-selector" @change="updateEarnings">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="365">Last year</option>
        </select>
        <button class="btn-export" @click="exportEarnings">
          <i class="fas fa-download"></i> Export
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="card-icon revenue">
          <i class="fas fa-coins"></i>
        </div>
        <div class="card-content">
          <div class="card-label">Total Revenue</div>
          <div class="card-value">₱{{ formatCurrency(totalRevenue) }}</div>
          <div class="card-change" :class="revenueChange >= 0 ? 'positive' : 'negative'">
            {{ revenueChange >= 0 ? '+' : '' }}{{ revenueChange }}% vs previous period
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon fees">
          <i class="fas fa-percentage"></i>
        </div>
        <div class="card-content">
          <div class="card-label">Platform Fees</div>
          <div class="card-value">-₱{{ formatCurrency(totalFees) }}</div>
          <div class="card-change">Platform commission</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon net">
          <i class="fas fa-wallet"></i>
        </div>
        <div class="card-content">
          <div class="card-label">Net Earnings</div>
          <div class="card-value">₱{{ formatCurrency(netEarnings) }}</div>
          <div class="card-change" :class="netChange >= 0 ? 'positive' : 'negative'">
            {{ netChange >= 0 ? '+' : '' }}{{ netChange }}% vs previous period
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon balance">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="card-content">
          <div class="card-label">Available Balance</div>
          <div class="card-value">₱{{ formatCurrency(availableBalance) }}</div>
          <div class="card-change">Ready for payout</div>
        </div>
      </div>
    </div>

    <!-- Earnings Chart -->
    <div class="chart-section">
      <h3>Earnings Over Time</h3>
      <div class="chart-container">
        <canvas ref="earningsChart"></canvas>
      </div>
    </div>

    <!-- Payout History -->
    <div class="payout-section">
      <h3>Payout History</h3>
      <div class="payout-table">
        <div class="table-header">
          <div class="table-cell">Date</div>
          <div class="table-cell">Amount</div>
          <div class="table-cell">Method</div>
          <div class="table-cell">Status</div>
          <div class="table-cell">Reference</div>
        </div>
        
        <div v-for="payout in payoutHistory" :key="payout.id" class="table-row">
          <div class="table-cell">{{ formatDate(payout.date) }}</div>
          <div class="table-cell">₱{{ formatCurrency(payout.amount) }}</div>
          <div class="table-cell">{{ payout.method }}</div>
          <div class="table-cell">
            <span class="status-badge" :class="payout.status">{{ payout.status }}</span>
          </div>
          <div class="table-cell">{{ payout.reference }}</div>
        </div>
      </div>
    </div>

    <!-- Earnings Breakdown -->
    <div class="breakdown-section">
      <h3>Earnings Breakdown</h3>
      <div class="breakdown-grid">
        <div class="breakdown-card">
          <div class="breakdown-header">
            <h4>By Product Category</h4>
            <div class="breakdown-chart">
              <canvas ref="categoryChart"></canvas>
            </div>
          </div>
          <div class="breakdown-list">
            <div v-for="category in categoryBreakdown" :key="category.name" class="breakdown-item">
              <div class="breakdown-info">
                <span class="breakdown-name">{{ category.name }}</span>
                <span class="breakdown-percent">{{ category.percent }}%</span>
              </div>
              <div class="breakdown-value">₱{{ formatCurrency(category.amount) }}</div>
            </div>
          </div>
        </div>

        <div class="breakdown-card">
          <div class="breakdown-header">
            <h4>By Order Status</h4>
            <div class="breakdown-chart">
              <canvas ref="statusChart"></canvas>
            </div>
          </div>
          <div class="breakdown-list">
            <div v-for="status in statusBreakdown" :key="status.name" class="breakdown-item">
              <div class="breakdown-info">
                <span class="breakdown-name">{{ status.name }}</span>
                <span class="breakdown-percent">{{ status.percent }}%</span>
              </div>
              <div class="breakdown-value">₱{{ formatCurrency(status.amount) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fee Details -->
    <div class="fee-section">
      <h3>Fee Details</h3>
      <div class="fee-table">
        <div class="table-header">
          <div class="table-cell">Fee Type</div>
          <div class="table-cell">Description</div>
          <div class="table-cell">Rate</div>
          <div class="table-cell">Amount</div>
        </div>
        
        <div v-for="fee in feeDetails" :key="fee.type" class="table-row">
          <div class="table-cell">{{ fee.type }}</div>
          <div class="table-cell">{{ fee.description }}</div>
          <div class="table-cell">{{ fee.rate }}</div>
          <div class="table-cell">-₱{{ formatCurrency(fee.amount) }}</div>
        </div>
        
        <div class="table-row total-row">
          <div class="table-cell" colspan="3">Total Fees</div>
          <div class="table-cell">-₱{{ formatCurrency(totalFees) }}</div>
        </div>
      </div>
    </div>

    <!-- Payout Settings -->
    <div class="payout-settings">
      <h3>Payout Settings</h3>
      <div class="settings-card">
        <div class="setting-item">
          <div class="setting-info">
            <h4>Payout Method</h4>
            <p>Set your preferred payout method</p>
          </div>
          <div class="setting-value">
            <span class="method-badge">{{ payoutSettings.method }}</span>
            <button class="btn-edit" @click="editPayoutMethod">Edit</button>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <h4>Minimum Payout</h4>
            <p>Minimum amount for automatic payout</p>
          </div>
          <div class="setting-value">
            <span>₱{{ formatCurrency(payoutSettings.minimum) }}</span>
            <button class="btn-edit" @click="editMinimumPayout">Edit</button>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <h4>Payout Schedule</h4>
            <p>When you receive your payouts</p>
          </div>
          <div class="setting-value">
            <span>{{ payoutSettings.schedule }}</span>
            <button class="btn-edit" @click="editPayoutSchedule">Edit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Earnings',
  setup() {
    const selectedPeriod = ref(30)
    const earningsChart = ref(null)
    const categoryChart = ref(null)
    const statusChart = ref(null)
    let earningsChartInstance = null
    let categoryChartInstance = null
    let statusChartInstance = null

    // Mock data
    const totalRevenue = 156750.50
    const revenueChange = 12.5
    const totalFees = 12540.04
    const netEarnings = 144210.46
    const netChange = 15.2
    const availableBalance = 85000.00

    const payoutHistory = [
      {
        id: 1,
        date: '2024-01-10T10:30:00',
        amount: 25000.00,
        method: 'Bank Transfer',
        status: 'completed',
        reference: 'PYT-2024-001'
      },
      {
        id: 2,
        date: '2023-12-15T14:20:00',
        amount: 32000.00,
        method: 'GCash',
        status: 'completed',
        reference: 'PYT-2023-012'
      },
      {
        id: 3,
        date: '2023-11-10T09:45:00',
        amount: 18500.00,
        method: 'Bank Transfer',
        status: 'completed',
        reference: 'PYT-2023-011'
      }
    ]

    const categoryBreakdown = [
      { name: 'Bags & Accessories', amount: 45000, percent: 31.2 },
      { name: 'Handicrafts', amount: 38000, percent: 26.4 },
      { name: 'Home & Living', amount: 32000, percent: 22.2 },
      { name: 'Kitchen', amount: 18000, percent: 12.5 },
      { name: 'Fashion', amount: 11000, percent: 7.6 }
    ]

    const statusBreakdown = [
      { name: 'Completed', amount: 142000, percent: 98.5 },
      { name: 'Processing', amount: 2210, percent: 1.5 },
      { name: 'Cancelled', amount: 0, percent: 0 }
    ]

    const feeDetails = [
      { type: 'Platform Commission', description: '10% of order total', rate: '10%', amount: 12540.04 },
      { type: 'Payment Processing', description: 'Credit card processing fee', rate: '2.9% + ₱15', amount: 1850.25 },
      { type: 'Service Fee', description: 'Monthly service fee', rate: '₱500/month', amount: 500.00 }
    ]

    const payoutSettings = {
      method: 'Bank Transfer',
      minimum: 5000,
      schedule: 'Monthly (15th)'
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

    const createEarningsChart = () => {
      if (!earningsChart.value) return

      const ctx = earningsChart.value.getContext('2d')
      
      if (earningsChartInstance) {
        earningsChartInstance.destroy()
      }

      earningsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: generateDateLabels(selectedPeriod.value),
          datasets: [{
            label: 'Net Earnings',
            data: generateRandomData(selectedPeriod.value),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }, {
            label: 'Revenue',
            data: generateRandomData(selectedPeriod.value, 1.5),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#e5e7eb'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      })
    }

    const createCategoryChart = () => {
      if (!categoryChart.value) return

      const ctx = categoryChart.value.getContext('2d')
      
      if (categoryChartInstance) {
        categoryChartInstance.destroy()
      }

      categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryBreakdown.map(c => c.name),
          datasets: [{
            data: categoryBreakdown.map(c => c.amount),
            backgroundColor: [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }

    const createStatusChart = () => {
      if (!statusChart.value) return

      const ctx = statusChart.value.getContext('2d')
      
      if (statusChartInstance) {
        statusChartInstance.destroy()
      }

      statusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: statusBreakdown.map(s => s.name),
          datasets: [{
            data: statusBreakdown.map(s => s.amount),
            backgroundColor: [
              '#10b981', '#f59e0b', '#ef4444'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }

    const generateDateLabels = (days) => {
      const labels = []
      const today = new Date()
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        labels.push(date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }))
      }
      return labels
    }

    const generateRandomData = (days, multiplier = 1) => {
      return Array.from({ length: days }, () => Math.floor(Math.random() * 2000 * multiplier) + 500 * multiplier)
    }

    const updateEarnings = () => {
      createEarningsChart()
      createCategoryChart()
      createStatusChart()
    }

    const exportEarnings = () => {
      alert('Exporting earnings report...')
    }

    const editPayoutMethod = () => {
      alert('Editing payout method...')
    }

    const editMinimumPayout = () => {
      alert('Editing minimum payout...')
    }

    const editPayoutSchedule = () => {
      alert('Editing payout schedule...')
    }

    onMounted(() => {
      createEarningsChart()
      createCategoryChart()
      createStatusChart()
    })

    onUnmounted(() => {
      if (earningsChartInstance) {
        earningsChartInstance.destroy()
      }
      if (categoryChartInstance) {
        categoryChartInstance.destroy()
      }
      if (statusChartInstance) {
        statusChartInstance.destroy()
      }
    })

    return {
      selectedPeriod,
      earningsChart,
      categoryChart,
      statusChart,
      totalRevenue,
      revenueChange,
      totalFees,
      netEarnings,
      netChange,
      availableBalance,
      payoutHistory,
      categoryBreakdown,
      statusBreakdown,
      feeDetails,
      payoutSettings,
      formatCurrency,
      formatDate,
      updateEarnings,
      exportEarnings,
      editPayoutMethod,
      editMinimumPayout,
      editPayoutSchedule
    }
  }
}
</script>

<style scoped>
.earnings {
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

.summary-card.revenue { border-left: 4px solid #3b82f6; }
.summary-card.fees { border-left: 4px solid #ef4444; }
.summary-card.net { border-left: 4px solid #10b981; }
.summary-card.balance { border-left: 4px solid #8b5cf6; }

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

.card-icon.fees { background-color: #ef4444; }
.card-icon.net { background-color: #10b981; }
.card-icon.balance { background-color: #8b5cf6; }

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
  margin-bottom: 0.5rem;
}

.card-change {
  font-size: 0.75rem;
  font-weight: 600;
}

.card-change.positive { color: #10b981; }
.card-change.negative { color: #ef4444; }

.chart-section {
  margin-bottom: 3rem;
}

.chart-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.chart-container {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  height: 300px;
}

.payout-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.payout-table {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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

.breakdown-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.breakdown-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.breakdown-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.breakdown-chart {
  width: 120px;
  height: 120px;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.breakdown-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.breakdown-name {
  font-weight: 600;
  color: #1f2937;
}

.breakdown-percent {
  font-size: 0.75rem;
  color: #6b7280;
}

.breakdown-value {
  font-weight: 700;
  color: #1f2937;
}

.fee-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.fee-table {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.total-row {
  background-color: #f9fafb;
  font-weight: 700;
}

.payout-settings h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.settings-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.setting-info h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.setting-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.setting-value {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.method-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #dbeafe;
  color: #1e40af;
}

.btn-edit {
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

/* Responsive styles */
@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .breakdown-grid {
    grid-template-columns: 1fr;
  }
  
  .breakdown-chart {
    width: 100px;
    height: 100px;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>