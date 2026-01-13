<template>
  <SellerLayout>
    <div class="profile-settings">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Profile Settings</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="resetForm">
          <i class="fas fa-undo"></i> Reset
        </button>
        <button class="btn-primary" @click="saveSettings">
          <i class="fas fa-save"></i> Save Changes
        </button>
      </div>
    </div>

    <!-- Profile Overview -->
    <div class="profile-overview">
      <div class="overview-grid">
        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Account Status</div>
            <div class="card-value">{{ profile.verified ? 'Verified' : 'Pending Verification' }}</div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Member Since</div>
            <div class="card-value">{{ formatDate(profile.memberSince) }}</div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Seller Rating</div>
            <div class="card-value">{{ profile.rating }} / 5.0</div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Security Level</div>
            <div class="card-value">{{ securityLevel }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="form-section">
      <h2>Personal Information</h2>
      <div class="form-grid">
        <div class="form-group">
          <label for="full-name">Full Name</label>
          <input 
            id="full-name"
            v-model="profile.fullName"
            type="text"
            class="form-input"
            placeholder="Enter your full name"
          >
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            id="email"
            v-model="profile.email"
            type="email"
            class="form-input"
            placeholder="your@email.com"
          >
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input 
            id="phone"
            v-model="profile.phone"
            type="tel"
            class="form-input"
            placeholder="+63 912 345 6789"
          >
        </div>

        <div class="form-group">
          <label for="date-of-birth">Date of Birth</label>
          <input 
            id="date-of-birth"
            v-model="profile.dateOfBirth"
            type="date"
            class="form-input"
          >
        </div>

        <div class="form-group full-width">
          <label for="address">Address</label>
          <textarea 
            id="address"
            v-model="profile.address"
            class="form-textarea"
            rows="3"
            placeholder="Enter your complete address"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Business Information -->
    <div class="form-section">
      <h2>Business Information</h2>
      <div class="form-grid">
        <div class="form-group">
          <label for="business-name">Business Name</label>
          <input 
            id="business-name"
            v-model="profile.business.name"
            type="text"
            class="form-input"
            placeholder="Your business name"
          >
        </div>

        <div class="form-group">
          <label for="business-type">Business Type</label>
          <select 
            id="business-type"
            v-model="profile.business.type"
            class="form-select"
          >
            <option value="">Select business type</option>
            <option value="sole">Sole Proprietorship</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
            <option value="cooperative">Cooperative</option>
          </select>
        </div>

        <div class="form-group">
          <label for="business-tin">TIN Number</label>
          <input 
            id="business-tin"
            v-model="profile.business.tin"
            type="text"
            class="form-input"
            placeholder="TIN Number"
          >
        </div>

        <div class="form-group">
          <label for="business-registration">Registration Date</label>
          <input 
            id="business-registration"
            v-model="profile.business.registrationDate"
            type="date"
            class="form-input"
          >
        </div>

        <div class="form-group full-width">
          <label for="business-description">Business Description</label>
          <textarea 
            id="business-description"
            v-model="profile.business.description"
            class="form-textarea"
            rows="4"
            placeholder="Describe your business..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Profile Image -->
    <div class="form-section">
      <h2>Profile Image</h2>
      <div class="image-section">
        <div class="current-image" @click="viewImage">
          <img :src="profile.avatar" :alt="profile.fullName" v-if="profile.avatar">
          <div class="placeholder" v-else>
            <i class="fas fa-user-circle"></i>
            <span>Upload Profile Picture</span>
          </div>
        </div>
        <div class="image-actions">
          <input 
            ref="avatarInput"
            type="file" 
            accept="image/*" 
            @change="handleAvatarUpload"
            class="file-input"
          >
          <button class="btn-secondary" @click="$refs.avatarInput.click()">
            <i class="fas fa-upload"></i> Change Photo
          </button>
          <button class="btn-outline" @click="removeAvatar">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="form-section">
      <h2>Security Settings</h2>
      <div class="security-grid">
        <div class="security-item">
          <div class="security-info">
            <h3>Change Password</h3>
            <p>Last changed: {{ formatDate(profile.lastPasswordChange) }}</p>
          </div>
          <button class="btn-outline" @click="showChangePassword = true">
            <i class="fas fa-key"></i> Change Password
          </button>
        </div>

        <div class="security-item">
          <div class="security-info">
            <h3>Two-Factor Authentication</h3>
            <p>Add an extra layer of security to your account</p>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="profile.twoFactorEnabled"
              @change="toggleTwoFactor"
            >
            <span class="slider"></span>
          </label>
        </div>

        <div class="security-item">
          <div class="security-info">
            <h3>Session Management</h3>
            <p>Manage active sessions across devices</p>
          </div>
          <button class="btn-outline" @click="manageSessions">
            <i class="fas fa-sign-out-alt"></i> Manage Sessions
          </button>
        </div>

        <div class="security-item">
          <div class="security-info">
            <h3>Security Notifications</h3>
            <p>Get alerts for suspicious activities</p>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="profile.securityNotifications"
            >
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Notification Preferences -->
    <div class="form-section">
      <h2>Notification Preferences</h2>
      <div class="notification-grid">
        <div class="notification-group">
          <h3>Order Notifications</h3>
          <div class="notification-items">
            <label class="checkbox-label">
              <input type="checkbox" v-model="profile.notifications.newOrders">
              <span class="checkbox-text">New orders</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="profile.notifications.orderUpdates">
              <span class="checkbox-text">Order status updates</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="profile.notifications.shipment">
              <span class="checkbox-text">Shipment notifications</span>
            </label>
          </div>
        </div>

        <div class="notification-group">
          <h3>Business Notifications</h3>
          <div class="notification-items">
            <label class="checkbox-label">
              <input type="checkbox" v-model="profile.notifications.lowStock">
              <span class="checkbox-text">Low stock alerts</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="profile.notifications.salesReports">
              <span class="checkbox-text">Sales reports</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="profile.notifications.promotions">
              <span class="checkbox-text">Promotion opportunities</span>
            </label>
          </div>
        </div>

        <div class="notification-group">
          <h3>Communication Preferences</h3>
          <div class="notification-items">
            <label class="checkbox-label">
              <input type="checkbox" v-model="profile.notifications.email">
              <span class="checkbox-text">Email notifications</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="profile.notifications.sms">
              <span class="checkbox-text">SMS notifications</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="profile.notifications.push">
              <span class="checkbox-text">Push notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Actions -->
    <div class="form-section">
      <h2>Account Actions</h2>
      <div class="actions-grid">
        <div class="action-card">
          <div class="action-icon">
            <i class="fas fa-download"></i>
          </div>
          <div class="action-content">
            <h3>Download Data</h3>
            <p>Export your account information and data</p>
            <button class="btn-outline" @click="downloadData">
              <i class="fas fa-download"></i> Download
            </button>
          </div>
        </div>

        <div class="action-card">
          <div class="action-icon">
            <i class="fas fa-trash"></i>
          </div>
          <div class="action-content">
            <h3>Delete Account</h3>
            <p>Permanently delete your seller account</p>
            <button class="btn-danger" @click="showDeleteConfirmation = true">
              <i class="fas fa-trash"></i> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePassword" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Change Password</h3>
          <button class="btn-close" @click="showChangePassword = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="password-form">
            <div class="form-group">
              <label for="current-password">Current Password</label>
              <input 
                id="current-password"
                v-model="passwordForm.current"
                type="password"
                class="form-input"
                placeholder="Enter current password"
              >
            </div>
            <div class="form-group">
              <label for="new-password">New Password</label>
              <input 
                id="new-password"
                v-model="passwordForm.new"
                type="password"
                class="form-input"
                placeholder="Enter new password"
              >
            </div>
            <div class="form-group">
              <label for="confirm-password">Confirm New Password</label>
              <input 
                id="confirm-password"
                v-model="passwordForm.confirm"
                type="password"
                class="form-input"
                placeholder="Confirm new password"
              >
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showChangePassword = false">Cancel</button>
          <button class="btn-primary" @click="changePassword">Change Password</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Delete Account</h3>
          <button class="btn-close" @click="showDeleteConfirmation = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="delete-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <h4>Are you sure you want to delete your account?</h4>
            <p>This action cannot be undone. All your data, including products, orders, and customer information will be permanently deleted.</p>
            <div class="delete-confirmation">
              <label class="checkbox-label">
                <input type="checkbox" v-model="deleteConfirmation">
                <span class="checkbox-text">I understand that this action is irreversible</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showDeleteConfirmation = false">Cancel</button>
          <button 
            class="btn-danger" 
            @click="deleteAccount" 
            :disabled="!deleteConfirmation"
          >
            <i class="fas fa-trash"></i> Delete Account
          </button>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" class="modal-overlay">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Profile Image</h3>
          <button class="btn-close" @click="closeImageModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="image-preview">
            <img :src="profile.avatar" :alt="profile.fullName" v-if="profile.avatar">
          </div>
        </div>
      </div>
    </div>
  </div>
  </SellerLayout>
  
</template>

<script>
import { ref } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'ProfileSettings',
  components: {
    SellerLayout
  },
  setup() {
    const showChangePassword = ref(false)
    const showDeleteConfirmation = ref(false)
    const deleteConfirmation = ref(false)
    const showImageModal = ref(false)

    const profile = ref({
      fullName: 'Maria Santos',
      email: 'maria.santos@example.com',
      phone: '+63 912 345 6789',
      dateOfBirth: '1985-06-15',
      address: '123 Rizal Street, Manila, 1000',
      verified: true,
      memberSince: '2020-01-15T00:00:00',
      rating: 4.8,
      avatar: 'https://via.placeholder.com/150x150/f3f4f6/6b7280?text=Profile+Photo',
      lastPasswordChange: '2024-01-10T10:30:00',
      twoFactorEnabled: true,
      securityNotifications: true,
      business: {
        name: 'Bulawang Ani Store',
        type: 'sole',
        tin: '123-456-789-000',
        registrationDate: '2020-01-15',
        description: 'We specialize in authentic Filipino handicrafts and artisanal products made by skilled local craftsmen.'
      },
      notifications: {
        newOrders: true,
        orderUpdates: true,
        shipment: true,
        lowStock: true,
        salesReports: false,
        promotions: true,
        email: true,
        sms: false,
        push: true
      }
    })

    const passwordForm = ref({
      current: '',
      new: '',
      confirm: ''
    })

    const securityLevel = computed(() => {
      let score = 0
      if (profile.value.twoFactorEnabled) score += 25
      if (profile.value.securityNotifications) score += 25
      if (profile.value.verified) score += 25
      if (passwordForm.value.new.length >= 8) score += 25
      return score >= 75 ? 'High' : score >= 50 ? 'Medium' : 'Low'
    })

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const handleAvatarUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          profile.value.avatar = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const viewImage = () => {
      if (profile.value.avatar) {
        showImageModal.value = true
      }
    }

    const closeImageModal = () => {
      showImageModal.value = false
    }

    const removeAvatar = () => {
      profile.value.avatar = null
    }

    const toggleTwoFactor = () => {
      alert(`Two-factor authentication ${profile.value.twoFactorEnabled ? 'enabled' : 'disabled'}`)
    }

    const manageSessions = () => {
      alert('Managing active sessions...')
    }

    const downloadData = () => {
      alert('Downloading account data...')
    }

    const changePassword = () => {
      if (passwordForm.value.new !== passwordForm.value.confirm) {
        alert('Passwords do not match!')
        return
      }
      if (passwordForm.value.new.length < 8) {
        alert('Password must be at least 8 characters long!')
        return
      }
      alert('Password changed successfully!')
      showChangePassword.value = false
      passwordForm.value = { current: '', new: '', confirm: '' }
    }

    const deleteAccount = () => {
      if (confirm('Are you sure you want to permanently delete your account?')) {
        alert('Account deletion initiated. Please contact support for assistance.')
        showDeleteConfirmation.value = false
        deleteConfirmation.value = false
      }
    }

    const resetForm = () => {
      if (confirm('Reset all changes?')) {
        profile.value = {
          fullName: 'Maria Santos',
          email: 'maria.santos@example.com',
          phone: '+63 912 345 6789',
          dateOfBirth: '1985-06-15',
          address: '123 Rizal Street, Manila, 1000',
          verified: true,
          memberSince: '2020-01-15T00:00:00',
          rating: 4.8,
          avatar: '/images/profile/avatar.jpg',
          lastPasswordChange: '2024-01-10T10:30:00',
          twoFactorEnabled: true,
          securityNotifications: true,
          business: {
            name: 'Bulawang Ani Store',
            type: 'sole',
            tin: '123-456-789-000',
            registrationDate: '2020-01-15',
            description: 'We specialize in authentic Filipino handicrafts and artisanal products made by skilled local craftsmen.'
          },
          notifications: {
            newOrders: true,
            orderUpdates: true,
            shipment: true,
            lowStock: true,
            salesReports: false,
            promotions: true,
            email: true,
            sms: false,
            push: true
          }
        }
      }
    }

    const saveSettings = () => {
      alert('Profile settings saved successfully!')
    }

    return {
      showChangePassword,
      showDeleteConfirmation,
      deleteConfirmation,
      showImageModal,
      profile,
      passwordForm,
      securityLevel,
      formatDate,
      handleAvatarUpload,
      viewImage,
      closeImageModal,
      removeAvatar,
      toggleTwoFactor,
      manageSessions,
      downloadData,
      changePassword,
      deleteAccount,
      resetForm,
      saveSettings
    }
  }
}
</script>

<style scoped>
.profile-settings {
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

.btn-outline {
  background-color: transparent;
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

.btn-outline:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn-danger {
  background-color: #ef4444;
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

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-danger:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.profile-overview {
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

.image-section {
  display: flex;
  align-items: center;
  gap: 2rem;
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
  font-size: 3rem;
}

.image-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  display: none;
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.security-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.security-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
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

.notification-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.notification-group {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.notification-group h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.notification-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-text {
  font-size: 1rem;
  color: #374151;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.action-card {
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

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-icon {
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

.action-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.action-content p {
  margin: 0 0 1rem 0;
  color: #6b7280;
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

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.delete-warning {
  text-align: center;
  padding: 2rem;
}

.delete-warning i {
  font-size: 3rem;
  color: #f59e0b;
  margin-bottom: 1rem;
}

.delete-warning h4 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.delete-warning p {
  margin: 0 0 2rem 0;
  color: #6b7280;
  line-height: 1.5;
}

.delete-confirmation {
  display: flex;
  justify-content: center;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.image-preview img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive styles */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .image-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .security-grid,
  .notification-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    max-width: 90vw;
  }
}
</style>