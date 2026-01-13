<template>
    <div class="add-product">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Add New Product</h1>
        <div class="header-actions">
          <button class="btn-secondary" @click="cancel">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button class="btn-primary" @click="saveDraft" :disabled="isSaving">
            <i class="fas fa-save"></i> Save Draft
          </button>
          <button class="btn-primary" @click="publish" :disabled="isSaving || !isValid">
            <i class="fas fa-upload"></i> Publish
          </button>
        </div>
      </div>

      <!-- Progress Indicator -->
      <div class="progress-container">
        <div class="progress-steps">
          <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
            <div class="step-number">1</div>
            <div class="step-label">Basic Info</div>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
            <div class="step-number">2</div>
            <div class="step-label">Pricing</div>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
            <div class="step-number">3</div>
            <div class="step-label">Media</div>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep === 4, completed: currentStep > 4 }">
            <div class="step-number">4</div>
            <div class="step-label">Inventory</div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="form-container">
        <!-- Step 1: Basic Information -->
        <div v-show="currentStep === 1" class="form-step">
          <div class="form-section">
            <h3>Basic Information</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="product-name">Product Name *</label>
                <input
                  id="product-name"
                  v-model="product.name"
                  type="text"
                  class="form-input"
                  placeholder="Enter product name"
                  @input="generateSlug"
                >
                <div class="form-hint">This will be displayed to customers</div>
              </div>

              <div class="form-group">
                <label for="product-slug">Product Slug</label>
                <input
                  id="product-slug"
                  v-model="product.slug"
                  type="text"
                  class="form-input"
                  placeholder="auto-generated-slug"
                >
                <div class="form-hint">URL-friendly version of the product name</div>
              </div>

              <div class="form-group full-width">
                <label for="product-description">Description *</label>
                <textarea
                  id="product-description"
                  v-model="product.description"
                  class="form-textarea"
                  rows="6"
                  placeholder="Describe your product in detail..."
                ></textarea>
                <div class="form-hint">Include key features, materials, and benefits</div>
              </div>

              <div class="form-group">
                <label for="product-category">Category *</label>
                <select
                  id="product-category"
                  v-model="product.category"
                  class="form-select"
                >
                  <option value="">Select a category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="product-subcategory">Subcategory</label>
                <select
                  id="product-subcategory"
                  v-model="product.subcategory"
                  class="form-select"
                >
                  <option value="">Select subcategory</option>
                  <option v-for="subcat in subcategories" :key="subcat.id" :value="subcat.id">
                    {{ subcat.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="product-brand">Brand</label>
                <input
                  id="product-brand"
                  v-model="product.brand"
                  type="text"
                  class="form-input"
                  placeholder="Enter brand name"
                >
              </div>

              <div class="form-group">
                <label for="product-condition">Condition</label>
                <select
                  id="product-condition"
                  v-model="product.condition"
                  class="form-select"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>

              <div class="form-group">
                <label for="product-weight">Weight (kg)</label>
                <input
                  id="product-weight"
                  v-model.number="product.weight"
                  type="number"
                  step="0.01"
                  class="form-input"
                  placeholder="0.00"
                >
              </div>

              <div class="form-group">
                <label for="product-dimensions">Dimensions (L x W x H in cm)</label>
                <div class="dimensions-input">
                  <input
                    v-model.number="product.dimensions.length"
                    type="number"
                    step="0.1"
                    placeholder="Length"
                    class="form-input"
                  >
                  <span class="dimension-separator">x</span>
                  <input
                    v-model.number="product.dimensions.width"
                    type="number"
                    step="0.1"
                    placeholder="Width"
                    class="form-input"
                  >
                  <span class="dimension-separator">x</span>
                  <input
                    v-model.number="product.dimensions.height"
                    type="number"
                    step="0.1"
                    placeholder="Height"
                    class="form-input"
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" @click="cancel">Cancel</button>
            <button class="btn-primary" @click="nextStep">Next: Pricing</button>
          </div>
        </div>

        <!-- Step 2: Pricing -->
        <div v-show="currentStep === 2" class="form-step">
          <div class="form-section">
            <h3>Pricing Information</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="product-price">Regular Price (PHP) *</label>
                <div class="price-input">
                  <span class="currency-symbol">₱</span>
                  <input
                    id="product-price"
                    v-model.number="product.price"
                    type="number"
                    step="0.01"
                    class="form-input price-field"
                    placeholder="0.00"
                    @input="calculateSavings"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="product-sale-price">Sale Price (PHP)</label>
                <div class="price-input">
                  <span class="currency-symbol">₱</span>
                  <input
                    id="product-sale-price"
                    v-model.number="product.salePrice"
                    type="number"
                    step="0.01"
                    class="form-input price-field"
                    placeholder="0.00"
                    @input="calculateSavings"
                  >
                </div>
                <div class="form-hint">Leave empty if not on sale</div>
              </div>

              <div class="form-group">
                <label>Savings</label>
                <div class="savings-display">
                  <div class="savings-amount">₱{{ formatCurrency(savingsAmount) }}</div>
                  <div class="savings-percent">{{ savingsPercent }}% off</div>
                </div>
              </div>

              <div class="form-group">
                <label for="product-cost">Cost Price (PHP)</label>
                <div class="price-input">
                  <span class="currency-symbol">₱</span>
                  <input
                    id="product-cost"
                    v-model.number="product.cost"
                    type="number"
                    step="0.01"
                    class="form-input price-field"
                    placeholder="0.00"
                  >
                </div>
                <div class="form-hint">Your cost to produce or acquire this product</div>
              </div>

              <div class="form-group">
                <label for="product-min-order">Minimum Order Quantity</label>
                <input
                  id="product-min-order"
                  v-model.number="product.minOrder"
                  type="number"
                  min="1"
                  class="form-input"
                  placeholder="1"
                >
              </div>

              <div class="form-group">
                <label for="product-max-order">Maximum Order Quantity</label>
                <input
                  id="product-max-order"
                  v-model.number="product.maxOrder"
                  type="number"
                  min="1"
                  class="form-input"
                  placeholder="999"
                >
              </div>

              <div class="form-group full-width">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    v-model="product.allowCustomization"
                  >
                  <span class="checkbox-text">Allow product customization</span>
                </label>
                <div class="form-hint">Customers can request customizations for this product</div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" @click="prevStep">Back</button>
            <button class="btn-primary" @click="nextStep">Next: Media</button>
          </div>
        </div>

        <!-- Step 3: Media -->
        <div v-show="currentStep === 3" class="form-step">
          <div class="form-section">
            <h3>Product Images</h3>
            <div class="image-upload-grid">
              <div class="image-upload-container">
                <div class="upload-area" @drop="handleDrop" @dragover.prevent>
                  <div class="upload-content">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drag and drop images here</p>
                    <p class="upload-hint">or click to browse</p>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    @change="handleFileSelect"
                    class="file-input"
                  >
                </div>
                <div class="upload-actions">
                  <button class="btn-secondary" @click="$refs.fileInput.click()">
                    <i class="fas fa-plus"></i> Add Images
                  </button>
                  <button class="btn-secondary" @click="clearImages">
                    <i class="fas fa-trash"></i> Clear All
                  </button>
                </div>
              </div>

              <div class="image-preview-grid">
                <div
                  v-for="(image, index) in product.images"
                  :key="index"
                  class="image-preview"
                >
                  <img :src="image.url" :alt="`Product image ${index + 1}`">
                  <div class="image-actions">
                    <button @click="setFeaturedImage(index)" class="btn-icon" title="Set as featured">
                      <i class="fas fa-star" :class="{ active: image.isFeatured }"></i>
                    </button>
                    <button @click="removeImage(index)" class="btn-icon" title="Remove">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Product Videos</h3>
            <div class="form-group full-width">
              <label for="product-video">Video URL</label>
              <input
                id="product-video"
                v-model="product.videoUrl"
                type="url"
                class="form-input"
                placeholder="https://youtube.com/watch?v=..."
              >
              <div class="form-hint">YouTube or Vimeo video URL to showcase your product</div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" @click="prevStep">Back</button>
            <button class="btn-primary" @click="nextStep">Next: Inventory</button>
          </div>
        </div>

        <!-- Step 4: Inventory -->
        <div v-show="currentStep === 4" class="form-step">
          <div class="form-section">
            <h3>Inventory Management</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="product-sku">SKU *</label>
                <input
                  id="product-sku"
                  v-model="product.sku"
                  type="text"
                  class="form-input"
                  placeholder="Enter unique SKU"
                >
                <div class="form-hint">Stock Keeping Unit - unique identifier for this product</div>
              </div>

              <div class="form-group">
                <label for="product-quantity">Stock Quantity *</label>
                <input
                  id="product-quantity"
                  v-model.number="product.quantity"
                  type="number"
                  min="0"
                  class="form-input"
                  placeholder="0"
                >
              </div>

              <div class="form-group">
                <label for="product-low-stock">Low Stock Threshold</label>
                <input
                  id="product-low-stock"
                  v-model.number="product.lowStockThreshold"
                  type="number"
                  min="0"
                  class="form-input"
                  placeholder="5"
                >
                <div class="form-hint">Get notified when stock reaches this level</div>
              </div>

              <div class="form-group">
                <label for="product-allow-backorder">Allow Backorders</label>
                <select
                  id="product-allow-backorder"
                  v-model="product.allowBackorder"
                  class="form-select"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="notify">Notify customer</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    v-model="product.trackInventory"
                  >
                  <span class="checkbox-text">Track inventory for this product</span>
                </label>
                <div class="form-hint">Enable inventory tracking and stock management</div>
              </div>

              <div class="form-group full-width">
                <label for="product-tags">Tags</label>
                <input
                  id="product-tags"
                  v-model="product.tags"
                  type="text"
                  class="form-input"
                  placeholder="handmade, traditional, eco-friendly"
                >
                <div class="form-hint">Comma-separated tags to help with discoverability</div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Product Status</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="product-status">Status</label>
                <select
                  id="product-status"
                  v-model="product.status"
                  class="form-select"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Approval</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div class="form-group">
                <label for="product-visibility">Visibility</label>
                <select
                  id="product-visibility"
                  v-model="product.visibility"
                  class="form-select"
                >
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                  <option value="search">Search Results Only</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" @click="prevStep">Back</button>
            <button class="btn-primary" @click="publish" :disabled="isSaving || !isValid">
              <i class="fas fa-upload"></i> Publish Product
            </button>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-content">
            <i class="fas fa-check-circle modal-icon"></i>
            <h3>Product Created Successfully!</h3>
            <p>Your product has been added to your store.</p>
            <div class="modal-actions">
              <button class="btn-secondary" @click="closeSuccessModal">Close</button>
              <button class="btn-primary" @click="viewProduct">View Product</button>
              <button class="btn-primary" @click="addAnotherProduct">Add Another</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'AddProduct',
  components: {
    SellerLayout
  },
  setup() {
    const currentStep = ref(1)
    const isSaving = ref(false)
    const showSuccessModal = ref(false)

    const categories = [
      { id: 'bags', name: 'Bags & Accessories' },
      { id: 'crafts', name: 'Handicrafts' },
      { id: 'home', name: 'Home & Living' },
      { id: 'fashion', name: 'Fashion' },
      { id: 'food', name: 'Food & Beverages' }
    ]

    const subcategories = [
      { id: 'handbags', name: 'Handbags', parent: 'bags' },
      { id: 'wallets', name: 'Wallets', parent: 'bags' },
      { id: 'baskets', name: 'Baskets', parent: 'crafts' },
      { id: 'weaving', name: 'Weaving', parent: 'crafts' },
      { id: 'decor', name: 'Decor', parent: 'home' },
      { id: 'kitchen', name: 'Kitchen', parent: 'home' }
    ]

    const product = reactive({
      name: '',
      slug: '',
      description: '',
      category: '',
      subcategory: '',
      brand: '',
      condition: 'new',
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      },
      price: 0,
      salePrice: 0,
      cost: 0,
      minOrder: 1,
      maxOrder: 999,
      allowCustomization: false,
      images: [],
      videoUrl: '',
      sku: '',
      quantity: 0,
      lowStockThreshold: 5,
      allowBackorder: 'no',
      trackInventory: true,
      tags: '',
      status: 'draft',
      visibility: 'visible'
    })

    const generateSlug = () => {
      const slug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      product.slug = slug
    }

    const calculateSavings = () => {
      if (product.salePrice && product.price > product.salePrice) {
        return product.price - product.salePrice
      }
      return 0
    }

    const savingsAmount = computed(() => {
      if (product.salePrice && product.price > product.salePrice) {
        return product.price - product.salePrice
      }
      return 0
    })

    const savingsPercent = computed(() => {
      if (product.salePrice && product.price > product.salePrice) {
        return Math.round((savingsAmount.value / product.price) * 100)
      }
      return 0
    })

    const isValid = computed(() => {
      return product.name && 
             product.description && 
             product.category && 
             product.price > 0 && 
             product.sku && 
             product.quantity >= 0
    })

    const nextStep = () => {
      if (currentStep.value < 4) {
        currentStep.value++
      }
    }

    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
      }
    }

    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          product.images.push({
            url: e.target.result,
            file: file,
            isFeatured: product.images.length === 0
          })
        }
        reader.readAsDataURL(file)
      })
    }

    const handleDrop = (event) => {
      event.preventDefault()
      const files = Array.from(event.dataTransfer.files)
      handleFileSelect({ target: { files } })
    }

    const setFeaturedImage = (index) => {
      product.images.forEach((img, i) => {
        img.isFeatured = i === index
      })
    }

    const removeImage = (index) => {
      product.images.splice(index, 1)
      // Set first image as featured if none is featured
      if (!product.images.some(img => img.isFeatured) && product.images.length > 0) {
        product.images[0].isFeatured = true
      }
    }

    const clearImages = () => {
      product.images = []
    }

    const saveDraft = async () => {
      isSaving.value = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        product.status = 'draft'
        alert('Product saved as draft!')
      } catch (error) {
        alert('Error saving draft: ' + error.message)
      } finally {
        isSaving.value = false
      }
    }

    const publish = async () => {
      if (!isValid.value) {
        alert('Please fill in all required fields')
        return
      }

      isSaving.value = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        product.status = 'pending'
        showSuccessModal.value = true
      } catch (error) {
        alert('Error publishing product: ' + error.message)
      } finally {
        isSaving.value = false
      }
    }

    const cancel = () => {
      if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        // Reset form
        Object.assign(product, {
          name: '',
          slug: '',
          description: '',
          category: '',
          subcategory: '',
          brand: '',
          condition: 'new',
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          price: 0,
          salePrice: 0,
          cost: 0,
          minOrder: 1,
          maxOrder: 999,
          allowCustomization: false,
          images: [],
          videoUrl: '',
          sku: '',
          quantity: 0,
          lowStockThreshold: 5,
          allowBackorder: 'no',
          trackInventory: true,
          tags: '',
          status: 'draft',
          visibility: 'visible'
        })
        currentStep.value = 1
      }
    }

    const closeSuccessModal = () => {
      showSuccessModal.value = false
    }

    const viewProduct = () => {
      alert('Viewing product...')
      showSuccessModal.value = false
    }

    const addAnotherProduct = () => {
      // Reset form but keep some settings
      Object.assign(product, {
        name: '',
        slug: '',
        description: '',
        category: '',
        subcategory: '',
        brand: '',
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        price: 0,
        salePrice: 0,
        cost: 0,
        minOrder: 1,
        maxOrder: 999,
        allowCustomization: false,
        images: [],
        videoUrl: '',
        sku: '',
        quantity: 0,
        lowStockThreshold: 5,
        allowBackorder: 'no',
        tags: ''
      })
      currentStep.value = 1
      showSuccessModal.value = false
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    return {
      currentStep,
      isSaving,
      showSuccessModal,
      categories,
      subcategories,
      product,
      savingsAmount,
      savingsPercent,
      isValid,
      nextStep,
      prevStep,
      handleFileSelect,
      handleDrop,
      setFeaturedImage,
      removeImage,
      clearImages,
      saveDraft,
      publish,
      cancel,
      closeSuccessModal,
      viewProduct,
      addAnotherProduct,
      generateSlug,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.add-product {
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

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
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

.progress-container {
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  margin: 0 auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.step-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  max-width: 80px;
}

.step.active .step-number {
  background-color: #3b82f6;
  color: white;
}

.step.active .step-label {
  color: #3b82f6;
  font-weight: 600;
}

.step.completed .step-number {
  background-color: #10b981;
  color: white;
}

.step.completed .step-label {
  color: #10b981;
  font-weight: 600;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #e5e7eb;
  margin: 0 1rem;
}

.step.completed ~ .step-line {
  background-color: #10b981;
}

.form-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 2rem;
}

.form-step {
  display: block;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  background-color: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
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

.price-field {
  padding-left: 2.5rem;
}

.dimensions-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.dimension-separator {
  font-weight: bold;
  color: #6b7280;
}

.savings-display {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.savings-amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: #10b981;
}

.savings-percent {
  font-size: 1rem;
  font-weight: 600;
  color: #10b981;
  background-color: #ecfdf5;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid #d1fae5;
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

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.image-upload-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
  background-color: #fafafa;
}

.upload-area:hover {
  border-color: #3b82f6;
  background-color: #f0f9ff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-content i {
  font-size: 3rem;
  color: #9ca3af;
}

.upload-content p {
  margin: 0;
  color: #6b7280;
}

.upload-hint {
  font-style: italic;
}

.file-input {
  display: none;
}

.upload-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.image-preview {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.image-preview img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

.btn-icon:hover {
  color: #3b82f6;
}

.btn-icon .active {
  color: #f59e0b;
}

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
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-icon {
  font-size: 3rem;
  color: #10b981;
  margin-bottom: 1rem;
}

.modal h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.modal p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Responsive styles */
@media (max-width: 768px) {
  .image-upload-grid {
    grid-template-columns: 1fr;
  }
  
  .dimensions-input {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .dimension-separator {
    align-self: center;
  }
  
  .savings-display {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>