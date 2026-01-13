<template>
    <div class="inventory-reports">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Inventory Reports</h1>
        <div class="header-actions">
          <select v-model="selectedReportType" class="report-selector" @change="generateReport">
            <option value="stock-levels">Stock Levels</option>
            <option value="turnover">Turnover Analysis</option>
            <option value="low-stock">Low Stock Alert</option>
            <option value="expired">Expired Items</option>
            <option value="movement">Movement Analysis</option>
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
            <div class="card-icon inventory">
              <i class="fas fa-warehouse"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Total Inventory Value</div>
              <div class="card-value">₱{{ formatCurrency(reportData.totalValue) }}</div>
              <div class="card-change" :class="valueChange >= 0 ? 'positive' : 'negative'">
                {{ valueChange >= 0 ? '+' : '' }}{{ Math.abs(valueChange) }}% vs previous period
              </div>
            </div>
          </div>

          <div class="summary-card">
            <div class="card-icon items">
              <i class="fas fa-boxes"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Total Items</div>
              <div class="card-value">{{ reportData.totalItems }}</div>
              <div class="card-change" :class="itemsChange >= 0 ? 'positive' : 'negative'">
                {{ itemsChange >= 0 ? '+' : '' }}{{ Math.abs(itemsChange) }} items
              </div>
            </div>
          </div>

          <div class="summary-card">
            <div class="card-icon turnover">
              <i class="fas fa-sync"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Turnover Rate</div>
              <div class="card-value">{{ reportData.turnoverRate }}%</div>
              <div class="card-change" :class="turnoverChange >= 0 ? 'positive' : 'negative'">
                {{ turnoverChange >= 0 ? '+' : '' }}{{ Math.abs(turnoverChange) }}% vs previous period
              </div>
            </div>
          </div>

          <div class="summary-card">
            <div class="card-icon alert">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Low Stock Items</div>
              <div class="card-value">{{ reportData.lowStockItems }}</div>
              <div class="card-change" :class="lowStockChange >= 0 ? 'positive' : 'negative'">
                {{ lowStockChange >= 0 ? '+' : '' }}{{ Math.abs(lowStockChange) }} items
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-grid">
          <div class="chart-card">
            <h3>Stock Levels by Category</h3>
            <div class="chart-container">
              <canvas ref="categoryChart"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <h3>Inventory Turnover</h3>
            <div class="chart-container">
              <canvas ref="turnoverChart"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <h3>Stock Movement</h3>
            <div class="chart-container">
              <canvas ref="movementChart"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <h3>Low Stock Analysis</h3>
            <div class="chart-container">
              <canvas ref="lowStockChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventory Tables -->
      <div class="tables-section">
        <div class="table-card">
          <h3>Low Stock Items</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th>Reorder Level</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in lowStockItems" :key="item.id" :class="getStockRowClass(item)">
                  <td>
                    <div class="product-info">
                      <img :src="item.image" :alt="item.name" class="product-thumb">
                      <div class="product-details">
                        <div class="product-name">{{ item.name }}</div>
                        <div class="product-sku">{{ item.sku }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.stock }}</td>
                  <td>{{ item.threshold }}</td>
                  <td>
                    <span class="status-badge" :class="getStockStatusClass(item)">
                      {{ getStockStatusText(item) }}
                    </span>
                  </td>
                  <td>{{ item.reorderLevel }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="table-card">
          <h3>Fast Moving Items</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Units Sold</th>
                  <th>Stock Level</th>
                  <th>Turnover Rate</th>
                  <th>Days to Reorder</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in fastMovingItems" :key="item.id">
                  <td>
                    <div class="product-info">
                      <img :src="item.image" :alt="item.name" class="product-thumb">
                      <div class="product-details">
                        <div class="product-name">{{ item.name }}</div>
                        <div class="product-sku">{{ item.sku }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.unitsSold }}</td>
                  <td>{{ item.stock }}</td>
                  <td>{{ item.turnoverRate }}%</td>
                  <td>{{ item.daysToReorder }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Inventory Analytics -->
      <div class="analytics-section">
        <h3>Inventory Analytics</h3>
        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-header">
              <h4>Stock Analysis</h4>
              <div class="analytics-actions">
                <button class="btn-outline" @click="viewStockAnalytics">
                  <i class="fas fa-chart-line"></i> View Details
                </button>
              </div>
            </div>
            <div class="analytics-content">
              <div class="insight-item">
                <span class="insight-label">Overstocked Items</span>
                <span class="insight-value">{{ analytics.overstockedItems }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Dead Stock Value</span>
                <span class="insight-value">₱{{ formatCurrency(analytics.deadStockValue) }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Average Stock Age</span>
                <span class="insight-value">{{ analytics.avgStockAge }} days</span>
              </div>
            </div>
          </div>

          <div class="analytics-card">
            <div class="analytics-header">
              <h4>Reorder Analysis</h4>
              <div class="analytics-actions">
                <button class="btn-outline" @click="viewReorderAnalytics">
                  <i class="fas fa-truck"></i> View Details
                </button>
              </div>
            </div>
            <div class="analytics-content">
              <div class="insight-item">
                <span class="insight-label">Items to Reorder</span>
                <span class="insight-value">{{ analytics.itemsToReorder }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Estimated Reorder Cost</span>
                <span class="insight-value">₱{{ formatCurrency(analytics.reorderCost) }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Lead Time Average</span>
                <span class="insight-value">{{ analytics.leadTime }} days</span>
              </div>
            </div>
          </div>

          <div class="analytics-card">
            <div class="analytics-header">
              <h4>Waste Analysis</h4>
              <div class="analytics-actions">
                <button class="btn-outline" @click="viewWasteAnalytics">
                  <i class="fas fa-trash"></i> View Details
                </button>
              </div>
            </div>
            <div class="analytics-content">
              <div class="insight-item">
                <span class="insight-label">Expired Items</span>
                <span class="insight-value">{{ analytics.expiredItems }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Waste Cost</span>
                <span class="insight-value">₱{{ formatCurrency(analytics.wasteCost) }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">Waste Percentage</span>
                <span class="insight-value">{{ analytics.wastePercentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="recommendations-section">
        <h3>Inventory Recommendations</h3>
        <div class="recommendations-grid">
          <div class="recommendation-card" v-for="rec in recommendations" :key="rec.id">
            <div class="rec-icon">
              <i :class="rec.icon"></i>
            </div>
            <div class="rec-content">
              <h4>{{ rec.title }}</h4>
              <p>{{ rec.description }}</p>
              <div class="rec-actions">
                <button class="btn-secondary" @click="executeRecommendation(rec)">
                  <i class="fas fa-play"></i> {{ rec.action }}
                </button>
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
              <h4>Inventory Excel</h4>
              <p>Export complete inventory data</p>
              <button class="btn-secondary" @click="exportInventoryExcel">
                <i class="fas fa-download"></i> Download Excel
              </button>
            </div>
          </div>

          <div class="export-card">
            <div class="export-icon">
              <i class="fas fa-file-pdf"></i>
            </div>
            <div class="export-content">
              <h4>Inventory PDF</h4>
              <p>Generate inventory report PDF</p>
              <button class="btn-secondary" @click="exportInventoryPDF">
                <i class="fas fa-download"></i> Download PDF
              </button>
            </div>
          </div>

          <div class="export-card">
            <div class="export-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="export-content">
              <h4>Reorder List</h4>
              <p>Export items that need reordering</p>
              <button class="btn-secondary" @click="exportReorderList">
                <i class="fas fa-download"></i> Download List
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
  name: 'InventoryReports',
  components: {
    SellerLayout
  },
  setup() {
    const selectedReportType = ref('stock-levels')
    const selectedTimeRange = ref('30')
    const categoryChart = ref(null)
    const turnoverChart = ref(null)
    const movementChart = ref(null)
    const lowStockChart = ref(null)
    let categoryChartInstance = null
    let turnoverChartInstance = null
    let movementChartInstance = null
    let lowStockChartInstance = null

    const reportData = ref({
      totalValue: 250000,
      totalItems: 156,
      turnoverRate: 65.2,
      lowStockItems: 12
    })

    const valueChange = ref(8.5)
    const itemsChange = ref(15)
    const turnoverChange = ref(3.2)
    const lowStockChange = ref(-2)

    const lowStockItems = ref([
      {
        id: 1,
        name: 'Handwoven Abaca Bag',
        category: 'Bags',
        sku: 'BAG-001',
        stock: 3,
        threshold: 5,
        reorderLevel: 10,
        image: '/images/products/bag1.jpg'
      },
      {
        id: 2,
        name: 'Traditional Weaving Set',
        category: 'Crafts',
        sku: 'CFT-002',
        stock: 2,
        threshold: 5,
        reorderLevel: 8,
        image: '/images/products/weaving1.jpg'
      },
      {
        id: 3,
        name: 'Bamboo Home Decor',
        category: 'Home',
        sku: 'HME-003',
        stock: 0,
        threshold: 3,
        reorderLevel: 6,
        image: '/images/products/decor1.jpg'
      }
    ])

    const fastMovingItems = ref([
      {
        id: 1,
        name: 'Handwoven Abaca Bag',
        category: 'Bags',
        sku: 'BAG-001',
        unitsSold: 45,
        stock: 15,
        turnoverRate: 85.2,
        daysToReorder: 7
      },
      {
        id: 2,
        name: 'Traditional Weaving Set',
        category: 'Crafts',
        sku: 'CFT-002',
        unitsSold: 32,
        stock: 8,
        turnoverRate: 72.5,
        daysToReorder: 5
      },
      {
        id: 3,
        name: 'Bamboo Home Decor',
        category: 'Home',
        sku: 'HME-003',
        unitsSold: 28,
        stock: 0,
        turnoverRate: 91.3,
        daysToReorder: 2
      }
    ])

    const analytics = ref({
      overstockedItems: 8,
      deadStockValue: 15000,
      avgStockAge: 45,
      itemsToReorder: 15,
      reorderCost: 45000,
      leadTime: 7,
      expiredItems: 3,
      wasteCost: 2500,
      wastePercentage: 1.2
    })

    const recommendations = ref([
      {
        id: 1,
        title: 'Reorder Low Stock Items',
        description: '12 items are below their minimum stock threshold. Consider placing orders soon.',
        icon: 'fas fa-truck',
        action: 'Create PO'
      },
      {
        id: 2,
        title: 'Clear Dead Stock',
        description: '8 items have been in stock for over 90 days. Consider discounting or bundling.',
        icon: 'fas fa-tags',
        action: 'Create Sale'
      },
      {
        id: 3,
        title: 'Review Supplier Lead Times',
        description: 'Average lead time is 7 days. Consider finding faster suppliers for fast-moving items.',
        icon: 'fas fa-clock',
        action: 'Review Suppliers'
      }
    ])

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
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
          labels: ['Bags', 'Crafts', 'Home', 'Kitchen'],
          datasets: [{
            data: [45, 32, 53, 26],
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

    const createTurnoverChart = () => {
      if (!turnoverChart.value) return

      const ctx = turnoverChart.value.getContext('2d')
      
      if (turnoverChartInstance) {
        turnoverChartInstance.destroy()
      }

      turnoverChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Bags', 'Crafts', 'Home', 'Kitchen'],
          datasets: [{
            label: 'Turnover Rate (%)',
            data: [85.2, 72.5, 61.8, 45.3],
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
              max: 100,
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

    const createMovementChart = () => {
      if (!movementChart.value) return

      const ctx = movementChart.value.getContext('2d')
      
      if (movementChartInstance) {
        movementChartInstance.destroy()
      }

      movementChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Stock In',
            data: [150, 200, 180, 220],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }, {
            label: 'Stock Out',
            data: [120, 160, 190, 170],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
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

    const createLowStockChart = () => {
      if (!lowStockChart.value) return

      const ctx = lowStockChart.value.getContext('2d')
      
      if (lowStockChartInstance) {
        lowStockChartInstance.destroy()
      }

      lowStockChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: lowStockItems.value.map(item => item.name),
          datasets: [{
            label: 'Current Stock',
            data: lowStockItems.value.map(item => item.stock),
            backgroundColor: '#ef4444',
            borderRadius: 4
          }, {
            label: 'Threshold',
            data: lowStockItems.value.map(item => item.threshold),
            backgroundColor: '#f59e0b',
            borderRadius: 4
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

    const getStockRowClass = (item) => {
      if (item.stock === 0) return 'out-of-stock'
      if (item.stock < item.threshold) return 'low-stock'
      return 'in-stock'
    }

    const getStockStatusClass = (item) => {
      if (item.stock === 0) return 'out-of-stock'
      if (item.stock < item.threshold) return 'low-stock'
      return 'in-stock'
    }

    const getStockStatusText = (item) => {
      if (item.stock === 0) return 'Out of Stock'
      if (item.stock < item.threshold) return 'Low Stock'
      return 'In Stock'
    }

    const generateReport = () => {
      alert(`Generating ${selectedReportType.value} report for the last ${selectedTimeRange.value} days...`)
    }

    const generateCustomReport = () => {
      alert('Generating custom inventory report...')
    }

    const exportReport = () => {
      alert('Exporting inventory report...')
    }

    const exportInventoryExcel = () => {
      alert('Exporting inventory Excel report...')
    }

    const exportInventoryPDF = () => {
      alert('Exporting inventory PDF report...')
    }

    const exportReorderList = () => {
      alert('Exporting reorder list...')
    }

    const viewStockAnalytics = () => {
      alert('Viewing stock analytics...')
    }

    const viewReorderAnalytics = () => {
      alert('Viewing reorder analytics...')
    }

    const viewWasteAnalytics = () => {
      alert('Viewing waste analytics...')
    }

    const executeRecommendation = (recommendation) => {
      alert(`Executing recommendation: ${recommendation.title}`)
    }

    onMounted(() => {
      createCategoryChart()
      createTurnoverChart()
      createMovementChart()
      createLowStockChart()
    })

    onUnmounted(() => {
      if (categoryChartInstance) {
        categoryChartInstance.destroy()
      }
      if (turnoverChartInstance) {
        turnoverChartInstance.destroy()
      }
      if (movementChartInstance) {
        movementChartInstance.destroy()
      }
      if (lowStockChartInstance) {
        lowStockChartInstance.destroy()
      }
    })

    return {
      selectedReportType,
      selectedTimeRange,
      categoryChart,
      turnoverChart,
      movementChart,
      lowStockChart,
      reportData,
      valueChange,
      itemsChange,
      turnoverChange,
      lowStockChange,
      lowStockItems,
      fastMovingItems,
      analytics,
      recommendations,
      formatCurrency,
      getStockRowClass,
      getStockStatusClass,
      getStockStatusText,
      generateReport,
      generateCustomReport,
      exportReport,
      exportInventoryExcel,
      exportInventoryPDF,
      exportReorderList,
      viewStockAnalytics,
      viewReorderAnalytics,
      viewWasteAnalytics,
      executeRecommendation
    }
  }
}
</script>

<style scoped>
.inventory-reports {
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

.summary-card.inventory { border-left: 4px solid #3b82f6; }
.summary-card.items { border-left: 4px solid #10b981; }
.summary-card.turnover { border-left: 4px solid #8b5cf6; }
.summary-card.alert { border-left: 4px solid #f59e0b; }

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

.card-icon.items { background-color: #10b981; }
.card-icon.turnover { background-color: #8b5cf6; }
.card-icon.alert { background-color: #f59e0b; }

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

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.in-stock {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.low-stock {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.out-of-stock {
  background-color: #fee2e2;
  color: #991b1b;
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

.recommendations-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.recommendation-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  transition: transform 0.2s;
}

.recommendation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rec-icon {
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

.rec-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.rec-content p {
  margin: 0 0 1rem 0;
  color: #6b7280;
  line-height: 1.5;
}

.rec-actions {
  display: flex;
  gap: 0.5rem;
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
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>