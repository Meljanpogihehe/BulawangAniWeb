<template>
    <div class="seller-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">Seller Dashboard</h1>
          <div class="welcome-message">
            Welcome back, {{ sellerName }}!
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-primary" @click="navigateTo('/seller/products/add')">
            <i class="fas fa-plus"></i> Add New Product
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Sales</div>
            <div class="stat-value">₱{{ formatCurrency(totalSales) }}</div>
            <div class="stat-change positive">+{{ salesGrowth }}% from last month</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">{{ totalOrders }}</div>
            <div class="stat-change">New: {{ newOrders }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Products</div>
            <div class="stat-value">{{ totalProducts }}</div>
            <div class="stat-change">Active: {{ activeProducts }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-wallet"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Available Balance</div>
            <div class="stat-value">₱{{ formatCurrency(availableBalance) }}</div>
            <div class="stat-change">Pending: ₱{{ formatCurrency(pendingBalance) }}</div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="dashboard-section">
        <h2>Recent Activity</h2>
        <div class="activity-feed">
          <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
            <div class="activity-icon">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard-section">
        <h2>Quick Actions</h2>
        <div class="quick-actions-grid">
          <div class="action-card" @click="navigateTo('/seller/orders/new')">
            <div class="action-icon">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="action-content">
              <div class="action-title">New Orders</div>
              <div class="action-subtitle">{{ newOrders }} pending</div>
            </div>
          </div>

          <div class="action-card" @click="navigateTo('/seller/products')">
            <div class="action-icon">
              <i class="fas fa-list"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Product List</div>
              <div class="action-subtitle">Manage products</div>
            </div>
          </div>

          <div class="action-card" @click="navigateTo('/seller/stock')">
            <div class="action-icon">
              <i class="fas fa-warehouse"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Stock Management</div>
              <div class="action-subtitle">Low stock alerts</div>
            </div>
          </div>

          <div class="action-card" @click="navigateTo('/seller/payments')">
            <div class="action-icon">
              <i class="fas fa-money-bill-wave"></i>
            </div>
            <div class="action-content">
              <div class="action-title">Payments</div>
              <div class="action-subtitle">View earnings</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Chart -->
      <div class="dashboard-section">
        <h2>Monthly Sales</h2>
        <div class="chart-container">
          <canvas ref="salesChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SellerDashboard',
  setup() {
    const router = useRouter()
    const salesChart = ref(null)
    let chartInstance = null

    const sellerName = 'John Doe'
    const totalSales = 156750.50
    const salesGrowth = 12.5
    const totalOrders = 156
    const newOrders = 8
    const totalProducts = 24
    const activeProducts = 22
    const availableBalance = 45230.75
    const pendingBalance = 12500.00

    const recentActivity = [
      {
        id: 1,
        icon: 'fas fa-shopping-cart',
        title: 'New order received from Maria Santos',
        time: '2 hours ago'
      },
      {
        id: 2,
        icon: 'fas fa-box',
        title: 'Product "Handmade Basket" stock updated',
        time: '4 hours ago'
      },
      {
        id: 3,
        icon: 'fas fa-star',
        title: 'New 5-star review for "Traditional Weaving"',
        time: '1 day ago'
      },
      {
        id: 4,
        icon: 'fas fa-money-bill',
        title: 'Payout of ₱15,000 processed',
        time: '2 days ago'
      }
    ]

    const navigateTo = (path) => {
      router.push(path)
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    const createSalesChart = () => {
      if (!salesChart.value) return

      const ctx = salesChart.value.getContext('2d')
      
      // Destroy existing chart if any
      if (chartInstance) {
        chartInstance.destroy()
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Sales (PHP)',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
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

    onMounted(() => {
      createSalesChart()
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      salesChart,
      sellerName,
      totalSales,
      salesGrowth,
      totalOrders,
      newOrders,
      totalProducts,
      activeProducts,
      availableBalance,
      pendingBalance,
      recentActivity,
      navigateTo,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.seller-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.welcome-message {
  color: #6b7280;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #3b82f6;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.75rem;
  color: #10b981;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.dashboard-section {
  margin-bottom: 3rem;
}

.dashboard-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.activity-feed {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 50px;
  height: 50px;
  background: #f3f4f6;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1.25rem;
}

.action-content {
  flex: 1;
}

.action-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.action-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.chart-container {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  height: 300px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>