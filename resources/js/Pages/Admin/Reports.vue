<template>
    <div class="reports-page">
      <div class="page-header">
        <h1>Reports & Analytics</h1>
        <p>Generate and analyze comprehensive business reports</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <div class="filters">
            <select v-model="reportType" @change="generateReport">
              <option value="sales">Sales Report</option>
              <option value="products">Product Performance</option>
              <option value="customers">Customer Analytics</option>
              <option value="sellers">Seller Performance</option>
              <option value="financial">Financial Summary</option>
            </select>
            <select v-model="timeRange" @change="generateReport">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <div class="date-range" v-if="timeRange === 'custom'">
              <input type="date" v-model="startDate" @change="generateReport" />
              <input type="date" v-model="endDate" @change="generateReport" />
            </div>
          </div>
          <div class="actions">
            <button class="btn-export" @click="exportReport">Export PDF</button>
            <button class="btn-export" @click="exportExcel">Export Excel</button>
            <button class="btn-print" @click="printReport">Print</button>
          </div>
        </div>
        
        <!-- Sales Overview -->
        <div class="overview-grid" v-if="reportType === 'sales'">
          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <div class="metric-value">₱{{ formatCurrency(salesData.totalRevenue) }}</div>
              <div class="metric-label">Total Revenue</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">📦</div>
            <div class="metric-content">
              <div class="metric-value">{{ salesData.totalOrders }}</div>
              <div class="metric-label">Total Orders</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">👥</div>
            <div class="metric-content">
              <div class="metric-value">{{ salesData.uniqueCustomers }}</div>
              <div class="metric-label">Unique Customers</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">📈</div>
            <div class="metric-content">
              <div class="metric-value">{{ salesData.avgOrderValue }}</div>
              <div class="metric-label">Avg Order Value</div>
            </div>
          </div>
        </div>
        
        <!-- Product Performance Overview -->
        <div class="overview-grid" v-if="reportType === 'products'">
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <div class="metric-value">{{ productData.totalProducts }}</div>
              <div class="metric-label">Total Products</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🔥</div>
            <div class="metric-content">
              <div class="metric-value">{{ productData.topSelling }}</div>
              <div class="metric-label">Top Selling</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">⚠️</div>
            <div class="metric-content">
              <div class="metric-value">{{ productData.lowStock }}</div>
              <div class="metric-label">Low Stock</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🔄</div>
            <div class="metric-content">
              <div class="metric-value">{{ productData.avgRating }}</div>
              <div class="metric-label">Avg Rating</div>
            </div>
          </div>
        </div>
        
        <!-- Charts Section -->
        <div class="charts-section">
          <div class="chart-card">
            <h3>Revenue Trend</h3>
            <div class="chart-container">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>
          
          <div class="chart-card">
            <h3>Order Volume</h3>
            <div class="chart-container">
              <canvas ref="orderChart"></canvas>
            </div>
          </div>
        </div>
        
        <!-- Data Tables -->
        <div class="data-section">
          <h3>{{ reportType === 'sales' ? 'Sales Details' : reportType === 'products' ? 'Product Details' : 'Report Data' }}</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th v-for="column in tableColumns" :key="column.key">{{ column.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in tableData" :key="index">
                  <td v-for="column in tableColumns" :key="column.key">
                    {{ formatCellValue(row[column.key], column.type) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Summary Section -->
        <div class="summary-section">
          <h3>Summary</h3>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Report Period:</span>
              <span class="summary-value">{{ getReportPeriod() }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Generated:</span>
              <span class="summary-value">{{ new Date().toLocaleString('en-PH') }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Report Type:</span>
              <span class="summary-value">{{ reportType.toUpperCase() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Reports',
  data() {
    return {
      reportType: 'sales',
      timeRange: 'month',
      startDate: '',
      endDate: '',
      salesData: {
        totalRevenue: 125000,
        totalOrders: 156,
        uniqueCustomers: 123,
        avgOrderValue: 801.28
      },
      productData: {
        totalProducts: 45,
        topSelling: 'Premium Dinorado Rice',
        lowStock: 8,
        avgRating: 4.6
      },
      tableData: [],
      tableColumns: []
    }
  },
  mounted() {
    this.generateReport()
    this.initializeCharts()
  },
  methods: {
    generateReport() {
      // Simulate data generation based on filters
      this.generateTableData()
      this.updateCharts()
    },
    
    generateTableData() {
      if (this.reportType === 'sales') {
        this.tableColumns = [
          { key: 'date', label: 'Date', type: 'date' },
          { key: 'orders', label: 'Orders', type: 'number' },
          { key: 'revenue', label: 'Revenue', type: 'currency' },
          { key: 'customers', label: 'Customers', type: 'number' }
        ]
        
        this.tableData = [
          { date: '2024-01-15', orders: 25, revenue: 21500, customers: 22 },
          { date: '2024-01-14', orders: 32, revenue: 28800, customers: 28 },
          { date: '2024-01-13', orders: 18, revenue: 15600, customers: 16 },
          { date: '2024-01-12', orders: 28, revenue: 24200, customers: 24 },
          { date: '2024-01-11', orders: 22, revenue: 19500, customers: 19 },
          { date: '2024-01-10', orders: 31, revenue: 25400, customers: 24 }
        ]
      } else if (this.reportType === 'products') {
        this.tableColumns = [
          { key: 'product', label: 'Product', type: 'text' },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'sales', label: 'Sales', type: 'number' },
          { key: 'revenue', label: 'Revenue', type: 'currency' },
          { key: 'rating', label: 'Rating', type: 'rating' }
        ]
        
        this.tableData = [
          { product: 'Premium Dinorado Rice', category: 'Rice', sales: 156, revenue: 45000, rating: 4.8 },
          { product: 'Organic Tomatoes', category: 'Vegetables', sales: 89, revenue: 17800, rating: 4.7 },
          { product: 'Fresh Eggs', category: 'Dairy', sales: 234, revenue: 11700, rating: 4.6 },
          { product: 'Banana Cue', category: 'Snacks', sales: 123, revenue: 9840, rating: 4.5 },
          { product: 'Buko Pie', category: 'Desserts', sales: 67, revenue: 8040, rating: 4.9 },
          { product: 'Tinapa', category: 'Seafood', sales: 45, revenue: 13500, rating: 4.4 }
        ]
      }
    },
    
    initializeCharts() {
      // Initialize Chart.js charts
      this.$nextTick(() => {
        this.updateCharts()
      })
    },
    
    updateCharts() {
      // This would integrate with Chart.js or similar library
      // For now, we'll just log the chart update
      console.log('Charts updated for:', this.reportType)
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    },
    
    formatCellValue(value, type) {
      switch (type) {
        case 'currency':
          return this.formatCurrency(value)
        case 'date':
          return new Date(value).toLocaleDateString('en-PH')
        case 'rating':
          return `${value} ⭐`
        default:
          return value
      }
    },
    
    getReportPeriod() {
      switch (this.timeRange) {
        case 'today':
          return 'Today'
        case 'week':
          return 'This Week'
        case 'month':
          return 'This Month'
        case 'quarter':
          return 'This Quarter'
        case 'year':
          return 'This Year'
        case 'custom':
          return `${this.startDate} to ${this.endDate}`
        default:
          return 'Custom Period'
      }
    },
    
    exportReport() {
      alert('Exporting PDF report...')
      // Implementation would go here
    },
    
    exportExcel() {
      alert('Exporting Excel report...')
      // Implementation would go here
    },
    
    printReport() {
      window.print()
    }
  }
}
</script>

<style scoped>
.reports-page {
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
  align-items: center;
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

.date-range {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.date-range input[type="date"] {
  padding: 0.75rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;
  cursor: pointer;
}

.date-range input[type="date"]:focus {
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

.btn-print {
  background: linear-gradient(135deg, #3498db, #2980b9);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.btn-print:hover {
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.overview-grid {
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
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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

.chart-container {
  width: 100%;
  height: 300px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
  padding: 1rem;
}

.data-section {
  margin-bottom: 2rem;
}

.data-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.table-container {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  overflow: hidden;
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
}

.table-container th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.table-container td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.table-container tr:hover {
  background: #f8faf7;
}

.summary-section {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
}

.summary-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
}

.summary-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-weight: 700;
  color: #2c3e50;
}

/* Responsive Design */
@media (max-width: 768px) {
  .reports-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
    width: 100%;
  }
  
  .date-range {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .actions {
    flex-direction: column;
    width: 100%;
  }
  
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .summary-content {
    grid-template-columns: 1fr;
  }
  
  .table-container th, .table-container td {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}
</style>