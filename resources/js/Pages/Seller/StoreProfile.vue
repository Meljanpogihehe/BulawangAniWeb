<template>
    <div class="store-profile">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Store Profile</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="previewStore">
          <i class="fas fa-eye"></i> Preview Store
        </button>
        <button class="btn-primary" @click="saveProfile">
          <i class="fas fa-save"></i> Save Changes
        </button>
      </div>
    </div>

    <!-- Store Overview -->
    <div class="store-overview">
      <div class="overview-grid">
        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-store"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Store Status</div>
            <div class="card-value">{{ store.status }}</div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Total Products</div>
            <div class="card-value">{{ store.totalProducts }}</div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Average Rating</div>
            <div class="card-value">{{ store.averageRating }} / 5.0</div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Followers</div>
            <div class="card-value">{{ formatNumber(store.followers) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Store Information Form -->
    <div class="form-section">
      <h2>Store Information</h2>
      <div class="form-grid">
        <div class="form-group">
          <label for="store-name">Store Name</label>
          <input 
            id="store-name"
            v-model="store.name"
            type="text"
            class="form-input"
            placeholder="Enter your store name"
          >
        </div>

        <div class="form-group">
          <label for="store-slug">Store URL</label>
          <div class="url-input">
            <span class="url-prefix">bulawanganis.com/store/</span>
            <input 
              id="store-slug"
              v-model="store.slug"
              type="text"
              class="form-input"
              placeholder="your-store-name"
            >
          </div>
        </div>

        <div class="form-group full-width">
          <label for="store-description">Store Description</label>
          <textarea 
            id="store-description"
            v-model="store.description"
            class="form-textarea"
            rows="4"
            placeholder="Tell customers about your store, products, and mission..."
          ></textarea>
        </div>

        <div class="form-group">
          <label for="store-category">Store Category</label>
          <select 
            id="store-category"
            v-model="store.category"
            class="form-select"
          >
            <option value="">Select a category</option>
            <option v-for="category in storeCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="store-founded">Founded Date</label>
          <input 
            id="store-founded"
            v-model="store.foundedDate"
            type="date"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="store-verified">Verification Status</label>
          <div class="verification-badge" :class="{ verified: store.verified }">
            <i class="fas" :class="store.verified ? 'fa-check-circle' : 'fa-exclamation-circle'"></i>
            {{ store.verified ? 'Verified Seller' : 'Not Verified' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Store Images -->
    <div class="form-section">
      <h2>Store Images</h2>
      <div class="image-section">
        <div class="image-upload-group">
          <label class="image-label">Store Logo</label>
          <div class="image-upload-container">
            <div class="current-image">
              <img :src="store.logo" :alt="store.name" v-if="store.logo">
              <div class="placeholder" v-else>
                <i class="fas fa-camera"></i>
                <span>Upload Logo</span>
              </div>
            </div>
            <input 
              ref="logoInput"
              type="file" 
              accept="image/*" 
              @change="handleLogoUpload"
              class="file-input"
            >
            <button class="btn-secondary" @click="$refs.logoInput.click()">
              <i class="fas fa-upload"></i> Change Logo
            </button>
          </div>
        </div>

        <div class="image-upload-group">
          <label class="image-label">Store Banner</label>
          <div class="banner-upload-container">
            <div class="banner-preview">
              <img :src="store.banner" :alt="store.name" v-if="store.banner">
              <div class="banner-placeholder" v-else>
                <i class="fas fa-image"></i>
                <span>Upload Store Banner (1200x400px)</span>
              </div>
            </div>
            <input 
              ref="bannerInput"
              type="file" 
              accept="image/*" 
              @change="handleBannerUpload"
              class="file-input"
            >
            <button class="btn-secondary" @click="$refs.bannerInput.click()">
              <i class="fas fa-upload"></i> Change Banner
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="form-section">
      <h2>Contact Information</h2>
      <div class="form-grid">
        <div class="form-group">
          <label for="contact-email">Business Email</label>
          <input 
            id="contact-email"
            v-model="store.contact.email"
            type="email"
            class="form-input"
            placeholder="contact@yourstore.com"
          >
        </div>

        <div class="form-group">
          <label for="contact-phone">Phone Number</label>
          <input 
            id="contact-phone"
            v-model="store.contact.phone"
            type="tel"
            class="form-input"
            placeholder="+63 912 345 6789"
          >
        </div>

        <div class="form-group">
          <label for="contact-website">Website</label>
          <input 
            id="contact-website"
            v-model="store.contact.website"
            type="url"
            class="form-input"
            placeholder="https://yourstore.com"
          >
        </div>

        <div class="form-group">
          <label for="contact-social">Social Media</label>
          <div class="social-links">
            <div class="social-link">
              <i class="fab fa-facebook"></i>
              <input v-model="store.contact.social.facebook" placeholder="Facebook URL">
            </div>
            <div class="social-link">
              <i class="fab fa-instagram"></i>
              <input v-model="store.contact.social.instagram" placeholder="Instagram URL">
            </div>
            <div class="social-link">
              <i class="fab fa-tiktok"></i>
              <input v-model="store.contact.social.tiktok" placeholder="TikTok URL">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Business Information -->
    <div class="form-section">
      <h2>Business Information</h2>
      <div class="form-grid">
        <div class="form-group full-width">
          <label for="business-address">Business Address</label>
          <textarea 
            id="business-address"
            v-model="store.business.address"
            class="form-textarea"
            rows="3"
            placeholder="Enter your business address"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="business-tin">TIN Number</label>
          <input 
            id="business-tin"
            v-model="store.business.tin"
            type="text"
            class="form-input"
            placeholder="TIN Number"
          >
        </div>

        <div class="form-group">
          <label for="business-registered">Business Registration</label>
          <select 
            id="business-registered"
            v-model="store.business.registrationType"
            class="form-select"
          >
            <option value="">Select registration type</option>
            <option value="sole">Sole Proprietorship</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
            <option value="cooperative">Cooperative</option>
          </select>
        </div>

        <div class="form-group">
          <label for="business-size">Business Size</label>
          <select 
            id="business-size"
            v-model="store.business.size"
            class="form-select"
          >
            <option value="">Select business size</option>
            <option value="micro">Micro (1-9 employees)</option>
            <option value="small">Small (10-99 employees)</option>
            <option value="medium">Medium (100-199 employees)</option>
            <option value="large">Large (200+ employees)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Store Policies -->
    <div class="form-section">
      <h2>Store Policies</h2>
      <div class="form-grid">
        <div class="form-group full-width">
          <label for="policy-return">Return Policy</label>
          <textarea 
            id="policy-return"
            v-model="store.policies.return"
            class="form-textarea"
            rows="4"
            placeholder="Describe your return policy..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label for="policy-shipping">Shipping Policy</label>
          <textarea 
            id="policy-shipping"
            v-model="store.policies.shipping"
            class="form-textarea"
            rows="4"
            placeholder="Describe your shipping policy..."
          ></textarea>
        </div>

        <div class="form-group full-width">
          <label for="policy-privacy">Privacy Policy</label>
          <textarea 
            id="policy-privacy"
            v-model="store.policies.privacy"
            class="form-textarea"
            rows="4"
            placeholder="Describe your privacy policy..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Store Analytics -->
    <div class="analytics-section">
      <h2>Store Analytics</h2>
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="analytics-icon">
            <i class="fas fa-eye"></i>
          </div>
          <div class="analytics-content">
            <div class="analytics-title">Store Views</div>
            <div class="analytics-value">{{ formatNumber(analytics.views) }}</div>
            <div class="analytics-change positive">
              +{{ analytics.viewGrowth }}% this month
            </div>
          </div>
        </div>
        
        <div class="analytics-card">
          <div class="analytics-icon">
            <i class="fas fa-heart"></i>
          </div>
          <div class="analytics-content">
            <div class="analytics-title">Wishlist Adds</div>
            <div class="analytics-value">{{ formatNumber(analytics.wishlistAdds) }}</div>
            <div class="analytics-change positive">
              +{{ analytics.wishlistGrowth }}% this month
            </div>
          </div>
        </div>
        
        <div class="analytics-card">
          <div class="analytics-icon">
            <i class="fas fa-share-alt"></i>
          </div>
          <div class="analytics-content">
            <div class="analytics-title">Social Shares</div>
            <div class="analytics-value">{{ formatNumber(analytics.shares) }}</div>
            <div class="analytics-change positive">
              +{{ analytics.shareGrowth }}% this month
            </div>
          </div>
        </div>
        
        <div class="analytics-card">
          <div class="analytics-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="analytics-content">
            <div class="analytics-title">Conversion Rate</div>
            <div class="analytics-value">{{ analytics.conversionRate }}%</div>
            <div class="analytics-change" :class="analytics.conversionChange >= 0 ? 'positive' : 'negative'">
              {{ analytics.conversionChange >= 0 ? '+' : '' }}{{ analytics.conversionChange }}% this month
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Store Performance Chart -->
    <div class="chart-section">
      <h2>Store Performance</h2>
      <div class="chart-container">
        <canvas ref="performanceChart"></canvas>
      </div>
    </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'StoreProfile',
  components: {
    SellerLayout
  },
  setup() {
    const performanceChart = ref(null)
    let chartInstance = null

    const storeCategories = [
      { id: 'handicrafts', name: 'Handicrafts & Artisanal' },
      { id: 'fashion', name: 'Fashion & Accessories' },
      { id: 'home', name: 'Home & Living' },
      { id: 'food', name: 'Food & Beverages' },
      { id: 'beauty', name: 'Beauty & Personal Care' },
      { id: 'tech', name: 'Technology' }
    ]

    const store = ref({
      name: 'Bulawang Ani Store',
      slug: 'bulawang-ani',
      description: 'We specialize in authentic Filipino handicrafts and artisanal products made by skilled local craftsmen. Each piece tells a story of our rich cultural heritage.',
      category: 'handicrafts',
      foundedDate: '2020-01-15',
      verified: true,
      status: 'Active',
      totalProducts: 156,
      averageRating: 4.8,
      followers: 2150,
      logo: 'https://via.placeholder.com/150x150/f3f4f6/6b7280?text=Store+Logo',
      banner: 'https://via.placeholder.com/1200x400/f3f4f6/6b7280?text=Store+Banner',
      contact: {
        email: 'info@bulawangani.com',
        phone: '+63 912 345 6789',
        website: 'https://bulawangani.com',
        social: {
          facebook: 'https://facebook.com/bulawangani',
          instagram: 'https://instagram.com/bulawangani',
          tiktok: 'https://tiktok.com/@bulawangani'
        }
      },
      business: {
        address: '123 Craftsmen Street, Heritage District, Manila, Philippines',
        tin: '123-456-789-000',
        registrationType: 'sole',
        size: 'small'
      },
      policies: {
        return: 'We accept returns within 30 days of purchase for unused items in original condition. Custom orders are final sale.',
        shipping: 'We ship nationwide via LBC and J&T Express. Standard shipping is 3-7 business days. Express shipping available.',
        privacy: 'We respect your privacy and do not share your information with third parties without your consent.'
      }
    })

    const analytics = ref({
      views: 15420,
      wishlistAdds: 890,
      shares: 234,
      conversionRate: 3.2,
      viewGrowth: 15.6,
      wishlistGrowth: 8.3,
      shareGrowth: 12.1,
      conversionChange: 2.4
    })

    const createPerformanceChart = () => {
      if (!performanceChart.value) return

      const ctx = performanceChart.value.getContext('2d')
      
      if (chartInstance) {
        chartInstance.destroy()
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Store Views',
              data: [12000, 13500, 14200, 14800, 15200, 15420],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            },
            {
              label: 'New Followers',
              data: [120, 150, 180, 200, 220, 250],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }
          ]
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

    const handleLogoUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        // In a real app, you would upload to server and get URL
        const reader = new FileReader()
        reader.onload = (e) => {
          store.value.logo = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const handleBannerUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        // In a real app, you would upload to server and get URL
        const reader = new FileReader()
        reader.onload = (e) => {
          store.value.banner = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const formatNumber = (number) => {
      return new Intl.NumberFormat('en-PH').format(number)
    }

    const previewStore = () => {
      alert('Previewing store...')
    }

    const saveProfile = () => {
      alert('Store profile saved successfully!')
    }

    onMounted(() => {
      createPerformanceChart()
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      performanceChart,
      storeCategories,
      store,
      analytics,
      handleLogoUpload,
      handleBannerUpload,
      formatNumber,
      previewStore,
      saveProfile
    }
  }
}
</script>

<style scoped>
.store-profile {
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

.store-overview {
  margin-bottom: 3rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.overview-card {
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

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

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

.card-content {
  flex: 1;
}

.card-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.form-section {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
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

.url-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.url-prefix {
  background-color: #f3f4f6;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem 0 0 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
}

.url-prefix::after {
  content: '/';
}

.form-input.url-input {
  border-radius: 0 0.5rem 0.5rem 0;
}

.verification-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.verification-badge.verified {
  background-color: #d1fae5;
  color: #065f46;
  border-color: #bbf7d0;
}

.image-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.image-upload-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.current-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
}

.placeholder i {
  font-size: 2rem;
}

.banner-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.banner-preview {
  width: 100%;
  height: 200px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  text-align: center;
  padding: 2rem;
}

.banner-placeholder i {
  font-size: 3rem;
}

.file-input {
  display: none;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.social-link i {
  font-size: 1.25rem;
  color: #6b7280;
  width: 20px;
  text-align: center;
}

.social-link input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
  color: #374151;
}

.analytics-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.analytics-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.analytics-icon {
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

.analytics-content {
  flex: 1;
}

.analytics-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.analytics-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.analytics-change {
  font-size: 0.75rem;
  font-weight: 600;
}

.analytics-change.positive { color: #10b981; }
.analytics-change.negative { color: #ef4444; }

.chart-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
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
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .image-section {
    grid-template-columns: 1fr;
  }
  
  .social-links {
    gap: 0.25rem;
  }
  
  .social-link {
    padding: 0.25rem 0.5rem;
  }
}
</style>