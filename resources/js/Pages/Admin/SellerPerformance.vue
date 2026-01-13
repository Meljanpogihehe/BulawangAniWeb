<template>
    <div class="seller-performance-page">
      <div class="page-header">
        <h1>Seller Performance Reports</h1>
        <p>Monitor seller performance and sales metrics</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <div class="filters">
            <select v-model="timePeriod">
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 365 Days</option>
            </select>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search sellers..." />
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">🏪</div>
            <div class="metric-content">
              <div class="metric-value">{{ totalSellers }}</div>
              <div class="metric-label">Total Sellers</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <div class="metric-value">₱{{ totalSales }}</div>
              <div class="metric-label">Total Sales</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">📦</div>
            <div class="metric-content">
              <div class="metric-value">{{ totalOrders }}</div>
              <div class="metric-label">Total Orders</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">⭐</div>
            <div class="metric-content">
              <div class="metric-value">{{ avgRating }}</div>
              <div class="metric-label">Avg Rating</div>
            </div>
          </div>
        </div>
        
        <div class="table-container">
          <table class="performance-table">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Business Name</th>
                <th>Sales</th>
                <th>Orders</th>
                <th>Rating</th>
                <th>Response Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="seller in sellers" :key="seller.id">
                <td>
                  <div class="seller-info">
                    <div class="seller-name">{{ seller.name }}</div>
                    <div class="seller-email">{{ seller.email }}</div>
                  </div>
                </td>
                <td>{{ seller.businessName }}</td>
                <td>₱{{ seller.sales }}</td>
                <td>{{ seller.orders }}</td>
                <td>
                  <div class="rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-value">{{ seller.rating }}</span>
                  </div>
                </td>
                <td>{{ seller.responseRate }}%</td>
                <td>
                  <span :class="['status-badge', seller.status.toLowerCase()]">
                    {{ seller.status }}
                  </span>
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
  name: 'SellerPerformance',
  data() {
    return {
      timePeriod: 'month',
      totalSellers: 24,
      totalSales: 150000,
      totalOrders: 1200,
      avgRating: 4.6,
      sellers: [
        { id: 1, name: 'Maria Santos', email: 'maria@freshfarm.com', businessName: 'Fresh Farm Produce', sales: 25000, orders: 150, rating: 4.8, responseRate: 95, status: 'Excellent' },
        { id: 2, name: 'Juan Dela Cruz', email: 'juan@organicvalley.com', businessName: 'Organic Valley', sales: 18000, orders: 120, rating: 4.7, responseRate: 92, status: 'Good' },
        { id: 3, name: 'Ana Reyes', email: 'ana@greenfields.com', businessName: 'Green Fields', sales: 15000, orders: 100, rating: 4.5, responseRate: 88, status: 'Good' },
        { id: 4, name: 'Pedro Gomez', email: 'pedro@pureharvest.com', businessName: 'Pure Harvest', sales: 12000, orders: 80, rating: 4.4, responseRate: 85, status: 'Average' },
        { id: 5, name: 'Lisa Tan', email: 'lisa@tansfarm.com', businessName: 'Tan\'s Farm', sales: 22000, orders: 140, rating: 4.9, responseRate: 98, status: 'Excellent' },
        { id: 6, name: 'Robert Chen', email: 'robert@chenproduce.com', businessName: 'Chen Produce', sales: 8000, orders: 60, rating: 4.2, responseRate: 80, status: 'Average' }
      ]
    }
  },
  watch: {
    timePeriod(newPeriod) {
      // Implement data fetching based on time period
      console.log('Time period changed to:', newPeriod)
    }
  }
}
</script>

<style scoped>
.seller-performance-page {
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

.performance-table {
  width: 100%;
  border-collapse: collapse;
}

.performance-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.performance-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.performance-table tr:hover {
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

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  font-size: 0.8rem;
}

.rating-value {
  font-weight: 700;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.excellent {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.good {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.status-badge.average {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .seller-performance-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters select, .search-box input {
    width: 100%;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .performance-table {
    font-size: 0.9rem;
  }
  
  .performance-table th, .performance-table td {
    padding: 0.75rem;
  }
}
</style>