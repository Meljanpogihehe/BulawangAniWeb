<template>
    <div class="dashboard-page">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of platform performance and key metrics</p>
      </div>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Total Users</h3>
            <p class="stat-value">{{ formatNumber(stats.totalUsers) }}</p>
            <span class="stat-change positive">+12.5% from last month</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Total Sales</h3>
            <p class="stat-value">{{ formatCurrency(stats.totalSales) }}</p>
            <span class="stat-change positive">+8.3% from last month</span>
          </div>
        </div>
      </div>

      <!-- E-commerce Charts Section -->
      <div class="charts-section">
        <div class="chart-grid">
          <!-- Sales Revenue Chart -->
          <div class="chart-card">
            <div class="chart-header">
              <h3>Monthly Sales Revenue</h3>
              <span class="chart-subtitle">Last 6 months performance</span>
            </div>
            <div class="chart-container">
              <canvas ref="salesChart"></canvas>
            </div>
          </div>

          <!-- Order Status Distribution -->
          <div class="chart-card">
            <div class="chart-header">
              <h3>Order Status Distribution</h3>
              <span class="chart-subtitle">Current order statuses</span>
            </div>
            <div class="chart-container">
              <canvas ref="orderStatusChart"></canvas>
            </div>
          </div>

          <!-- Product Category Performance -->
          <div class="chart-card">
            <div class="chart-header">
              <h3>Product Category Performance</h3>
              <span class="chart-subtitle">Sales by category</span>
            </div>
            <div class="chart-container">
              <canvas ref="categoryChart"></canvas>
            </div>
          </div>

          <!-- User Registration Trend -->
          <div class="chart-card">
            <div class="chart-header">
              <h3>User Registration Trend</h3>
              <span class="chart-subtitle">New users per month</span>
            </div>
            <div class="chart-container">
              <canvas ref="userTrendChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-actions">
        <h2>Quick Actions</h2>
        <div class="action-grid">
          <button class="action-btn">View All Orders</button>
          <button class="action-btn">Manage Products</button>
          <button class="action-btn">User Reports</button>
          <button class="action-btn">System Logs</button>
        </div>
      </div>
    </div>

</template>

<script>
import { Chart, registerables } from 'chart.js'
import AdminLayout from '@/Components/AdminLayout.vue'

// Register Chart.js components
Chart.register(...registerables)

