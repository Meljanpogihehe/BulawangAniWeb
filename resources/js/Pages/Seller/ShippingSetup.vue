<template>
  <SellerLayout>
    <div class="shipping-setup">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Shipping Setup</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="saveDraft">
          <i class="fas fa-save"></i> Save Draft
        </button>
        <button class="btn-primary" @click="saveSettings">
          <i class="fas fa-check"></i> Save Settings
        </button>
      </div>
    </div>

    <!-- Shipping Zones -->
    <div class="section">
      <h2>Shipping Zones</h2>
      <div class="zone-list">
        <div 
          v-for="zone in shippingZones" 
          :key="zone.id" 
          class="zone-card"
        >
          <div class="zone-header">
            <div class="zone-info">
              <h3>{{ zone.name }}</h3>
              <p>{{ zone.countries.join(', ') }}</p>
            </div>
            <div class="zone-actions">
              <button class="btn-edit" @click="editZone(zone)">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn-delete" @click="deleteZone(zone.id)">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
          
          <div class="zone-rates">
            <div v-for="rate in zone.rates" :key="rate.id" class="rate-item">
              <div class="rate-info">
                <span class="rate-name">{{ rate.name }}</span>
                <span class="rate-price">{{ formatCurrency(rate.price) }}</span>
              </div>
              <div class="rate-details">
                <span class="rate-time">{{ rate.deliveryTime }}</span>
                <span class="rate-type">{{ rate.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button class="btn-add-zone" @click="addNewZone">
        <i class="fas fa-plus"></i> Add New Zone
      </button>
    </div>

    <!-- Shipping Methods -->
    <div class="section">
      <h2>Shipping Methods</h2>
      <div class="methods-list">
        <div 
          v-for="method in shippingMethods" 
          :key="method.id" 
          class="method-card"
          :class="{ active: method.enabled }"
        >
          <div class="method-header">
            <div class="method-info">
              <h3>{{ method.name }}</h3>
              <p>{{ method.description }}</p>
            </div>
            <div class="method-toggle">
              <label class="switch">
                <input 
                  type="checkbox" 
                  v-model="method.enabled"
                  @change="updateMethod(method)"
                >
                <span class="slider"></span>
              </label>
            </div>
          </div>
          
          <div class="method-details">
            <div class="detail-item">
              <span class="detail-label">Base Price:</span>
              <span class="detail-value">{{ formatCurrency(method.basePrice) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Per kg:</span>
              <span class="detail-value">{{ formatCurrency(method.perKg) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estimated Time:</span>
              <span class="detail-value">{{ method.estimatedTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Packaging Options -->
    <div class="section">
      <h2>Packaging Options</h2>
      <div class="packaging-list">
        <div 
          v-for="pkg in packagingOptions"
          :key="pkg.id"
          class="package-card"
        >
          <div class="package-header">
            <div class="package-info">
              <h3>{{ pkg.name }}</h3>
              <p>{{ pkg.description }}</p>
            </div>
            <div class="package-actions">
              <button class="btn-edit" @click="editPackage(pkg)">
                <i class="fas fa-edit"></i> Edit
              </button>
            </div>
          </div>
          
          <div class="package-details">
            <div class="detail-item">
              <span class="detail-label">Dimensions:</span>
              <span class="detail-value">{{ pkg.dimensions }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Max Weight:</span>
              <span class="detail-value">{{ pkg.maxWeight }} kg</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Cost:</span>
              <span class="detail-value">{{ formatCurrency(pkg.cost) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button class="btn-add-package" @click="addNewPackage">
        <i class="fas fa-plus"></i> Add New Package
      </button>
    </div>

    <!-- Shipping Rules -->
    <div class="section">
      <h2>Shipping Rules</h2>
      <div class="rules-list">
        <div 
          v-for="rule in shippingRules" 
          :key="rule.id" 
          class="rule-card"
        >
          <div class="rule-header">
            <div class="rule-info">
              <h3>{{ rule.name }}</h3>
              <p>{{ rule.description }}</p>
            </div>
            <div class="rule-actions">
              <button class="btn-edit" @click="editRule(rule)">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn-delete" @click="deleteRule(rule.id)">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
          
          <div class="rule-details">
            <div class="detail-item">
              <span class="detail-label">Condition:</span>
              <span class="detail-value">{{ rule.condition }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Action:</span>
              <span class="detail-value">{{ rule.action }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Value:</span>
              <span class="detail-value">{{ rule.value }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button class="btn-add-rule" @click="addNewRule">
        <i class="fas fa-plus"></i> Add New Rule
      </button>
    </div>

    <!-- Free Shipping Threshold -->
    <div class="section">
      <h2>Free Shipping</h2>
      <div class="free-shipping-card">
        <div class="free-shipping-header">
          <h3>Free Shipping Threshold</h3>
          <label class="switch">
            <input type="checkbox" v-model="freeShipping.enabled">
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="free-shipping-content">
          <div class="form-group">
            <label>Minimum Order Amount</label>
            <div class="price-input">
              <span class="currency-symbol"></span>
              <input 
                v-model.number="freeShipping.threshold"
                type="number"
                step="0.01"
                class="form-input"
                placeholder="0.00"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>Applicable Zones</label>
            <select v-model="freeShipping.zones" multiple class="form-select">
              <option v-for="zone in shippingZones" :key="zone.id" :value="zone.id">
                {{ zone.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="freeShipping.excludeHeavyItems">
              <span class="checkbox-text">Exclude heavy items (over 10kg)</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Carrier Integration -->
    <div class="section">
      <h2>Carrier Integration</h2>
      <div class="carriers-list">
        <div 
          v-for="carrier in carriers" 
          :key="carrier.id" 
          class="carrier-card"
          :class="{ connected: carrier.connected }"
        >
          <div class="carrier-header">
            <div class="carrier-info">
              <h3>{{ carrier.name }}</h3>
              <p>{{ carrier.description }}</p>
            </div>
            <div class="carrier-status">
              <span :class="['status-badge', carrier.connected ? 'connected' : 'disconnected']">
                {{ carrier.connected ? 'Connected' : 'Disconnected' }}
              </span>
            </div>
          </div>
          
          <div class="carrier-actions">
            <button 
              v-if="!carrier.connected" 
              class="btn-connect" 
              @click="connectCarrier(carrier.id)"
            >
              <i class="fas fa-plug"></i> Connect
            </button>
            <button 
              v-else 
              class="btn-disconnect" 
              @click="disconnectCarrier(carrier.id)"
            >
              <i class="fas fa-unlink"></i> Disconnect
            </button>
            <button class="btn-settings" @click="openCarrierSettings(carrier.id)">
              <i class="fas fa-cog"></i> Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Zone Editing -->
    <div v-if="showZoneModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingZone ? 'Edit Zone' : 'Add New Zone' }}</h3>
          <button class="btn-close" @click="closeZoneModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="form-group">
            <label>Zone Name</label>
            <input v-model="zoneForm.name" type="text" class="form-input" placeholder="Enter zone name">
          </div>
          
          <div class="form-group">
            <label>Countries</label>
            <select v-model="zoneForm.countries" multiple class="form-select">
              <option v-for="country in countries" :key="country.code" :value="country.code">
                {{ country.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Shipping Rates</label>
            <div v-for="(rate, index) in zoneForm.rates" :key="index" class="rate-form">
              <input v-model="rate.name" type="text" placeholder="Rate name" class="form-input">
              <input v-model.number="rate.price" type="number" placeholder="Price" class="form-input">
              <input v-model="rate.deliveryTime" type="text" placeholder="Delivery time" class="form-input">
              <button @click="removeRate(index)" class="btn-delete">Remove</button>
            </div>
            <button @click="addRate" class="btn-add">Add Rate</button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeZoneModal">Cancel</button>
          <button class="btn-primary" @click="saveZone">Save Zone</button>
        </div>
      </div>
    </div>
  </div>
  </SellerLayout>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'ShippingSetup',
  setup() {
    const freeShipping = reactive({
      enabled: true,
      threshold: 2000,
      zones: [],
      excludeHeavyItems: false
    })

    const shippingZones = ref([
      {
        id: 1,
        name: 'Local (Luzon)',
        countries: ['Philippines'],
        rates: [
          { id: 1, name: 'Standard', price: 150, deliveryTime: '3-5 business days', type: 'Flat Rate' },
          { id: 2, name: 'Express', price: 250, deliveryTime: '1-2 business days', type: 'Flat Rate' }
        ]
      },
      {
        id: 2,
        name: 'International',
        countries: ['USA', 'Canada', 'Australia'],
        rates: [
          { id: 3, name: 'Standard', price: 1500, deliveryTime: '7-14 business days', type: 'Weight-based' },
          { id: 4, name: 'Express', price: 2500, deliveryTime: '3-5 business days', type: 'Weight-based' }
        ]
      }
    ])

    const shippingMethods = ref([
      {
        id: 1,
        name: 'LBC',
        description: 'Local and international shipping',
        enabled: true,
        basePrice: 150,
        perKg: 50,
        estimatedTime: '3-7 days'
      },
      {
        id: 2,
        name: 'J&T Express',
        description: 'Fast and affordable shipping',
        enabled: true,
        basePrice: 120,
        perKg: 40,
        estimatedTime: '2-5 days'
      },
      {
        id: 3,
        name: 'GrabExpress',
        description: 'Same day delivery for Metro Manila',
        enabled: false,
        basePrice: 80,
        perKg: 0,
        estimatedTime: 'Same day'
      }
    ])

    const packagingOptions = ref([
      {
        id: 1,
        name: 'Small Box',
        description: 'For small items up to 2kg',
        dimensions: '20 x 15 x 10 cm',
        maxWeight: 2,
        cost: 25
      },
      {
        id: 2,
        name: 'Medium Box',
        description: 'For medium items up to 5kg',
        dimensions: '30 x 20 x 15 cm',
        maxWeight: 5,
        cost: 45
      },
      {
        id: 3,
        name: 'Large Box',
        description: 'For large items up to 10kg',
        dimensions: '40 x 30 x 20 cm',
        maxWeight: 10,
        cost: 75
      }
    ])

    const shippingRules = ref([
      {
        id: 1,
        name: 'Free Shipping Over 2000',
        description: 'Free standard shipping for orders over 2000',
        condition: 'Order total > 2000',
        action: 'Free shipping',
        value: 'Standard rate waived'
      },
      {
        id: 2,
        name: 'Heavy Item Surcharge',
        description: 'Additional charge for items over 5kg',
        condition: 'Item weight > 5kg',
        action: 'Add surcharge',
        value: '100 per item'
      }
    ])

    const carriers = ref([
      {
        id: 1,
        name: 'LBC API',
        description: 'Integrate with LBC for tracking and shipping',
        connected: true
      },
      {
        id: 2,
        name: 'J&T Express API',
        description: 'Integrate with J&T Express for tracking',
        connected: false
      },
      {
        id: 3,
        name: 'GrabExpress API',
        description: 'Integrate with GrabExpress for same-day delivery',
        connected: false
      }
    ])

    const countries = [
      { code: 'PH', name: 'Philippines' },
      { code: 'US', name: 'United States' },
      { code: 'CA', name: 'Canada' },
      { code: 'AU', name: 'Australia' },
      { code: 'JP', name: 'Japan' },
      { code: 'SG', name: 'Singapore' }
    ]

    const showZoneModal = ref(false)
    const editingZone = ref(null)
    const zoneForm = reactive({
      name: '',
      countries: [],
      rates: [{ name: '', price: 0, deliveryTime: '' }]
    })

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    const saveSettings = () => {
      alert('Shipping settings saved successfully!')
    }

    const saveDraft = () => {
      alert('Shipping settings saved as draft!')
    }

    const editZone = (zone) => {
      editingZone.value = zone
      zoneForm.name = zone.name
      zoneForm.countries = [...zone.countries]
      zoneForm.rates = zone.rates.map(r => ({ ...r }))
      showZoneModal.value = true
    }

    const addNewZone = () => {
      editingZone.value = null
      zoneForm.name = ''
      zoneForm.countries = []
      zoneForm.rates = [{ name: '', price: 0, deliveryTime: '' }]
      showZoneModal.value = true
    }

    const closeZoneModal = () => {
      showZoneModal.value = false
      editingZone.value = null
    }

    const saveZone = () => {
      if (editingZone.value) {
        // Update existing zone
        const index = shippingZones.value.findIndex(z => z.id === editingZone.value.id)
        if (index !== -1) {
          shippingZones.value[index] = {
            ...shippingZones.value[index],
            name: zoneForm.name,
            countries: zoneForm.countries,
            rates: zoneForm.rates
          }
        }
      } else {
        // Add new zone
        const newZone = {
          id: Date.now(),
          name: zoneForm.name,
          countries: zoneForm.countries,
          rates: zoneForm.rates
        }
        shippingZones.value.push(newZone)
      }
      closeZoneModal()
      alert('Zone saved successfully!')
    }

    const deleteZone = (zoneId) => {
      if (confirm('Are you sure you want to delete this zone?')) {
        const index = shippingZones.value.findIndex(z => z.id === zoneId)
        if (index !== -1) {
          shippingZones.value.splice(index, 1)
        }
      }
    }

    const addRate = () => {
      zoneForm.rates.push({ name: '', price: 0, deliveryTime: '' })
    }

    const removeRate = (index) => {
      if (zoneForm.rates.length > 1) {
        zoneForm.rates.splice(index, 1)
      }
    }

    const updateMethod = (method) => {
      alert(`Shipping method ${method.name} ${method.enabled ? 'enabled' : 'disabled'}!`)
    }

    const editPackage = (packageItem) => {
      alert(`Editing package: ${packageItem.name}`)
    }

    const addNewPackage = () => {
      alert('Adding new package...')
    }

    const editRule = (rule) => {
      alert(`Editing rule: ${rule.name}`)
    }

    const addNewRule = () => {
      alert('Adding new shipping rule...')
    }

    const deleteRule = (ruleId) => {
      if (confirm('Are you sure you want to delete this rule?')) {
        const index = shippingRules.value.findIndex(r => r.id === ruleId)
        if (index !== -1) {
          shippingRules.value.splice(index, 1)
        }
      }
    }

    const connectCarrier = (carrierId) => {
      const carrier = carriers.value.find(c => c.id === carrierId)
      if (carrier) {
        carrier.connected = true
        alert(`Connected to ${carrier.name}!`)
      }
    }

    const disconnectCarrier = (carrierId) => {
      const carrier = carriers.value.find(c => c.id === carrierId)
      if (carrier) {
        carrier.connected = false
        alert(`Disconnected from ${carrier.name}.`)
      }
    }

    const openCarrierSettings = (carrierId) => {
      alert(`Opening settings for carrier ${carrierId}...`)
    }

    return {
      freeShipping,
      shippingZones,
      shippingMethods,
      packagingOptions,
      shippingRules,
      carriers,
      countries,
      showZoneModal,
      editingZone,
      zoneForm,
      formatCurrency,
      saveSettings,
      saveDraft,
      editZone,
      addNewZone,
      closeZoneModal,
      saveZone,
      deleteZone,
      addRate,
      removeRate,
      updateMethod,
      editPackage,
      addNewPackage,
      editRule,
      addNewRule,
      deleteRule,
      connectCarrier,
      disconnectCarrier,
      openCarrierSettings
    }
  }
}
</script>

<style scoped>
.shipping-setup {
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
  padding: 0.75rem 1.5rem;
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

.section {
  margin-bottom: 3rem;
}

.section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

/* Zone Cards */
.zone-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.zone-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s;
}

.zone-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.zone-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.zone-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.zone-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  background: none;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn-delete:hover {
  background-color: #fee2e2;
  border-color: #fecaca;
  color: #991b1b;
}

.zone-rates {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.rate-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.rate-name {
  font-weight: 600;
  color: #1f2937;
}

.rate-price {
  font-size: 0.875rem;
  color: #6b7280;
}

.rate-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: right;
}

.rate-time,
.rate-type {
  font-size: 0.75rem;
  color: #6b7280;
}

.btn-add-zone {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-add-zone:hover {
  background-color: #059669;
}

/* Methods List */
.methods-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.method-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s;
}

.method-card.active {
  border-left: 4px solid #10b981;
}

.method-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.method-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.method-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.method-toggle {
  display: flex;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #10b981;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.method-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Packaging List */
.packaging-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.package-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s;
}

.package-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.package-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.package-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.package-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-add-package {
  background-color: #8b5cf6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-add-package:hover {
  background-color: #7c3aed;
}

/* Rules List */
.rules-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.rule-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s;
}

.rule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.rule-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.rule-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.rule-actions {
  display: flex;
  gap: 0.5rem;
}

.rule-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Free Shipping */
.free-shipping-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.free-shipping-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.free-shipping-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.free-shipping-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.price-input {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 0.75rem;
  color: #6b7280;
  font-size: 1rem;
  z-index: 1;
}

.form-input.price-field {
  padding-left: 2.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-text {
  font-size: 1rem;
  color: #374151;
}

/* Carriers List */
.carriers-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.carrier-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s;
}

.carrier-card.connected {
  border-left: 4px solid #10b981;
}

.carrier-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.carrier-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.carrier-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.connected {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.disconnected {
  background-color: #fee2e2;
  color: #991b1b;
}

.carrier-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-connect {
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
  transition: background-color 0.2s;
}

.btn-connect:hover {
  background-color: #059669;
}

.btn-disconnect {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-disconnect:hover {
  background-color: #dc2626;
}

.btn-settings {
  background-color: #6b7280;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-settings:hover {
  background-color: #4b5563;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  padding: 0;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.btn-close:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 1.5rem;
}

.rate-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Responsive styles */
@media (max-width: 768px) {
  .zone-list,
  .methods-list,
  .packaging-list,
  .rules-list,
  .carriers-list {
    grid-template-columns: 1fr;
  }
  
  .rate-form {
    grid-template-columns: 1fr;
  }
  
  .free-shipping-content {
    grid-template-columns: 1fr;
  }
}
</style>