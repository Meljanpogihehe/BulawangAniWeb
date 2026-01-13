<template>
    <div class="sales-reports">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Sales Reports</h1>
        <div class="header-actions">
          <select v-model="selectedReportType" class="report-selector" @change="generateReport">
            <option value="daily">Daily Sales</option>
            <option value="weekly">Weekly Sales</option>
            <option value="monthly">Monthly Sales</option>
            <option value="quarterly">Quarterly Sales</option>
            <option value="yearly">Yearly Sales</option>
          </select>
          <select v-model="selectedTimeRange" class="time-selector" @change="generateReport">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
          </select>
          <button class="btn-export" @click="exportReport">
            <i class="fas fa-download"></i> Export Report
          </button>
          <button class="btn-primary" @click="generateCustomReport">
            <i class="fas fa-chart-bar"></i> Generate Report
          </button>
        </div>
      </div>

      <!-- Report Summary -->
      <div class="report-summary">
        <div class="summary-grid">
          <div class="summary-card">
            <div class="card-icon revenue">
              <i class="fas fa-coins"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Total Revenue</div>
              <div class="card-value">₱{{ formatCurrency(reportData.totalRevenue) }}</div>
              <div class="card-change" :class="revenueChange >= 0 ? 'positive' : 'negative'">
                {{ revenueChange >= 0 ? '+' : '' }}{{ Math.abs(revenueChange) }}% vs previous period
              </div>
            </div>
          </div>

          <div class="summary-card">
            <div class="card-icon orders">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Total Orders</div>
              <div class="card-value">{{ reportData.totalOrders }}</div>
              <div class="card-change" :class="ordersChange >= 0 ? 'positive' : 'negative'">
                {{ ordersChange >= 0 ? '+' : '' }}{{ Math.abs(ordersChange) }}% vs previous period
              </div>
            </div>
          </div>

          <div class="summary-card">
            <div class="card-icon avg">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Average Order Value</div>
              <div class="card-value">₱{{ formatCurrency(reportData.avgOrderValue) }}</div>
              <div class="card-change" :class="aovChange >= 0 ? 'positive' : 'negative'">
                {{ aovChange >= 0 ? '+' : '' }}{{ Math.abs(aovChange) }}% vs previous period
              </div>
            </div>
          </div>

          <div class="summary-card">
            <div class="card-icon conversion">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Conversion Rate</div>
              <div class="card-value">{{ reportData.conversionRate }}%</div>
              <div class="card-change" :class="conversionChange >= 0 ? 'positive' : 'negative'">
                {{ conversionChange >= 0 ? '+' : '' }}{{ Math.abs(conversionChange) }}% vs previous period
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-grid">
          <div class="chart-card">
            <h3>Revenue Trend</h3>
            <div class="chart-container">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <h3>Orders by Category</h3>
            <div class="chart-container">
              <canvas ref="categoryChart"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <h3>Top Selling Products</h3>
            <div class="chart-container">
              <canvas ref="productChart"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <h3>Sales by Payment Method</h3>
            <div class="chart-container">
              <canvas ref="paymentChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Tables -->
      <div class="tables-section">
        <div class="table-card">
          <h3>Top Products</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                  <th>Profit Margin</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in topProducts" :key="product.id">
                  <td>
                    <div class="product-info">
                      <img :src="product.image" :alt="product.name" class="product-thumb">
                      <div class="product-details">
                        <div class="product-name">{{ product.name }}</div>
                        <div class="product-sku">{{ product.sku }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ product.category }}</td>
                  <td>{{ product.unitsSold }}</td>
                  <td>₱{{ formatCurrency(product.revenue) }}</td>
                  <td>{{ product.profitMargin }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="table-card">
          <h3>Category Performance</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Avg Order Value</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in categoryPerformance" :key="category.name">
                  <td>{{ category.name }}</td>
                  <td>{{ category.orders }}</td>
                  <td>₱{{ formatCurrency(category.revenue) }}</td>
                  <td>₱{{ formatCurrency(category.avgOrderValue) }}</td>
                  <td :class="category.growth >= 0 ? 'positive' : 'negative'">
                    {{ category.growth >= 0 ? '+' : '' }}{{ category.growth }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Sales Analytics -->
      <div class="analytics-section">
        <h3>Sales Analytics</h3>
        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-header">
              <h4>Customer Insights</h4>
              <div class="analytics-actions">
                <button class="btn-outline" @click="viewCustomerAnalytics">
                  <i class="fas fa-users"></i> View Details
                </button>
              </div>
            </div>
            <div class="analytics-content">
              <div class="insight-item">
                <span class="insight-label">New Customers</span>
                <span class="insight-value">{{ analytics.newCustomers }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Returning Customers</span>
                <span class="insight-value">{{ analytics.returningCustomers }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Customer Lifetime Value</span>
                <span class="insight-value">₱{{ formatCurrency(analytics.customerLTV) }}</span>
              </div>
            </div>
          </div>

          <div class="analytics-card">
            <div class="analytics-header">
              <h4>Time Analysis</h4>
              <div class="analytics-actions">
                <button class="btn-outline" @click="viewTimeAnalytics">
                  <i class="fas fa-clock"></i> View Details
                </button>
              </div>
            </div>
            <div class="analytics-content">
              <div class="insight-item">
                <span class="insight-label">Peak Sales Day</span>
                <span class="insight-value">{{ analytics.peakSalesDay }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Peak Sales Hour</span>
                <span class="insight-value">{{ analytics.peakSalesHour }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Average Order Time</span>
                <span class="insight-value">{{ analytics.avgOrderTime }} min</span>
              </div>
            </div>
          </div>

          <div class="analytics-card">
            <div class="analytics-header">
              <h4>Marketing ROI</h4>
              <div class="analytics-actions">
                <button class="btn-outline" @click="viewMarketingAnalytics">
                  <i class="fas fa-chart-bar"></i> View Details
                </button>
              </div>
            </div>
            <div class="analytics-content">
              <div class="insight-item">
                <span class="insight-label">Campaign Revenue</span>
                <span class="insight-value">₱{{ formatCurrency(analytics.campaignRevenue) }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Marketing Cost</span>
                <span class="insight-value">₱{{ formatCurrency(analytics.marketingCost) }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">ROI</span>
                <span class="insight-value">{{ analytics.roi }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Options -->
      <div class="export-section">
        <h3>Export Options</h3>
        <div class="export-grid">
          <div class="export-card">
            <div class="export-icon">
              <i class="fas fa-file-excel"></i>
            </div>
            <div class="export-content">
              <h4>Excel Report</h4>
              <p>Export detailed sales data to Excel format</p>
              <button class="btn-secondary" @click="exportExcel">
                <i class="fas fa-download"></i> Download Excel
              </button>
            </div>
          </div>

          <div class="export-card">
            <div class="export-icon">
              <i class="fas fa-file-pdf"></i>
            </div>
            <div class="export-content">
              <h4>PDF Report</h4>
              <p>Generate a professional PDF report</p>
              <button class="btn-secondary" @click="exportPDF">
                <i class="fas fa-download"></i> Download PDF
              </button>
            </div>
          </div>

          <div class="export-card">
            <div class="export-icon">
              <i class="fas fa-chart-pie"></i>
            </div>
            <div class="export-content">
              <h4>Chart Images</h4>
              <p>Export charts as high-resolution images</p>
              <button class="btn-secondary" @click="exportCharts">
                <i class="fas fa-download"></i> Export Charts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'SalesReports',
  components: {
    SellerLayout
  },
  setup() {
    const selectedReportType = ref('monthly')
    const selectedTimeRange = ref('30')
    const revenueChart = ref(null)
    const categoryChart = ref(null)
    const productChart = ref(null)
    const paymentChart = ref(null)
    let revenueChartInstance = null
    let categoryChartInstance = null
    let productChartInstance = null
    let paymentChartInstance = null

    const reportData = ref({
      totalRevenue: 156750.50,
      totalOrders: 156,
      avgOrderValue: 1004.81,
      conversionRate: 3.2
    })

    const revenueChange = ref(12.5)
    const ordersChange = ref(8.2)
    const aovChange = ref(3.8)
    const conversionChange = ref(1.5)

    const topProducts = ref([
      {
        id: 1,
        name: 'Handwoven Abaca Bag',
        category: 'Bags',
        sku: 'BAG-001',
        unitsSold: 45,
        revenue: 89100,
        profitMargin: 45,
        image: '/images/products/bag1.jpg'
      },
      {
        id: 2,
        name: 'Traditional Weaving Set',
        category: 'Crafts',
        sku: 'CFT-002',
        unitsSold: 32,
        revenue: 60800,
        profitMargin: 52,
        image: '/images/products/weaving1.jpg'
      },
      {
        id: 3,
        name: 'Bamboo Home Decor',
        category: 'Home',
        sku: 'HME-003',
        unitsSold: 28,
        revenue: 45360,
        profitMargin: 38,
        image: '/images/products/decor1.jpg'
      },
      {
        id: 4,
        name: 'Handmade Pottery Set',
        category: 'Home',
        sku: 'HME-004',
        unitsSold: 25,
        revenue: 37500,
        profitMargin: 41,
        image: '/images/products/pottery1.jpg'
      }
    ])

    const categoryPerformance = ref([
      { name: 'Bags & Accessories', orders: 45, revenue: 89100, avgOrderValue: 1980, growth: 15.2 },
      { name: 'Handicrafts', orders: 32, revenue: 60800, avgOrderValue: 1900, growth: 8.7 },
      { name: 'Home & Living', orders: 53, revenue: 82860, avgOrderValue: 1563, growth: -2.3 },
      { name: 'Kitchen', orders: 26, revenue: 34000, avgOrderValue: 1308, growth: 5.6 }
    ])

    const analytics = ref({
      newCustomers: 89,
      returningCustomers: 67,
      customerLTV: 12500,
      peakSalesDay: 'Saturday',
      peakSalesHour: '8 PM',
      avgOrderTime: 12.5,
      campaignRevenue: 45000,
      marketingCost: 12000,
      roi: 275
    })

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    const createRevenueChart = () => {
      if (!revenueChart.value) return

      const ctx = revenueChart.value.getContext('2d')
      
      if (revenueChartInstance) {
        revenueChartInstance.destroy()
      }

      revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: generateDateLabels(30),
          datasets: [{
            label: 'Revenue',
            data: generateRandomData(30, 2000),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }, {
            label: 'Target',
            data: Array(30).fill(50000),
            borderColor: '#9ca3af',
            borderDash: [5, 5],
            borderWidth: 1
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
          labels: categoryPerformance.value.map(c => c.name),
          datasets: [{
            data: categoryPerformance.value.map(c => c.revenue),
            backgroundColor: [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444'
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

    const createProductChart = () => {
      if (!productChart.value) return

      const ctx = productChart.value.getContext('2d')
      
      if (productChartInstance) {
        productChartInstance.destroy()
      }

      productChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: topProducts.value.map(p => p.name),
          datasets: [{
            label: 'Units Sold',
            data: topProducts.value.map(p => p.unitsSold),
            backgroundColor: '#10b981',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
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

    const createPaymentChart = () => {
      if (!paymentChart.value) return

      const ctx = paymentChart.value.getContext('2d')
      
      if (paymentChartInstance) {
        paymentChartInstance.destroy()
      }

      paymentChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Cash on Delivery', 'Credit Card', 'GCash', 'Bank Transfer'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444'
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
      return Array.from({ length: days }, () => Math.floor(Math.random() * 10000 * multiplier) + 2000 * multiplier)
    }

    const generateReport = () => {
      // Simulate report generation
      alert(`Generating ${selectedReportType.value} report for the last ${selectedTimeRange.value} days...`)
    }

    const generateCustomReport = () => {
      alert('Generating custom sales report...')
    }

    const exportReport = () => {
      alert('Exporting sales report...')
    }

    const exportExcel = () => {
      alert('Exporting Excel report...')
    }

    const exportPDF = () => {
      alert('Exporting PDF report...')
    }

    const exportCharts = () => {
      alert('Exporting chart images...')
    }

    const viewCustomerAnalytics = () => {
      alert('Viewing customer analytics...')
    }

    const viewTimeAnalytics = () => {
      alert('Viewing time-based analytics...')
    }

    const viewMarketingAnalytics = () => {
      alert('Viewing marketing analytics...')
    }

    onMounted(() => {
      createRevenueChart()
      createCategoryChart()
      createProductChart()
      createPaymentChart()
    })

    onUnmounted(() => {
      if (revenueChartInstance) {
        revenueChartInstance.destroy()
      }
      if (categoryChartInstance) {
        categoryChartInstance.destroy()
      }
      if (productChartInstance) {
        productChartInstance.destroy()
      }
      if (paymentChartInstance) {
        paymentChartInstance.destroy()
      }
    })

    return {
      selectedReportType,
      selectedTimeRange,
      revenueChart,
      categoryChart,
      productChart,
      paymentChart,
      reportData,
      revenueChange,
      ordersChange,
      aovChange,
      conversionChange,
      topProducts,
      categoryPerformance,
      analytics,
      formatCurrency,
      generateReport,
      generateCustomReport,
      exportReport,
      exportExcel,
      exportPDF,
      exportCharts,
      viewCustomerAnalytics,
      viewTimeAnalytics,
      viewMarketingAnalytics
    }
  }
}
</script>

<style scoped>
.sales-reports {
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

.report-selector,
.time-selector {
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
  padding: 0.5rem 1rem;
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

.btn-outline {
  background-color: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.report-summary {
  margin-bottom: 3rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-card.revenue { border-left: 4px solid #3b82f6; }
.summary-card.orders { border-left: 4px solid #10b981; }
.summary-card.avg { border-left: 4px solid #8b5cf6; }
.summary-card.conversion { border-left: 4px solid #f59e0b; }

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

.card-icon.orders { background-color: #10b981; }
.card-icon.avg { background-color: #8b5cf6; }
.card-icon.conversion { background-color: #f59e0b; }

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

.charts-section {
  margin-bottom: 3rem;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.chart-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.tables-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.table-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.table-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
}

.data-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
}

.data-table td {
  color: #374151;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-weight: 600;
  color: #1f2937;
}

.product-sku {
  font-size: 0.75rem;
  color: #6b7280;
}

.positive {
  color: #10b981;
  font-weight: 600;
}

.negative {
  color: #ef4444;
  font-weight: 600;
}

.analytics-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.analytics-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.analytics-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.analytics-actions {
  display: flex;
  gap: 0.5rem;
}

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.insight-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.insight-value {
  font-weight: 600;
  color: #1f2937;
}

.export-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.export-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.export-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s;
}

.export-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.export-icon {
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

.export-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.export-content p {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .tables-section {
    grid-template-columns: 1fr;
  }
  
  .chart-grid {
    grid-template-columns: 1fr;
  }
  
  .export-grid {
    grid-template-columns: 1fr;
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>