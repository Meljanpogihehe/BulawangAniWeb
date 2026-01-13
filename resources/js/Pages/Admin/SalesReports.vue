<template>
    <div class="sales-reports-page">
      <div class="page-header">
        <h1>Sales Reports</h1>
        <p>Generate and analyze sales performance reports</p>
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
            <select v-model="reportType">
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="category">By Category</option>
              <option value="seller">By Seller</option>
            </select>
          </div>
          <div class="actions">
            <button class="btn-export">Export Report</button>
            <button class="btn-print">Print</button>
          </div>
        </div>
        
        <div class="metrics-grid">
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
            <div class="metric-icon">👥</div>
            <div class="metric-content">
              <div class="metric-value">{{ totalCustomers }}</div>
              <div class="metric-label">Customers</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">📈</div>
            <div class="metric-content">
              <div class="metric-value">{{ avgOrderValue }}</div>
              <div class="metric-label">Avg Order Value</div>
            </div>
          </div>
        </div>
        
        <div class="charts-section">
          <div class="chart-card">
            <h3>Sales Trend</h3>
            <div class="chart-placeholder">
              <div class="chart-bar" style="height: 60%"></div>
              <div class="chart-bar" style="height: 80%"></div>
              <div class="chart-bar" style="height: 45%"></div>
              <div class="chart-bar" style="height: 90%"></div>
              <div class="chart-bar" style="height: 75%"></div>
              <div class="chart-bar" style="height: 65%"></div>
              <div class="chart-bar" style="height: 85%"></div>
            </div>
          </div>
          
          <div class="chart-card">
            <h3>Category Performance</h3>
            <div class="category-list">
              <div class="category-item" v-for="category in categories" :key="category.name">
                <div class="category-info">
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-sales">₱{{ category.sales }}</span>
                </div>
                <div class="category-bar" :style="{ width: category.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="table-container">
          <table class="reports-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Orders</th>
                <th>Sales</th>
                <th>Avg Order</th>
                <th>Top Seller</th>
                <th>Top Product</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.date">
                <td>{{ formatDate(report.date) }}</td>
                <td>{{ report.orders }}</td>
                <td>₱{{ report.sales }}</td>
                <td>₱{{ report.avgOrder }}</td>
                <td>{{ report.topSeller }}</td>
                <td>{{ report.topProduct }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'SalesReports',
  data() {
    return {
      timePeriod: 'month',
      reportType: 'summary',
      totalSales: 150000,
      totalOrders: 120,
      totalCustomers: 85,
      avgOrderValue: 1250,
      categories: [
        { name: 'Grains', sales: 45000, percentage: 30 },
        { name: 'Vegetables', sales: 35000, percentage: 23 },
        { name: 'Fruits', sales: 30000, percentage: 20 },
        { name: 'Organic', sales: 25000, percentage: 17 },
        { name: 'Dairy', sales: 15000, percentage: 10 }
      ],
      reports: [
        { date: '2024-01-15', orders: 15, sales: 18000, avgOrder: 1200, topSeller: 'Fresh Farm Produce', topProduct: 'Premium Dinorado Rice' },
        { date: '2024-01-14', orders: 12, sales: 14400, avgOrder: 1200, topSeller: 'Organic Valley', topProduct: 'Organic Benguet Tomatoes' },
        { date: '2024-01-13', orders: 18, sales: 21600, avgOrder: 1200, topSeller: 'Green Fields', topProduct: 'Davao Golden Bananas' },
        { date: '2024-01-12', orders: 10, sales: 12000, avgOrder: 1200, topSeller: 'Pure Harvest', topProduct: 'Wild Bukidnon Honey' },
        { date: '2024-01-11', orders: 20, sales: 24000, avgOrder: 1200, topSeller: 'Tan\'s Farm', topProduct: 'Fresh Carrots' }
      ]
    }
  },
  watch: {
    timePeriod(newPeriod) {
      // Implement data fetching based on time period
      console.log('Time period changed to:', newPeriod)
    },
    reportType(newType) {
      // Implement report type change
      console.log('Report type changed to:', newType)
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
.sales-reports-page {
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

.actions {
  display: flex;
  gap: 1rem;
}

.btn-export, .btn-print {
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

.btn-export:hover, .btn-print:hover {
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

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
}

.chart-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.chart-placeholder {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 120px;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.chart-bar {
  flex-grow: 1;
  background: linear-gradient(to top, #27ae60, #2ecc71);
  border-radius: 4px;
  width: 100%;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  padding: 1rem;
}

.category-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.category-name {
  font-weight: 700;
  color: #2c3e50;
}

.category-sales {
  font-weight: 700;
  color: #27ae60;
}

.category-bar {
  height: 8px;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  border-radius: 4px;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.reports-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.reports-table tr:hover {
  background: #f8faf7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sales-reports-page {
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
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .reports-table {
    font-size: 0.9rem;
  }
  
  .reports-table th, .reports-table td {
    padding: 0.75rem;
  }
}
</style>