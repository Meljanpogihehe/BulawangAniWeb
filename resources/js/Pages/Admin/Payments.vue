<template>
    <div class="payments-page">
      <div class="page-header">
        <h1>Payment Records</h1>
        <p>Manage and track all payment transactions</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <div class="filters">
            <select v-model="filterStatus">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select v-model="filterMethod">
              <option value="all">All Methods</option>
              <option value="cod">Cash on Delivery</option>
              <option value="gcash">GCash</option>
              <option value="card">Credit Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search payments..." />
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <div class="metric-value">₱{{ totalRevenue }}</div>
              <div class="metric-label">Total Revenue</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">💳</div>
            <div class="metric-content">
              <div class="metric-value">{{ totalTransactions }}</div>
              <div class="metric-label">Transactions</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">✅</div>
            <div class="metric-content">
              <div class="metric-value">{{ successRate }}%</div>
              <div class="metric-label">Success Rate</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🔄</div>
            <div class="metric-content">
              <div class="metric-value">₱{{ totalRefunds }}</div>
              <div class="metric-label">Total Refunds</div>
            </div>
          </div>
        </div>
        
        <div class="table-container">
          <table class="payments-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in filteredPayments" :key="payment.id">
                <td>
                  <div class="transaction-id">{{ payment.transactionId }}</div>
                  <div class="payment-type">{{ payment.type }}</div>
                </td>
                <td>#{{ payment.orderId }}</td>
                <td>{{ payment.customer }}</td>
                <td>₱{{ payment.amount }}</td>
                <td>
                  <span :class="['method-badge', payment.method.toLowerCase()]">
                    {{ payment.method }}
                  </span>
                </td>
                <td>
                  <span :class="['status-badge', payment.status.toLowerCase()]">
                    {{ payment.status }}
                  </span>
                </td>
                <td>{{ formatDate(payment.date) }}</td>
                <td>
                  <button class="btn-view">View</button>
                  <button class="btn-refund" v-if="payment.status === 'Paid'">Refund</button>
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
  name: 'Payments',
  data() {
    return {
      filterStatus: 'all',
      filterMethod: 'all',
      totalRevenue: 150000,
      totalTransactions: 120,
      successRate: 95,
      totalRefunds: 8500,
      payments: [
        { id: 1, transactionId: 'TXN123456789', orderId: 1001, customer: 'John Doe', amount: 2500, method: 'GCash', status: 'Paid', type: 'Payment', date: '2024-01-15' },
        { id: 2, transactionId: 'TXN987654321', orderId: 1002, customer: 'Jane Smith', amount: 1200, method: 'Cash on Delivery', status: 'Pending', type: 'Payment', date: '2024-01-14' },
        { id: 3, transactionId: 'TXN456789123', orderId: 1003, customer: 'Bob Wilson', amount: 850, method: 'Credit Card', status: 'Failed', type: 'Payment', date: '2024-01-13' },
        { id: 4, transactionId: 'REF123456789', orderId: 1004, customer: 'Alice Johnson', amount: 450, method: 'GCash', status: 'Refunded', type: 'Refund', date: '2024-01-12' },
        { id: 5, transactionId: 'TXN789123456', orderId: 1005, customer: 'Charlie Brown', amount: 600, method: 'Bank Transfer', status: 'Paid', type: 'Payment', date: '2024-01-11' },
        { id: 6, transactionId: 'TXN321654987', orderId: 1006, customer: 'Diana Prince', amount: 1800, method: 'GCash', status: 'Paid', type: 'Payment', date: '2024-01-10' }
      ]
    }
  },
  computed: {
    filteredPayments() {
      let filtered = this.payments
      
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(payment => payment.status.toLowerCase() === this.filterStatus)
      }
      
      if (this.filterMethod !== 'all') {
        filtered = filtered.filter(payment => payment.method.toLowerCase() === this.filterMethod)
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
.payments-page {
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

.payments-table {
  width: 100%;
  border-collapse: collapse;
}

.payments-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.payments-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.payments-table tr:hover {
  background: #f8faf7;
}

.transaction-id {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.payment-type {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.method-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.method-badge.gcash {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.method-badge.cod {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.method-badge.card {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.method-badge.bank {
  background: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #e1bee7;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.paid {
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

.status-badge.refunded {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.btn-view, .btn-refund {
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

.btn-refund {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.btn-refund:hover {
  background: #ffeaa7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .payments-page {
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
  
  .payments-table {
    font-size: 0.9rem;
  }
  
  .payments-table th, .payments-table td {
    padding: 0.75rem;
  }
}
</style>