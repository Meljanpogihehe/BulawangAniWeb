<template>
    <div class="product-performance-page">
      <div class="page-header">
        <h1>Product Performance</h1>
        <p>Track product sales, ratings, and inventory performance</p>
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
            <select v-model="categoryFilter">
              <option value="all">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search products..." />
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <div class="metric-value">{{ topSellingProduct }}</div>
              <div class="metric-label">Top Selling</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">⭐</div>
            <div class="metric-content">
              <div class="metric-value">{{ avgRating }}</div>
              <div class="metric-label">Avg Rating</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">📦</div>
            <div class="metric-content">
              <div class="metric-value">{{ lowStockCount }}</div>
              <div class="metric-label">Low Stock</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🔄</div>
            <div class="metric-content">
              <div class="metric-value">{{ returnRate }}%</div>
              <div class="metric-label">Return Rate</div>
            </div>
          </div>
        </div>
        
        <div class="charts-section">
          <div class="chart-card">
            <h3>Top Performing Products</h3>
            <div class="performance-list">
              <div class="performance-item" v-for="product in topProducts" :key="product.name">
                <div class="product-info">
                  <img :src="product.image" :alt="product.name" class="product-thumb" />
                  <div>
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-category">{{ product.category }}</div>
                  </div>
                </div>
                <div class="performance-metrics">
                  <div class="metric">
                    <span class="metric-label">Sales:</span>
                    <span class="metric-value">₱{{ product.sales }}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Units:</span>
                    <span class="metric-value">{{ product.units }}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Rating:</span>
                    <span class="metric-value">{{ product.rating }}⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chart-card">
            <h3>Category Performance</h3>
            <div class="category-performance">
              <div class="category-item" v-for="category in categoryPerformance" :key="category.name">
                <div class="category-header">
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-sales">₱{{ category.sales }}</span>
                </div>
                <div class="category-bar" :style="{ width: category.percentage + '%' }"></div>
                <div class="category-details">
                  <span class="detail-item">{{ category.products }} products</span>
                  <span class="detail-item">{{ category.avgRating }}⭐ avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="table-container">
          <table class="performance-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Sales</th>
                <th>Units Sold</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>
                  <div class="product-cell">
                    <img :src="product.image" :alt="product.name" class="product-image" />
                    <div>
                      <div class="product-title">{{ product.name }}</div>
                      <div class="product-sku">SKU: {{ product.sku }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ product.category }}</td>
                <td>₱{{ product.sales }}</td>
                <td>{{ product.unitsSold }}</td>
                <td>
                  <span :class="['stock-badge', getStockClass(product.stock)]">
                    {{ product.stock }}
                  </span>
                </td>
                <td>
                  <div class="rating-cell">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-value">{{ product.rating }}</span>
                  </div>
                </td>
                <td>
                  <button class="btn-view">View</button>
                  <button class="btn-edit">Edit</button>
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
  name: 'ProductPerformance',
  data() {
    return {
      timePeriod: 'month',
      categoryFilter: 'all',
      topSellingProduct: 'Premium Dinorado Rice',
      avgRating: 4.6,
      lowStockCount: 12,
      returnRate: 2.5,
      categories: ['Grains', 'Vegetables', 'Fruits', 'Organic', 'Dairy'],
      topProducts: [
        { name: 'Premium Dinorado Rice', category: 'Grains', sales: 45000, units: 20, rating: 4.8, image: 'https://images.unsplash.com/photo-1586201375761-6b6e044c1844?w=100' },
        { name: 'Organic Benguet Tomatoes', category: 'Vegetables', sales: 32000, units: 267, rating: 4.7, image: 'https://images.unsplash.com/photo-1592924357228-911d3e383fa4?w=100' },
        { name: 'Davao Golden Bananas', category: 'Fruits', sales: 25500, units: 300, rating: 4.6, image: 'https://images.unsplash.com/photo-1571771894821-ad99026107b8?w=100' }
      ],
      categoryPerformance: [
        { name: 'Grains', sales: 45000, percentage: 35, products: 15, avgRating: 4.7 },
        { name: 'Vegetables', sales: 35000, percentage: 27, products: 25, avgRating: 4.5 },
        { name: 'Fruits', sales: 30000, percentage: 23, products: 18, avgRating: 4.6 },
        { name: 'Organic', sales: 25000, percentage: 19, products: 12, avgRating: 4.8 },
        { name: 'Dairy', sales: 15000, percentage: 12, products: 8, avgRating: 4.4 }
      ],
      products: [
        { id: 1, name: 'Premium Dinorado Rice', sku: 'RICE-001', category: 'Grains', sales: 45000, unitsSold: 20, stock: 50, rating: 4.8, image: 'https://images.unsplash.com/photo-1586201375761-6b6e044c1844?w=100' },
        { id: 2, name: 'Organic Benguet Tomatoes', sku: 'TOM-001', category: 'Vegetables', sales: 32000, unitsSold: 267, stock: 33, rating: 4.7, image: 'https://images.unsplash.com/photo-1592924357228-911d3e383fa4?w=100' },
        { id: 3, name: 'Davao Golden Bananas', sku: 'BAN-001', category: 'Fruits', sales: 25500, unitsSold: 300, stock: 12, rating: 4.6, image: 'https://images.unsplash.com/photo-1571771894821-ad99026107b8?w=100' },
        { id: 4, name: 'Wild Bukidnon Honey', sku: 'HON-001', category: 'Organic', sales: 22500, unitsSold: 50, stock: 25, rating: 4.9, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=100' },
        { id: 5, name: 'Fresh Carrots', sku: 'CAR-001', category: 'Vegetables', sales: 18000, unitsSold: 300, stock: 8, rating: 4.4, image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100' }
      ]
    }
  },
  computed: {
    filteredProducts() {
      if (this.categoryFilter === 'all') {
        return this.products
      }
      return this.products.filter(product => product.category === this.categoryFilter)
    }
  },
  methods: {
    getStockClass(stock) {
      if (stock <= 10) return 'low-stock'
      if (stock <= 25) return 'medium-stock'
      return 'high-stock'
    }
  }
}
</script>

<style scoped>
.product-performance-page {
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

.performance-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.performance-item {
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-thumb {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e8f1e1;
}

.product-name {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.product-category {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;
}

.metric {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.metric-label {
  color: #7f8c8d;
  font-size: 0.8rem;
}

.metric-value {
  font-weight: 700;
  color: #2c3e50;
}

.category-performance {
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

.category-header {
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
  margin-bottom: 0.5rem;
}

.category-details {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #7f8c8d;
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

.product-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e8f1e1;
}

.product-title {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.product-sku {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.stock-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.stock-badge.low-stock {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.stock-badge.medium-stock {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.stock-badge.high-stock {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.rating-cell {
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
  border: 1px solid #bbdefb;
}

.btn-edit:hover {
  background: #bbdefb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-performance-page {
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
  
  .performance-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .performance-metrics {
    width: 100%;
    justify-content: space-between;
  }
  
  .performance-table {
    font-size: 0.9rem;
  }
  
  .performance-table th, .performance-table td {
    padding: 0.75rem;
  }
  
  .product-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>