<template>
    <div class="banners-page">
      <div class="page-header">
        <h1>Banners & Promotions</h1>
        <p>Manage promotional banners and marketing campaigns</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="showCreateForm = !showCreateForm">
            {{ showCreateForm ? 'Cancel' : 'Add New Banner' }}
          </button>
          <div class="search-box">
            <input type="text" placeholder="Search banners..." v-model="searchQuery" />
          </div>
        </div>
        
        <!-- Create Banner Form -->
        <div class="create-form" v-if="showCreateForm">
          <h3>Create New Banner</h3>
          <form @submit.prevent="createBanner" class="banner-form">
            <div class="form-row">
              <div class="form-group">
                <label>Title</label>
                <input type="text" v-model="newBanner.title" placeholder="Enter banner title" required />
              </div>
              <div class="form-group">
                <label>Subtitle</label>
                <input type="text" v-model="newBanner.subtitle" placeholder="Enter banner subtitle" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>CTA Text</label>
                <input type="text" v-model="newBanner.ctaText" placeholder="Enter call-to-action text" required />
              </div>
              <div class="form-group">
                <label>CTA Link</label>
                <input type="url" v-model="newBanner.ctaLink" placeholder="Enter link URL" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Position</label>
                <select v-model="newBanner.position" required>
                  <option value="hero">Hero Section</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                  <option value="popup">Popup</option>
                </select>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select v-model="newBanner.status" required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Start Date</label>
                <input type="date" v-model="newBanner.startDate" required />
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input type="date" v-model="newBanner.endDate" required />
              </div>
            </div>
            <div class="form-group">
              <label>Background Color</label>
              <input type="color" v-model="newBanner.backgroundColor" />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-submit">Create Banner</button>
              <button type="button" @click="showCreateForm = false" class="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
        
        <!-- Banners Grid -->
        <div class="banners-grid">
          <div class="banner-card" v-for="banner in filteredBanners" :key="banner.id">
            <div class="banner-preview">
              <div class="banner-content" :style="{ backgroundColor: banner.backgroundColor }">
                <h3>{{ banner.title }}</h3>
                <p>{{ banner.subtitle }}</p>
                <button class="banner-cta">{{ banner.ctaText }}</button>
              </div>
            </div>
            <div class="banner-info">
              <div class="info-row">
                <span class="label">Position:</span>
                <span class="value">{{ banner.position }}</span>
              </div>
              <div class="info-row">
                <span class="label">Status:</span>
                <span :class="['status-badge', banner.status]">{{ banner.status }}</span>
              </div>
              <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">{{ formatDate(banner.startDate) }} - {{ formatDate(banner.endDate) }}</span>
              </div>
            </div>
            <div class="banner-actions">
              <button class="btn-edit" @click="editBanner(banner)">Edit</button>
              <button class="btn-delete" @click="deleteBanner(banner.id)">Delete</button>
              <button class="btn-preview" @click="previewBanner(banner)">Preview</button>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div class="empty-state" v-if="filteredBanners.length === 0">
          <div class="empty-icon">🖼️</div>
          <h3>No Banners</h3>
          <p>Create your first banner to promote special offers and announcements.</p>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Banners',
  data() {
    return {
      showCreateForm: false,
      searchQuery: '',
      newBanner: {
        title: '',
        subtitle: '',
        ctaText: 'Shop Now',
        ctaLink: '',
        position: 'hero',
        status: 'active',
        startDate: '',
        endDate: '',
        backgroundColor: '#27ae60'
      },
      banners: [
        {
          id: 1,
          title: 'Fresh Harvest Sale',
          subtitle: 'Up to 50% off on seasonal produce',
          ctaText: 'Shop Now',
          ctaLink: '/products',
          position: 'hero',
          status: 'active',
          startDate: '2024-01-15',
          endDate: '2024-01-31',
          backgroundColor: '#27ae60'
        },
        {
          id: 2,
          title: 'New Organic Collection',
          subtitle: 'Certified organic products now available',
          ctaText: 'Explore',
          ctaLink: '/products/organic',
          position: 'sidebar',
          status: 'active',
          startDate: '2024-01-10',
          endDate: '2024-02-10',
          backgroundColor: '#f39c12'
        },
        {
          id: 3,
          title: 'Free Shipping',
          subtitle: 'On orders over ₱1000',
          ctaText: 'Order Today',
          ctaLink: '/products',
          position: 'footer',
          status: 'inactive',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          backgroundColor: '#3498db'
        }
      ]
    }
  },
  computed: {
    filteredBanners() {
      if (!this.searchQuery) {
        return this.banners
      }
      const query = this.searchQuery.toLowerCase()
      return this.banners.filter(banner => 
        banner.title.toLowerCase().includes(query) ||
        banner.subtitle.toLowerCase().includes(query) ||
        banner.position.toLowerCase().includes(query) ||
        banner.status.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    createBanner() {
      const banner = {
        id: Date.now(),
        ...this.newBanner
      }
      this.banners.unshift(banner)
      this.resetForm()
      this.showCreateForm = false
    },
    editBanner(banner) {
      // Implement edit functionality
      console.log('Editing banner:', banner)
    },
    deleteBanner(id) {
      this.banners = this.banners.filter(b => b.id !== id)
    },
    previewBanner(banner) {
      // Implement preview functionality
      console.log('Previewing banner:', banner)
    },
    resetForm() {
      this.newBanner = {
        title: '',
        subtitle: '',
        ctaText: 'Shop Now',
        ctaLink: '',
        position: 'hero',
        status: 'active',
        startDate: '',
        endDate: '',
        backgroundColor: '#27ae60'
      }
    }
  }
}
</script>

<style scoped>
.banners-page {
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

.create-form {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.create-form h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.banner-form {
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

.banners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.banner-card {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.banner-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.banner-preview {
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  padding: 1rem;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  text-align: center;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
}

.banner-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.banner-content p {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.banner-cta {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-cta:hover {
  background: rgba(255, 255, 255, 0.3);
}

.banner-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
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

.banner-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.btn-edit, .btn-delete, .btn-preview {
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

.btn-preview {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.btn-preview:hover {
  background: #bbdefb;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0;
  color: #7f8c8d;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .banners-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .banners-grid {
    grid-template-columns: 1fr;
  }
  
  .banner-actions {
    flex-direction: column;
  }
}
</style>