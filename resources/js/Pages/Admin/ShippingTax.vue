<template>
    <div class="shipping-tax-page">
      <div class="page-header">
        <h1>Shipping & Tax Settings</h1>
        <p>Configure shipping rates and tax calculations</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="showCreateShipping = !showCreateShipping">
            {{ showCreateShipping ? 'Cancel' : 'Add Shipping Rate' }}
          </button>
          <button class="btn-primary" @click="showCreateTax = !showCreateTax" style="background: #f39c12;">
            {{ showCreateTax ? 'Cancel' : 'Add Tax Rate' }}
          </button>
        </div>
        
        <!-- Shipping Rates Section -->
        <div class="section-card">
          <h3>Shipping Rates</h3>
          <div class="create-form" v-if="showCreateShipping">
            <h4>Add New Shipping Rate</h4>
            <form @submit.prevent="createShippingRate" class="rate-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Service Name</label>
                  <input type="text" v-model="newShipping.serviceName" placeholder="e.g., Standard Delivery" required />
                </div>
                <div class="form-group">
                  <label>Delivery Time</label>
                  <input type="text" v-model="newShipping.deliveryTime" placeholder="e.g., 3-5 business days" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Base Price</label>
                  <input type="number" v-model="newShipping.basePrice" step="0.01" min="0" required />
                </div>
                <div class="form-group">
                  <label>Per kg Price</label>
                  <input type="number" v-model="newShipping.perKgPrice" step="0.01" min="0" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Minimum Order</label>
                  <input type="number" v-model="newShipping.minimumOrder" step="0.01" min="0" />
                </div>
                <div class="form-group">
                  <label>Status</label>
                  <select v-model="newShipping.status">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-submit">Add Rate</button>
                <button type="button" @click="showCreateShipping = false" class="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
          
          <div class="rates-grid">
            <div class="rate-card" v-for="rate in shippingRates" :key="rate.id">
              <div class="rate-header">
                <h4>{{ rate.serviceName }}</h4>
                <span :class="['status-badge', rate.status]">{{ rate.status }}</span>
              </div>
              <div class="rate-details">
                <div class="detail-row">
                  <span class="label">Delivery Time:</span>
                  <span class="value">{{ rate.deliveryTime }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Base Price:</span>
                  <span class="value">₱{{ rate.basePrice }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Per kg:</span>
                  <span class="value">₱{{ rate.perKgPrice }}</span>
                </div>
                <div class="detail-row" v-if="rate.minimumOrder">
                  <span class="label">Min Order:</span>
                  <span class="value">₱{{ rate.minimumOrder }}</span>
                </div>
              </div>
              <div class="rate-actions">
                <button class="btn-edit">Edit</button>
                <button class="btn-delete" @click="deleteShippingRate(rate.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tax Rates Section -->
        <div class="section-card">
          <h3>Tax Rates</h3>
          <div class="create-form" v-if="showCreateTax">
            <h4>Add New Tax Rate</h4>
            <form @submit.prevent="createTaxRate" class="rate-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Tax Name</label>
                  <input type="text" v-model="newTax.taxName" placeholder="e.g., VAT" required />
                </div>
                <div class="form-group">
                  <label>Tax Rate (%)</label>
                  <input type="number" v-model="newTax.taxRate" step="0.01" min="0" max="100" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Tax Type</label>
                  <select v-model="newTax.taxType">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Applicable To</label>
                  <select v-model="newTax.applicableTo">
                    <option value="all">All Products</option>
                    <option value="food">Food Items</option>
                    <option value="non_food">Non-Food Items</option>
                  </select>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-submit">Add Tax</button>
                <button type="button" @click="showCreateTax = false" class="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
          
          <div class="rates-grid">
            <div class="rate-card" v-for="tax in taxRates" :key="tax.id">
              <div class="rate-header">
                <h4>{{ tax.taxName }}</h4>
                <span class="tax-rate">{{ tax.taxRate }}%</span>
              </div>
              <div class="rate-details">
                <div class="detail-row">
                  <span class="label">Type:</span>
                  <span class="value">{{ tax.taxType }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Applicable To:</span>
                  <span class="value">{{ tax.applicableTo }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Effective:</span>
                  <span class="value">{{ formatDate(tax.effectiveDate) }}</span>
                </div>
              </div>
              <div class="rate-actions">
                <button class="btn-edit">Edit</button>
                <button class="btn-delete" @click="deleteTaxRate(tax.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ShippingTax',
  data() {
    return {
      showCreateShipping: false,
      showCreateTax: false,
      newShipping: {
        serviceName: '',
        deliveryTime: '',
        basePrice: 0,
        perKgPrice: 0,
        minimumOrder: 0,
        status: 'active'
      },
      newTax: {
        taxName: '',
        taxRate: 0,
        taxType: 'percentage',
        applicableTo: 'all',
        effectiveDate: new Date().toISOString().split('T')[0]
      },
      shippingRates: [
        {
          id: 1,
          serviceName: 'Standard Delivery',
          deliveryTime: '3-5 business days',
          basePrice: 150,
          perKgPrice: 25,
          minimumOrder: 0,
          status: 'active'
        },
        {
          id: 2,
          serviceName: 'Express Delivery',
          deliveryTime: '1-2 business days',
          basePrice: 300,
          perKgPrice: 50,
          minimumOrder: 1000,
          status: 'active'
        },
        {
          id: 3,
          serviceName: 'Same Day Delivery',
          deliveryTime: 'Same day',
          basePrice: 500,
          perKgPrice: 100,
          minimumOrder: 2000,
          status: 'inactive'
        }
      ],
      taxRates: [
        {
          id: 1,
          taxName: 'VAT',
          taxRate: 12,
          taxType: 'percentage',
          applicableTo: 'all',
          effectiveDate: '2024-01-01'
        },
        {
          id: 2,
          taxName: 'Special Tax',
          taxRate: 5,
          taxType: 'percentage',
          applicableTo: 'non_food',
          effectiveDate: '2024-01-01'
        }
      ]
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    createShippingRate() {
      const rate = {
        id: Date.now(),
        ...this.newShipping
      }
      this.shippingRates.unshift(rate)
      this.resetShippingForm()
      this.showCreateShipping = false
    },
    deleteShippingRate(id) {
      this.shippingRates = this.shippingRates.filter(rate => rate.id !== id)
    },
    createTaxRate() {
      const tax = {
        id: Date.now(),
        ...this.newTax
      }
      this.taxRates.unshift(tax)
      this.resetTaxForm()
      this.showCreateTax = false
    },
    deleteTaxRate(id) {
      this.taxRates = this.taxRates.filter(tax => tax.id !== id)
    },
    resetShippingForm() {
      this.newShipping = {
        serviceName: '',
        deliveryTime: '',
        basePrice: 0,
        perKgPrice: 0,
        minimumOrder: 0,
        status: 'active'
      }
    },
    resetTaxForm() {
      this.newTax = {
        taxName: '',
        taxRate: 0,
        taxType: 'percentage',
        applicableTo: 'all',
        effectiveDate: new Date().toISOString().split('T')[0]
      }
    }
  }
}
</script>

<style scoped>
.shipping-tax-page {
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
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
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

.section-card {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-card h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.create-form {
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.create-form h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.rate-form {
  display: grid;
  gap: 1rem;
}

.form-row {
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

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-submit {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
}

.btn-cancel {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.rates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.rate-card {
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.rate-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.rate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e8f1e1;
  padding-bottom: 1rem;
}

.rate-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
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

.tax-rate {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
}

.rate-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 8px;
}

.label {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 600;
}

.value {
  font-weight: 700;
  color: #2c3e50;
}

.rate-actions {
  display: flex;
  gap: 1rem;
}

.btn-edit, .btn-delete {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #eafaf1;
  color: #27ae60;
}

.btn-edit:hover {
  background: #d4edda;
}

.btn-delete {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.btn-delete:hover {
  background: #ffeaa7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .shipping-tax-page {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .rates-grid {
    grid-template-columns: 1fr;
  }
  
  .rate-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>