export default {
  name: 'AdminDashboard',
  components: {
    AdminLayout
  },
  data() {
    return {
      stats: {
        totalUsers: 0,
        totalSales: 0,
        totalOrders: 0,
        revenue: 0,
        activeSellers: 0,
        pendingOrders: 0,
        todayRevenue: 0,
        conversionRate: 0
      },
      charts: {
        salesChart: null,
        orderStatusChart: null,
        categoryChart: null,
        userTrendChart: null
      },
      isLoading: false,
      error: null,
      // Real-time data refresh interval
      refreshInterval: null,
      // Time range for data filtering
      timeRange: 'week',
      // Chart data storage
      chartData: {
        sales: [],
        orderStatus: [],
        categories: [],
        userTrends: []
      }
    }
  },
  mounted() {
    this.fetchDashboardData()
    this.initCharts()
    this.startRealTimeUpdates()
  },
  beforeUnmount() {
    // Clean up charts to prevent memory leaks
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.destroy()
      }
    })
  },
  methods: {
    beforeUnmount() {
      // Clean up charts to prevent memory leaks
      Object.values(this.charts).forEach(chart => {
        if (chart) {
          chart.destroy()
        }
      })
      this.stopRealTimeUpdates()
    },

    updateSalesChart() {
      if (this.charts.salesChart && this.chartData.sales.length > 0) {
        this.charts.salesChart.data.labels = this.chartData.sales.map(item => item.month)
        this.charts.salesChart.data.datasets[0].data = this.chartData.sales.map(item => item.revenue)
        this.charts.salesChart.update()
      }
    },

    updateOrderStatusChart() {
      if (this.charts.orderStatusChart && this.chartData.orderStatus.length > 0) {
        this.charts.orderStatusChart.data.labels = this.chartData.orderStatus.map(item => item.status)
        this.charts.orderStatusChart.data.datasets[0].data = this.chartData.orderStatus.map(item => item.count)
        this.charts.orderStatusChart.update()
      }
    },

    updateCategoryChart() {
      if (this.charts.categoryChart && this.chartData.categories.length > 0) {
        this.charts.categoryChart.data.labels = this.chartData.categories.map(item => item.category)
        this.charts.categoryChart.data.datasets[0].data = this.chartData.categories.map(item => item.sales)
        this.charts.categoryChart.update()
      }
    },

    updateUserTrendChart() {
      if (this.charts.userTrendChart && this.chartData.userTrends.length > 0) {
        this.charts.userTrendChart.data.labels = this.chartData.userTrends.map(item => item.month)
        this.charts.userTrendChart.data.datasets[0].data = this.chartData.userTrends.map(item => item.users)
        this.charts.userTrendChart.update()
      }
    },

    async fetchDashboardData() {
      try {
        // Simulate API calls with mock data structure
        // In a real application, these would be actual API calls
        
        // Fetch basic stats
        const statsResponse = await this.fetchStats()
        this.stats = { ...this.stats, ...statsResponse }
        
        // Fetch chart data
        const chartDataResponse = await this.fetchChartData()
        this.chartData = chartDataResponse
        
        // Update charts with new data
        this.updateCharts()
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Fallback to mock data
        this.loadMockData()
      }
    },

    async fetchStats() {
      // Simulate API call for basic statistics
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            totalUsers: 1234,
            totalSales: 123456,
            totalOrders: 567,
            revenue: 45678,
            activeSellers: 24,
            pendingOrders: 15,
            todayRevenue: 2150,
            conversionRate: 12.5
          })
        }, 500)
      })
    },

    async fetchChartData() {
      // Simulate API calls for chart data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            sales: [
              { month: 'Oct 2025', revenue: 85000 },
              { month: 'Nov 2025', revenue: 92000 },
              { month: 'Dec 2025', revenue: 110000 },
              { month: 'Jan 2026', revenue: 125000 },
              { month: 'Feb 2026', revenue: 135000 },
              { month: 'Mar 2026', revenue: 142000 }
            ],
            orderStatus: [
              { status: 'Delivered', count: 65 },
              { status: 'On the Way', count: 20 },
              { status: 'Preparing', count: 10 },
              { status: 'Cancelled', count: 5 }
            ],
            categories: [
              { category: 'Rice & Grains', sales: 45000 },
              { category: 'Fruits', sales: 28000 },
              { category: 'Vegetables', sales: 22000 },
              { category: 'Dairy', sales: 15000 },
              { category: 'Meat', sales: 18000 }
            ],
            userTrends: [
              { month: 'Oct 2025', users: 45 },
              { month: 'Nov 2025', users: 52 },
              { month: 'Dec 2025', users: 68 },
              { month: 'Jan 2026', users: 75 },
              { month: 'Feb 2026', users: 82 },
              { month: 'Mar 2026', users: 91 }
            ]
          })
        }, 300)
      })
    },

    loadMockData() {
      // Fallback mock data
      this.stats = {
        totalUsers: 1234,
        totalSales: 123456,
        totalOrders: 567,
        revenue: 45678,
        activeSellers: 24,
        pendingOrders: 15,
        todayRevenue: 2150,
        conversionRate: 12.5
      }
      
      this.chartData = {
        sales: [
          { month: 'Oct 2025', revenue: 85000 },
          { month: 'Nov 2025', revenue: 92000 },
          { month: 'Dec 2025', revenue: 110000 },
          { month: 'Jan 2026', revenue: 125000 },
          { month: 'Feb 2026', revenue: 135000 },
          { month: 'Mar 2026', revenue: 142000 }
        ],
        orderStatus: [
          { status: 'Delivered', count: 65 },
          { status: 'On the Way', count: 20 },
          { status: 'Preparing', count: 10 },
          { status: 'Cancelled', count: 5 }
        ],
        categories: [
          { category: 'Rice & Grains', sales: 45000 },
          { category: 'Fruits', sales: 28000 },
          { category: 'Vegetables', sales: 22000 },
          { category: 'Dairy', sales: 15000 },
          { category: 'Meat', sales: 18000 }
        ],
        userTrends: [
          { month: 'Oct 2025', users: 45 },
          { month: 'Nov 2025', users: 52 },
          { month: 'Dec 2025', users: 68 },
          { month: 'Jan 2026', users: 75 },
          { month: 'Feb 2026', users: 82 },
          { month: 'Mar 2026', users: 91 }
        ]
      }
    },

    updateCharts() {
      this.updateSalesChart()
      this.updateOrderStatusChart()
      this.updateCategoryChart()
      this.updateUserTrendChart()
    },

    startRealTimeUpdates() {
      // Update data every 30 seconds
      this.refreshInterval = setInterval(async () => {
        try {
          await this.fetchDashboardData()
        } catch (error) {
          console.error('Real-time update failed:', error)
        }
      }, 30000)
    },

    stopRealTimeUpdates() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
    },

    initCharts() {
      this.initSalesChart()
      this.initOrderStatusChart()
      this.initCategoryChart()
      this.initUserTrendChart()
    },
    
    initSalesChart() {
      const ctx = this.$refs.salesChart.getContext('2d')
      
      const salesData = {
        labels: this.chartData.sales.map(item => item.month),
        datasets: [{
          label: 'Sales Revenue',
          data: this.chartData.sales.map(item => item.revenue),
          borderColor: '#27ae60',
          backgroundColor: 'rgba(39, 174, 96, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#27ae60',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      }

      this.charts.salesChart = new Chart(ctx, {
        type: 'line',
        data: salesData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0,0,0,0.05)'
              },
              ticks: {
                callback: function(value) {
                  return '₱' + value.toLocaleString()
                }
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
    },

    initOrderStatusChart() {
      const ctx = this.$refs.orderStatusChart.getContext('2d')
      
      const orderData = {
        labels: this.chartData.orderStatus.map(item => item.status),
        datasets: [{
          data: this.chartData.orderStatus.map(item => item.count),
          backgroundColor: [
            '#27ae60', // Delivered - Green
            '#f39c12', // On the Way - Orange
            '#3498db', // Preparing - Blue
            '#e74c3c'  // Cancelled - Red
          ],
          borderWidth: 0,
          hoverOffset: 10
        }]
      }

      this.charts.orderStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: orderData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12
                }
              }
            }
          }
        }
      })
    },

    initCategoryChart() {
      const ctx = this.$refs.categoryChart.getContext('2d')
      
      const categoryData = {
        labels: this.chartData.categories.map(item => item.category),
        datasets: [{
          label: 'Sales (₱)',
          data: this.chartData.categories.map(item => item.sales),
          backgroundColor: [
            '#27ae60',
            '#f39c12',
            '#3498db',
            '#9b59b6',
            '#e67e22'
          ],
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: [
            '#2ecc71',
            '#f1c40f',
            '#5dade2',
            '#bb8fce',
            '#d35400'
          ]
        }]
      }

      this.charts.categoryChart = new Chart(ctx, {
        type: 'bar',
        data: categoryData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0,0,0,0.05)'
              },
              ticks: {
                callback: function(value) {
                  return '₱' + value.toLocaleString()
                }
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
    },

    initUserTrendChart() {
      const ctx = this.$refs.userTrendChart.getContext('2d')
      
      const userData = {
        labels: this.chartData.userTrends.map(item => item.month),
        datasets: [{
          label: 'New Users',
          data: this.chartData.userTrends.map(item => item.users),
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3498db',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      }

      this.charts.userTrendChart = new Chart(ctx, {
        type: 'line',
        data: userData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0,0,0,0.05)'
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
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    },

    formatNumber(num) {
      return new Intl.NumberFormat('en-PH').format(num)
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #f8faf7, #f0f7ee);
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-header p {
  color: #5a6c5a;
  font-size: 1.1rem;
  font-weight: 600;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid #e8f1e1;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  border-color: #d4edda;
}

.stat-icon {
  font-size: 2.5rem;
  margin-right: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  color: #5a6c5a;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
}

.stat-value {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-actions {
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e8f1e1;
}

.dashboard-actions h2 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 800;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.action-btn {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(39, 174, 96, 0.3);
}

/* Charts Section Styles */
.charts-section {
  margin-bottom: 3rem;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e8f1e1;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chart-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  border-color: #d4edda;
}

.chart-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f7ee;
}

.chart-header h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 800;
}

.chart-subtitle {
  color: #5a6c5a;
  font-size: 0.875rem;
  font-weight: 600;
}

.chart-container {
  height: 300px;
  position: relative;
}

.stat-change {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #27ae60;
}

.stat-change.negative {
  color: #e74c3c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem;
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
  }
  
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .stat-icon {
    margin-right: 1rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>