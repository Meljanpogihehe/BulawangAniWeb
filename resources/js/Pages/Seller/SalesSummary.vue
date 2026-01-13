<template>
    <div class="sales-summary">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Sales Summary</h1>
        <div class="header-actions">
          <select v-model="selectedPeriod" class="period-selector" @change="updateChartData">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <button class="btn-export" @click="exportReport">
            <i class="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <div class="summary-card">
          <div class="card-header">
            <div class="card-icon revenue">
              <i class="fas fa-coins"></i>
            </div>
            <div class="card-label">Total Revenue</div>
          </div>
          <div class="card-value">₱{{ formatCurrency(totalRevenue) }}</div>
          <div class="card-change" :class="revenueChange >= 0 ? 'positive' : 'negative'">
            {{ revenueChange >= 0 ? '+' : '' }}{{ revenueChange }}% vs previous period
          </div>
        </div>

        <div class="summary-card">
          <div class="card-header">
            <div class="card-icon orders">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="card-label">Total Orders</div>
          </div>
          <div class="card-value">{{ totalOrders }}</div>
          <div class="card-change" :class="ordersChange >= 0 ? 'positive' : 'negative'">
            {{ ordersChange >= 0 ? '+' : '' }}{{ ordersChange }}% vs previous period
          </div>
        </div>

        <div class="summary-card">
          <div class="card-header">
            <div class="card-icon items">
              <i class="fas fa-box"></i>
            </div>
            <div class="card-label">Items Sold</div>
          </div>
          <div class="card-value">{{ totalItemsSold }}</div>
          <div class="card-change" :class="itemsChange >= 0 ? 'positive' : 'negative'">
            {{ itemsChange >= 0 ? '+' : '' }}{{ itemsChange }}% vs previous period
          </div>
        </div>

        <div class="summary-card">
          <div class="card-header">
            <div class="card-icon avg">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="card-label">Avg Order Value</div>
          </div>
          <div class="card-value">₱{{ formatCurrency(averageOrderValue) }}</div>
          <div class="card-change" :class="avgOrderChange >= 0 ? 'positive' : 'negative'">
            {{ avgOrderChange >= 0 ? '+' : '' }}{{ avgOrderChange }}% vs previous period
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-card">
          <h3>Daily Sales Trend</h3>
          <div class="chart-container">
            <canvas ref="dailySalesChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Revenue by Product Category</h3>
          <div class="chart-container">
            <canvas ref="categoryChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="top-products-section">
        <h3>Top Performing Products</h3>
        <div class="products-table">
          <div class="table-header">
            <div class="table-cell">Product</div>
            <div class="table-cell">Category</div>
            <div class="table-cell">Units Sold</div>
            <div class="table-cell">Revenue</div>
            <div class="table-cell">Avg Rating</div>
          </div>
          <div v-for="product in topProducts" :key="product.id" class="table-row">
            <div class="table-cell product-info">
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="product-details">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-sku">SKU: {{ product.sku }}</div>
              </div>
            </div>
            <div class="table-cell">{{ product.category }}</div>
            <div class="table-cell">{{ product.unitsSold }}</div>
            <div class="table-cell">₱{{ formatCurrency(product.revenue) }}</div>
            <div class="table-cell">
              <div class="rating">
                <i v-for="star in 5" :key="star" class="fas fa-star" :class="{ 'filled': star <= product.rating }"></i>
                <span class="rating-value">{{ product.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales by Time Period -->
      <div class="time-analysis-section">
        <h3>Sales by Time Period</h3>
        <div class="time-grid">
          <div class="time-card">
            <div class="time-label">This Week</div>
            <div class="time-value">₱{{ formatCurrency(weekSales) }}</div>
            <div class="time-change" :class="weekChange >= 0 ? 'positive' : 'negative'">
              {{ weekChange >= 0 ? '+' : '' }}{{ weekChange }}%
            </div>
          </div>
          <div class="time-card">
            <div class="time-label">This Month</div>
            <div class="time-value">₱{{ formatCurrency(monthSales) }}</div>
            <div class="time-change" :class="monthChange >= 0 ? 'positive' : 'negative'">
              {{ monthChange >= 0 ? '+' : '' }}{{ monthChange }}%
            </div>
          </div>
          <div class="time-card">
            <div class="time-label">This Year</div>
            <div class="time-value">₱{{ formatCurrency(yearSales) }}</div>
            <div class="time-change" :class="yearChange >= 0 ? 'positive' : 'negative'">
              {{ yearChange >= 0 ? '+' : '' }}{{ yearChange }}%
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
  name: 'SalesSummary',
  components: {
    SellerLayout
  },
  setup() {
    const selectedPeriod = ref(30)
    const dailySalesChart = ref(null)
    const categoryChart = ref(null)
    let dailyChartInstance = null
    let categoryChartInstance = null

    // Mock data
    const totalRevenue = 156750.50
    const revenueChange = 12.5
    const totalOrders = 156
    const ordersChange = 8.2
    const totalItemsSold = 342
    const itemsChange = 15.6
    const averageOrderValue = 1004.81
    const avgOrderChange = 3.8

    const weekSales = 24500.75
    const weekChange = 12.3
    const monthSales = 78500.25
    const monthChange = 8.7
    const yearSales = 456200.80
    const yearChange = 15.2

    const topProducts = [
      {
        id: 1,
        name: 'Handwoven Abaca Bag',
        category: 'Bags',
        sku: 'BAG-001',
        unitsSold: 45,
        revenue: 22500,
        rating: 4.8,
        image: '/images/products/bag1.jpg'
      },
      {
        id: 2,
        name: 'Traditional Weaving Set',
        category: 'Crafts',
        sku: 'CFT-002',
        unitsSold: 32,
        revenue: 19200,
        rating: 4.9,
        image: '/images/products/weaving1.jpg'
      },
      {
        id: 3,
        name: 'Bamboo Home Decor',
        category: 'Home',
        sku: 'HME-003',
        unitsSold: 28,
        revenue: 16800,
        rating: 4.7,
        image: '/images/products/decor1.jpg'
      },
      {
        id: 4,
        name: 'Handmade Pottery Set',
        category: 'Home',
        sku: 'HME-004',
        unitsSold: 25,
        revenue: 15000,
        rating: 4.6,
        image: '/images/products/pottery1.jpg'
      }
    ]

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    const createDailySalesChart = () => {
      if (!dailySalesChart.value) return

      const ctx = dailySalesChart.value.getContext('2d')
      
      if (dailyChartInstance) {
        dailyChartInstance.destroy()
      }

      dailyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: generateDateLabels(selectedPeriod.value),
          datasets: [{
            label: 'Daily Sales',
            data: generateRandomData(selectedPeriod.value),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
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

    const createCategoryChart = () => {
      if (!categoryChart.value) return

      const ctx = categoryChart.value.getContext('2d')
      
      if (categoryChartInstance) {
        categoryChartInstance.destroy()
      }

      categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Bags', 'Crafts', 'Home', 'Accessories', 'Others'],
          datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ef4444',
              '#8b5cf6'
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

    const generateRandomData = (days) => {
      return Array.from({ length: days }, () => Math.floor(Math.random() * 2000) + 500)
    }

    const updateChartData = () => {
      createDailySalesChart()
      createCategoryChart()
    }

    const exportReport = () => {
      // Mock export functionality
      alert('Sales report exported successfully!')
    }

    onMounted(() => {
      createDailySalesChart()
      createCategoryChart()
    })

    onUnmounted(() => {
      if (dailyChartInstance) {
        dailyChartInstance.destroy()
      }
      if (categoryChartInstance) {
        categoryChartInstance.destroy()
      }
    })

    return {
      selectedPeriod,
      dailySalesChart,
      categoryChart,
      totalRevenue,
      revenueChange,
      totalOrders,
      ordersChange,
      totalItemsSold,
      itemsChange,
      averageOrderValue,
      avgOrderChange,
      weekSales,
      weekChange,
      monthSales,
      monthChange,
      yearSales,
      yearChange,
      topProducts,
      formatCurrency,
      updateChartData,
      exportReport
    }
  }
}
</script>

<style scoped>
.sales-summary {
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
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.125rem;
}

.card-icon.revenue { background-color: #3b82f6; }
.card-icon.orders { background-color: #10b981; }
.card-icon.items { background-color: #f59e0b; }
.card-icon.avg { background-color: #8b5cf6; }

.card-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: #6b7280;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.chart-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.chart-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: #1f2937;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.top-products-section {
  margin-bottom: 3rem;
}

.top-products-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.products-table {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
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

.product-info {
  gap: 1rem;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.product-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.product-sku {
  font-size: 0.75rem;
  color: #6b7280;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating .fas {
  font-size: 0.75rem;
  color: #f59e0b;
}

.rating .filled {
  color: #f59e0b;
}

.rating-value {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.time-analysis-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.time-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
}

.time-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.time-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.time-change {
  font-size: 0.75rem;
  font-weight: 600;
}

.time-change.positive { color: #10b981; }
.time-change.negative { color: #ef4444; }

/* Responsive styles */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .product-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>