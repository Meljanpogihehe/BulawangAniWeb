<template>
    <div class="commissions-page">
      <div class="page-header">
        <h1>Commission Settings</h1>
        <p>Configure commission rates and fee structures</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary">Add New Commission Rule</button>
          <div class="search-box">
            <input type="text" placeholder="Search commission rules..." />
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <div class="metric-value">{{ avgCommission }}%</div>
              <div class="metric-label">Average Commission</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🏪</div>
            <div class="metric-content">
              <div class="metric-value">{{ totalRules }}</div>
              <div class="metric-label">Commission Rules</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <div class="metric-value">₱{{ totalCommission }}</div>
              <div class="metric-label">Total Commission</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🔄</div>
            <div class="metric-content">
              <div class="metric-value">{{ activeRules }}</div>
              <div class="metric-label">Active Rules</div>
            </div>
          </div>
        </div>
        
        <div class="table-container">
          <table class="commissions-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Category</th>
                <th>Commission Type</th>
                <th>Rate</th>
                <th>Minimum Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="commission in commissions" :key="commission.id">
                <td>
                  <div class="rule-name">{{ commission.name }}</div>
                  <div class="rule-description">{{ commission.description }}</div>
                </td>
                <td>{{ commission.category }}</td>
                <td>
                  <span :class="['type-badge', commission.type.toLowerCase()]">
                    {{ commission.type }}
                  </span>
                </td>
                <td>{{ commission.rate }}%</td>
                <td>₱{{ commission.minimumFee }}</td>
                <td>
                  <span :class="['status-badge', commission.status.toLowerCase()]">
                    {{ commission.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-edit">Edit</button>
                  <button class="btn-toggle" @click="toggleStatus(commission)">
                    {{ commission.status === 'Active' ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="commission-calculator">
          <h3>Commission Calculator</h3>
          <div class="calculator-form">
            <div class="form-group">
              <label>Sales Amount</label>
              <input type="number" v-model="calculator.amount" placeholder="Enter sales amount" />
            </div>
            <div class="form-group">
              <label>Category</label>
              <select v-model="calculator.category">
                <option value="">Select Category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="calculator-result">
              <div class="result-item">
                <span class="label">Commission Rate:</span>
                <span class="value">{{ calculatedRate }}%</span>
              </div>
              <div class="result-item">
                <span class="label">Commission Amount:</span>
                <span class="value">₱{{ calculatedAmount }}</span>
              </div>
              <div class="result-item">
                <span class="label">Seller Receives:</span>
                <span class="value">₱{{ sellerReceives }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Commissions',
  data() {
    return {
      avgCommission: 12.5,
      totalRules: 8,
      totalCommission: 15000,
      activeRules: 6,
      commissions: [
        { id: 1, name: 'Standard Commission', category: 'All Categories', type: 'Percentage', rate: 12, minimumFee: 50, status: 'Active', description: 'Standard commission for all products' },
        { id: 2, name: 'Premium Category', category: 'Organic', type: 'Percentage', rate: 15, minimumFee: 75, status: 'Active', description: 'Higher commission for organic products' },
        { id: 3, name: 'Low Value Items', category: 'Accessories', type: 'Fixed', rate: 0, minimumFee: 25, status: 'Active', description: 'Fixed fee for low-value items' },
        { id: 4, name: 'High Value Items', category: 'Electronics', type: 'Percentage', rate: 8, minimumFee: 100, status: 'Inactive', description: 'Lower percentage for high-value electronics' },
        { id: 5, name: 'Grocery Items', category: 'Grocery', type: 'Percentage', rate: 10, minimumFee: 40, status: 'Active', description: 'Standard grocery commission' }
      ],
      categories: ['All Categories', 'Organic', 'Accessories', 'Electronics', 'Grocery', 'Furniture', 'Clothing'],
      calculator: {
        amount: 10000,
        category: 'All Categories'
      }
    }
  },
  computed: {
    calculatedRate() {
      const rule = this.commissions.find(c => c.category === this.calculator.category || c.category === 'All Categories')
      return rule ? rule.rate : 0
    },
    calculatedAmount() {
      const rate = this.calculatedRate / 100
      const amount = this.calculator.amount * rate
      const rule = this.commissions.find(c => c.category === this.calculator.category || c.category === 'All Categories')
      const minimumFee = rule ? rule.minimumFee : 0
      return Math.max(amount, minimumFee)
    },
    sellerReceives() {
      return this.calculator.amount - this.calculatedAmount
    }
  },
  methods: {
    toggleStatus(commission) {
      commission.status = commission.status === 'Active' ? 'Inactive' : 'Active'
    }
  }
}
</script>

<style scoped>
.commissions-page {
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

.btn-primary {
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

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
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

.commissions-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 3rem;
}

.commissions-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.commissions-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.commissions-table tr:hover {
  background: #f8faf7;
}

.rule-name {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.rule-description {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.percentage {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.type-badge.fixed {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.inactive {
  background: #e2e3e5;
  color: #383d41;
  border: 1px solid #d6d8db;
}

.btn-edit, .btn-toggle {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
}

.btn-edit {
  background: #eafaf1;
  color: #27ae60;
}

.btn-edit:hover {
  background: #d4edda;
}

.btn-toggle {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.btn-toggle:hover {
  background: #bbdefb;
}

.commission-calculator {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
}

.commission-calculator h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.calculator-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input, .form-group select {
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;
}

.form-group input:focus, .form-group select:focus {
  border-color: #27ae60;
}

.calculator-result {
  grid-column: 1 / -1;
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8faf7;
  border-radius: 8px;
  border: 1px solid #e8f1e1;
}

.label {
  color: #7f8c8d;
  font-weight: 600;
}

.value {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .commissions-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .commissions-table {
    font-size: 0.9rem;
  }
  
  .commissions-table th, .commissions-table td {
    padding: 0.75rem;
  }
  
  .calculator-form {
    grid-template-columns: 1fr;
  }
}
</style>