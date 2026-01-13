<template>
    <div class="payouts-page">
      <div class="page-header">
        <h1>Payout Management</h1>
        <p>Manage seller payouts and commissions</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <div class="filters">
            <select v-model="filterStatus">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="failed">Failed</option>
            </select>
            <select v-model="filterPeriod">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search sellers..." />
            <button class="btn-process">Process Payouts</button>
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <div class="metric-value">₱{{ totalPayouts }}</div>
              <div class="metric-label">Total Payouts</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🏪</div>
            <div class="metric-content">
              <div class="metric-value">{{ totalSellers }}</div>
              <div class="metric-label">Sellers</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <div class="metric-value">{{ avgCommission }}%</div>
              <div class="metric-label">Avg Commission</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">⏳</div>
            <div class="metric-content">
              <div class="metric-value">{{ pendingPayouts }}</div>
              <div class="metric-label">Pending</div>
            </div>
          </div>
        </div>
        
        <div class="table-container">
          <table class="payouts-table">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Business Name</th>
                <th>Sales Amount</th>
                <th>Commission</th>
                <th>Payout Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payout in filteredPayouts" :key="payout.id">
                <td>
                  <div class="seller-info">
                    <div class="seller-name">{{ payout.seller }}</div>
                    <div class="seller-email">{{ payout.email }}</div>
                  </div>
                </td>
                <td>{{ payout.businessName }}</td>
                <td>₱{{ payout.salesAmount }}</td>
                <td>{{ payout.commission }}%</td>
                <td>₱{{ payout.payoutAmount }}</td>
                <td>
                  <span :class="['status-badge', payout.status.toLowerCase()]">
                    {{ payout.status }}
                  </span>
                </td>
                <td>{{ formatDate(payout.date) }}</td>
                <td>
                  <button class="btn-view">View</button>
                  <button class="btn-process" v-if="payout.status === 'Pending'">Process</button>
                  <button class="btn-cancel" v-if="payout.status === 'Pending'">Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Payouts',
  data() {
    return {
      filterStatus: 'all',
      filterPeriod: 'month',
      totalPayouts: 120000,
      totalSellers: 24,
      avgCommission: 12.5,
      pendingPayouts: 8,
      payouts: [
        { id: 1, seller: 'Maria Santos', email: 'maria@freshfarm.com', businessName: 'Fresh Farm Produce', salesAmount: 25000, commission: 12, payoutAmount: 22000, status: 'Processed', date: '2024-01-15' },
        { id: 2, seller: 'Juan Dela Cruz', email: 'juan@organicvalley.com', businessName: 'Organic Valley', salesAmount: 18000, commission: 10, payoutAmount: 16200, status: 'Processed', date: '2024-01-14' },
        { id: 3, seller: 'Ana Reyes', email: 'ana@greenfields.com', businessName: 'Green Fields', salesAmount: 15000, commission: 15, payoutAmount: 12750, status: 'Pending', date: '2024-01-13' },
        { id: 4, seller: 'Pedro Gomez', email: 'pedro@pureharvest.com', businessName: 'Pure Harvest', salesAmount: 12000, commission: 12, payoutAmount: 10560, status: 'Failed', date: '2024-01-12' },
        { id: 5, seller: 'Lisa Tan', email: 'lisa@tansfarm.com', businessName: 'Tan\'s Farm', salesAmount: 22000, commission: 10, payoutAmount: 19800, status: 'Processed', date: '2024-01-11' },
        { id: 6, seller: 'Robert Chen', email: 'robert@chenproduce.com', businessName: 'Chen Produce', salesAmount: 8000, commission: 15, payoutAmount: 6800, status: 'Pending', date: '2024-01-10' }
      ]
    }
  },
  computed: {
    filteredPayouts() {
      let filtered = this.payouts
      
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(payout => payout.status.toLowerCase() === this.filterStatus)
      }
      
      return filtered
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
    }
  }
}
</script>

<style scoped>
.payouts-page {
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

.filters {
  display: flex;
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
  min-width: 180px;
}

.filters select:focus {
  border-color: #27ae60;
}

.search-box {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box input {
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  width: 300px;
  flex-grow: 1;
}

.search-box input:focus {
  border-color: #27ae60;
}

.btn-process {
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

.btn-process:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.metric-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payouts-table {
  width: 100%;
  border-collapse: collapse;
}

.payouts-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.payouts-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.payouts-table tr:hover {
  background: #f8faf7;
}

.seller-info {
  display: flex;
  flex-direction: column;
}

.seller-name {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.seller-email {
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

.status-badge.processed {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-badge.failed {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.btn-view, .btn-process, .btn-cancel {
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

.btn-process {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.btn-process:hover {
  background: #c3e6cb;
}

.btn-cancel {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.btn-cancel:hover {
  background: #f5c6cb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .payouts-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filters select, .search-box input {
    width: 100%;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .payouts-table {
    font-size: 0.9rem;
  }
  
  .payouts-table th, .payouts-table td {
    padding: 0.75rem;
  }
}
</style>