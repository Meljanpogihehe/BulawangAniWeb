<template>
    <div class="platform-settings-page">
      <div class="page-header">
        <h1>Platform Settings</h1>
        <p>Configure platform-wide settings and preferences</p>
      </div>
      
      <div class="page-content">
        <div class="settings-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <!-- General Settings -->
        <div class="settings-section" v-if="activeTab === 'general'">
          <h3>General Settings</h3>
          <form @submit.prevent="saveSettings" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label>Site Name</label>
                <input type="text" v-model="settings.siteName" />
              </div>
              <div class="form-group">
                <label>Contact Email</label>
                <input type="email" v-model="settings.contactEmail" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" v-model="settings.phoneNumber" />
              </div>
              <div class="form-group">
                <label>Address</label>
                <input type="text" v-model="settings.address" />
              </div>
            </div>
            <div class="form-group">
              <label>Site Description</label>
              <textarea v-model="settings.description" rows="3"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-save">Save Changes</button>
            </div>
          </form>
        </div>
        
        <!-- Business Settings -->
        <div class="settings-section" v-if="activeTab === 'business'">
          <h3>Business Settings</h3>
          <form @submit.prevent="saveBusinessSettings" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label>Business Name</label>
                <input type="text" v-model="businessSettings.businessName" />
              </div>
              <div class="form-group">
                <label>Tax ID</label>
                <input type="text" v-model="businessSettings.taxId" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Business Registration</label>
                <input type="text" v-model="businessSettings.registrationNumber" />
              </div>
              <div class="form-group">
                <label>Business Type</label>
                <select v-model="businessSettings.businessType">
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                  <option value="cooperative">Cooperative</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-save">Save Changes</button>
            </div>
          </form>
        </div>
        
        <!-- Email Settings -->
        <div class="settings-section" v-if="activeTab === 'email'">
          <h3>Email Settings</h3>
          <form @submit.prevent="saveEmailSettings" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label>SMTP Host</label>
                <input type="text" v-model="emailSettings.smtpHost" />
              </div>
              <div class="form-group">
                <label>SMTP Port</label>
                <input type="number" v-model="emailSettings.smtpPort" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>SMTP Username</label>
                <input type="email" v-model="emailSettings.smtpUsername" />
              </div>
              <div class="form-group">
                <label>SMTP Password</label>
                <input type="password" v-model="emailSettings.smtpPassword" />
              </div>
            </div>
            <div class="form-group">
              <label>From Email</label>
              <input type="email" v-model="emailSettings.fromEmail" />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-save">Save Changes</button>
            </div>
          </form>
        </div>
        
        <!-- Social Media -->
        <div class="settings-section" v-if="activeTab === 'social'">
          <h3>Social Media Links</h3>
          <form @submit.prevent="saveSocialSettings" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label>Facebook</label>
                <input type="url" v-model="socialSettings.facebook" placeholder="https://facebook.com/yourpage" />
              </div>
              <div class="form-group">
                <label>Twitter</label>
                <input type="url" v-model="socialSettings.twitter" placeholder="https://twitter.com/yourhandle" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Instagram</label>
                <input type="url" v-model="socialSettings.instagram" placeholder="https://instagram.com/yourhandle" />
              </div>
              <div class="form-group">
                <label>YouTube</label>
                <input type="url" v-model="socialSettings.youtube" placeholder="https://youtube.com/yourchannel" />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-save">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'PlatformSettings',
  data() {
    return {
      activeTab: 'general',
      tabs: [
        { id: 'general', name: 'General' },
        { id: 'business', name: 'Business' },
        { id: 'email', name: 'Email' },
        { id: 'social', name: 'Social Media' }
      ],
      settings: {
        siteName: 'Bulawang Ani',
        contactEmail: 'info@bulawangani.com',
        phoneNumber: '+63 2 123 4567',
        address: '123 Farm Road, Manila, Philippines',
        description: 'Pioneering the future of Philippine agriculture by connecting the soil to the soul of the city.'
      },
      businessSettings: {
        businessName: 'Bulawang Ani Corporation',
        taxId: '123-456-789',
        registrationNumber: 'BN2024001',
        businessType: 'corporation'
      },
      emailSettings: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: 'noreply@bulawangani.com',
        smtpPassword: '••••••••',
        fromEmail: 'noreply@bulawangani.com'
      },
      socialSettings: {
        facebook: 'https://facebook.com/bulawangani',
        twitter: 'https://twitter.com/bulawangani',
        instagram: 'https://instagram.com/bulawangani',
        youtube: 'https://youtube.com/bulawangani'
      }
    }
  },
  methods: {
    saveSettings() {
      // Implement save logic
      console.log('Saving general settings:', this.settings)
      alert('General settings saved successfully!')
    },
    saveBusinessSettings() {
      // Implement save logic
      console.log('Saving business settings:', this.businessSettings)
      alert('Business settings saved successfully!')
    },
    saveEmailSettings() {
      // Implement save logic
      console.log('Saving email settings:', this.emailSettings)
      alert('Email settings saved successfully!')
    },
    saveSocialSettings() {
      // Implement save logic
      console.log('Saving social settings:', this.socialSettings)
      alert('Social media settings saved successfully!')
    }
  }
}
</script>

<style scoped>
.platform-settings-page {
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

.settings-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e8f1e1;
  padding-bottom: 1rem;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #7f8c8d;
}

.tab-btn:hover {
  background: #f8faf7;
  color: #2c3e50;
}

.tab-btn.active {
  background: #eafaf1;
  color: #27ae60;
  border: 1px solid #c3e6cb;
}

.settings-section {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
}

.settings-section h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.settings-form {
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

.form-group input, .form-group select, .form-group textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #27ae60;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-save {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .platform-settings-page {
    padding: 1rem;
  }
  
  .settings-tabs {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>