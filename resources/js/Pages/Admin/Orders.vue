<template>
    <div class="orders-page">
      <div class="page-header">
        <h1>All Orders</h1>
        <p>Manage customer orders and track order status</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <div class="filters">
            <select v-model="filterStatus">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search orders..." />
          </div>
        </div>
        
        <div class="table-container">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>
                  <div class="order-id">#{{ order.id }}</div>
                  <div class="order-items">{{ order.items }} items</div>
                </td>
                <td>{{ order.customer }}</td>
                <td>{{ formatDate(order.date) }}</td>
                <td>₱{{ order.amount }}</td>
                <td>
                  <span :class="['status-badge', order.status.toLowerCase()]">
                    {{ order.status }}
                  </span>
                </td>
                <td>
                  <span :class="['payment-badge', order.paymentStatus.toLowerCase()]">
                    {{ order.paymentStatus }}
                  </span>
                </td>
                <td>
                  <button class="btn-view">View</button>
                  <button class="btn-edit">Update</button>
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
  name: 'Orders',
  data() {
    return {
      filterStatus: 'all',
      orders: [
        { id: 1001, customer: 'John Doe', date: '2024-01-15', amount: 2500, status: 'Delivered', paymentStatus: 'Paid', items: 3 },
        { id: 1002, customer: 'Jane Smith', date: '2024-01-14', amount: 1200, status: 'Shipped', paymentStatus: 'Paid', items: 2 },
        { id: 1003, customer: 'Bob Wilson', date: '2024-01-13', amount: 850, status: 'Processing', paymentStatus: 'Paid', items: 1 },
        { id: 1004, customer: 'Alice Johnson', date: '2024-01-12', amount: 3200, status: 'Pending', paymentStatus: 'Pending', items: 4 },
        { id: 1005, customer: 'Charlie Brown', date: '2024-01-11', amount: 600, status: 'Cancelled', paymentStatus: 'Refunded', items: 1 },
        { id: 1006, customer: 'Diana Prince', date: '2024-01-10', amount: 1800, status: 'Delivered', paymentStatus: 'Paid', items: 2 }
      ]
    }
  },
  computed: {
    filteredOrders() {
      if (this.filterStatus === 'all') {
        return this.orders
      }
      return this.orders.filter(order => order.status.toLowerCase() === this.filterStatus)
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
.orders-page {
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

.filters select {
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;
  cursor: pointer;
  min-width: 200px;
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

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.orders-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.orders-table tr:hover {
  background: #f8faf7;
}

.order-id {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.order-items {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.status-badge, .payment-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

/* Status Badges */
.status-badge.pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-badge.processing {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.status-badge.shipped {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.status-badge.delivered {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Payment Badges */
.payment-badge.paid {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.payment-badge.pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.payment-badge.refunded {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.btn-view, .btn-edit {
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

.btn-edit {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-edit:hover {
  background: #bbdefb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .orders-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters select, .search-box input {
    width: 100%;
  }
  
  .orders-table {
    font-size: 0.9rem;
  }
  
  .orders-table th, .orders-table td {
    padding: 0.75rem;
  }
}
</style>