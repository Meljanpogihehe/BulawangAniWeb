<template>
    <div class="change-password">
      <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Change Password</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="resetForm">
          <i class="fas fa-undo"></i> Reset
        </button>
        <button class="btn-primary" @click="changePassword" :disabled="!isFormValid">
          <i class="fas fa-save"></i> Update Password
        </button>
      </div>
    </div>

    <!-- Security Overview -->
    <div class="security-overview">
      <div class="overview-grid">
        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Account Security</div>
            <div class="card-value">{{ securityLevel }}</div>
            <div class="card-subtitle">Last changed: {{ formatDate(lastPasswordChange) }}</div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-lock"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Password Strength</div>
            <div class="card-value">{{ passwordStrength }}</div>
            <div class="strength-bar">
              <div class="strength-fill" :class="passwordStrengthClass"></div>
            </div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-eye"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Two-Factor Auth</div>
            <div class="card-value">{{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}</div>
            <div class="card-subtitle">Recommended for enhanced security</div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Password Age</div>
            <div class="card-value">{{ passwordAge }} days</div>
            <div class="card-subtitle">Consider changing every 90 days</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Change Form -->
    <div class="form-section">
      <h2>Update Your Password</h2>
      <div class="form-grid">
        <div class="form-group">
          <label for="current-password">Current Password</label>
          <div class="password-input">
            <input 
              id="current-password"
              v-model="passwordForm.current"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Enter your current password"
              @input="validateCurrentPassword"
            >
            <button 
              type="button" 
              class="password-toggle"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              <i class="fas" :class="showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>
          <div class="input-hint">Enter your current password to verify your identity</div>
        </div>

        <div class="form-group">
          <label for="new-password">New Password</label>
          <div class="password-input">
            <input 
              id="new-password"
              v-model="passwordForm.new"
              :type="showNewPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Enter your new password"
              @input="validatePassword"
            >
            <button 
              type="button" 
              class="password-toggle"
              @click="showNewPassword = !showNewPassword"
            >
              <i class="fas" :class="showNewPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>
          <div class="password-requirements">
            <div class="requirement" :class="{ valid: passwordRequirements.length }">
              <i class="fas fa-check-circle"></i> At least 8 characters
            </div>
            <div class="requirement" :class="{ valid: passwordRequirements.uppercase }">
              <i class="fas fa-check-circle"></i> One uppercase letter
            </div>
            <div class="requirement" :class="{ valid: passwordRequirements.lowercase }">
              <i class="fas fa-check-circle"></i> One lowercase letter
            </div>
            <div class="requirement" :class="{ valid: passwordRequirements.number }">
              <i class="fas fa-check-circle"></i> One number
            </div>
            <div class="requirement" :class="{ valid: passwordRequirements.special }">
              <i class="fas fa-check-circle"></i> One special character
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirm New Password</label>
          <div class="password-input">
            <input 
              id="confirm-password"
              v-model="passwordForm.confirm"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Confirm your new password"
              @input="validateConfirmPassword"
            >
            <button 
              type="button" 
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i class="fas" :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>
          <div class="input-hint">Re-enter your new password to confirm</div>
        </div>
      </div>
    </div>

    <!-- Security Tips -->
    <div class="security-tips">
      <h3>Security Tips</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <div class="tip-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <div class="tip-content">
            <h4>Use Strong Passwords</h4>
            <p>Combine uppercase, lowercase, numbers, and special characters for maximum security.</p>
          </div>
        </div>

        <div class="tip-card">
          <div class="tip-icon">
            <i class="fas fa-key"></i>
          </div>
          <div class="tip-content">
            <h4>Unique for Each Account</h4>
            <p>Never reuse passwords across different websites or services.</p>
          </div>
        </div>

        <div class="tip-card">
          <div class="tip-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="tip-content">
            <h4>Regular Updates</h4>
            <p>Change your password every 60-90 days to maintain security.</p>
          </div>
        </div>

        <div class="tip-card">
          <div class="tip-icon">
            <i class="fas fa-lock"></i>
          </div>
          <div class="tip-content">
            <h4>Enable 2FA</h4>
            <p>Two-factor authentication adds an extra layer of protection.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Password History -->
    <div class="password-history">
      <h3>Password History</h3>
      <div class="history-table">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date Changed</th>
              <th>Method</th>
              <th>Security Level</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="change in passwordHistory" :key="change.id">
              <td>{{ formatDate(change.date) }}</td>
              <td>{{ change.method }}</td>
              <td>
                <span class="security-badge" :class="change.securityLevel.toLowerCase()">
                  {{ change.securityLevel }}
                </span>
              </td>
              <td>{{ change.notes }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Account Recovery -->
    <div class="recovery-section">
      <h3>Account Recovery</h3>
      <div class="recovery-grid">
        <div class="recovery-card">
          <div class="recovery-icon">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="recovery-content">
            <h4>Email Recovery</h4>
            <p>Set up email recovery for forgotten passwords</p>
            <button class="btn-outline" @click="setupEmailRecovery">
              <i class="fas fa-cog"></i> Configure
            </button>
          </div>
        </div>

        <div class="recovery-card">
          <div class="recovery-icon">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <div class="recovery-content">
            <h4>Mobile Recovery</h4>
            <p>Use your phone for account recovery</p>
            <button class="btn-outline" @click="setupMobileRecovery">
              <i class="fas fa-cog"></i> Configure
            </button>
          </div>
        </div>

        <div class="recovery-card">
          <div class="recovery-icon">
            <i class="fas fa-question-circle"></i>
          </div>
          <div class="recovery-content">
            <h4>Security Questions</h4>
            <p>Set up security questions for account recovery</p>
            <button class="btn-outline" @click="setupSecurityQuestions">
              <i class="fas fa-cog"></i> Configure
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Password Updated Successfully</h3>
          <button class="btn-close" @click="showSuccessModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h4>Your password has been updated</h4>
            <p>Your new password is now active. For security reasons, you may need to log in again on other devices.</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="showSuccessModal = false">Close</button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showErrorModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Password Update Failed</h3>
          <button class="btn-close" @click="showErrorModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h4>{{ errorMessage }}</h4>
            <p>Please check your current password and try again.</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="showErrorModal = false">Try Again</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'ChangePassword',
  components: {
    SellerLayout
  },
  setup() {
    const showCurrentPassword = ref(false)
    const showNewPassword = ref(false)
    const showConfirmPassword = ref(false)
    const showSuccessModal = ref(false)
    const showErrorModal = ref(false)
    const errorMessage = ref('')

    const passwordForm = ref({
      current: '',
      new: '',
      confirm: ''
    })

    const lastPasswordChange = ref('2024-01-10T10:30:00')
    const twoFactorEnabled = ref(true)

    const passwordHistory = ref([
      {
        id: 1,
        date: '2024-01-10T10:30:00',
        method: 'Web Interface',
        securityLevel: 'Strong',
        notes: 'Updated after security audit'
      },
      {
        id: 2,
        date: '2023-10-15T14:20:00',
        method: 'Mobile App',
        securityLevel: 'Medium',
        notes: 'Regular password rotation'
      },
      {
        id: 3,
        date: '2023-07-22T09:15:00',
        method: 'Web Interface',
        securityLevel: 'Strong',
        notes: 'Initial setup'
      }
    ])

    const passwordRequirements = computed(() => {
      const password = passwordForm.value.new
      return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      }
    })

    const passwordStrength = computed(() => {
      const req = passwordRequirements.value
      const count = Object.values(req).filter(Boolean).length
      
      if (count === 5) return 'Very Strong'
      if (count === 4) return 'Strong'
      if (count === 3) return 'Medium'
      if (count === 2) return 'Weak'
      return 'Very Weak'
    })

    const passwordStrengthClass = computed(() => {
      const strength = passwordStrength.value
      if (strength === 'Very Strong') return 'very-strong'
      if (strength === 'Strong') return 'strong'
      if (strength === 'Medium') return 'medium'
      if (strength === 'Weak') return 'weak'
      return 'very-weak'
    })

    const isFormValid = computed(() => {
      return (
        passwordForm.value.current.length > 0 &&
        passwordForm.value.new.length >= 8 &&
        passwordForm.value.confirm.length > 0 &&
        passwordForm.value.new === passwordForm.value.confirm &&
        Object.values(passwordRequirements.value).every(Boolean)
      )
    })

    const securityLevel = computed(() => {
      let score = 0
      if (twoFactorEnabled.value) score += 25
      if (passwordStrength.value === 'Very Strong') score += 25
      if (passwordStrength.value === 'Strong') score += 20
      if (passwordStrength.value === 'Medium') score += 15
      if (passwordStrength.value === 'Weak') score += 10
      if (passwordStrength.value === 'Very Weak') score += 5
      
      return score >= 75 ? 'High' : score >= 50 ? 'Medium' : 'Low'
    })

    const passwordAge = computed(() => {
      const lastChange = new Date(lastPasswordChange.value)
      const today = new Date()
      const diffTime = today - lastChange
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    })

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const validateCurrentPassword = () => {
      // In a real app, this would validate against the actual password
      if (passwordForm.value.current.length > 0 && passwordForm.value.current !== 'currentpassword') {
        // Show error or handle invalid current password
      }
    }

    const validatePassword = () => {
      // Password validation is handled by computed properties
    }

    const validateConfirmPassword = () => {
      // Password confirmation validation is handled by computed properties
    }

    const changePassword = () => {
      if (!isFormValid.value) {
        errorMessage.value = 'Please ensure all password requirements are met and passwords match.'
        showErrorModal.value = true
        return
      }

      // Simulate API call
      setTimeout(() => {
        showSuccessModal.value = true
        passwordForm.value = { current: '', new: '', confirm: '' }
        lastPasswordChange.value = new Date().toISOString()
        
        // Add to history
        passwordHistory.value.unshift({
          id: Date.now(),
          date: new Date().toISOString(),
          method: 'Web Interface',
          securityLevel: passwordStrength.value,
          notes: 'Password updated successfully'
        })
      }, 1000)
    }

    const resetForm = () => {
      if (confirm('Reset password form?')) {
        passwordForm.value = { current: '', new: '', confirm: '' }
        showCurrentPassword.value = false
        showNewPassword.value = false
        showConfirmPassword.value = false
      }
    }

    const setupEmailRecovery = () => {
      alert('Setting up email recovery...')
    }

    const setupMobileRecovery = () => {
      alert('Setting up mobile recovery...')
    }

    const setupSecurityQuestions = () => {
      alert('Setting up security questions...')
    }

    return {
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      showSuccessModal,
      showErrorModal,
      errorMessage,
      passwordForm,
      lastPasswordChange,
      twoFactorEnabled,
      passwordHistory,
      passwordRequirements,
      passwordStrength,
      passwordStrengthClass,
      isFormValid,
      securityLevel,
      passwordAge,
      formatDate,
      validateCurrentPassword,
      validatePassword,
      validateConfirmPassword,
      changePassword,
      resetForm,
      setupEmailRecovery,
      setupMobileRecovery,
      setupSecurityQuestions
    }
  }
}
</script>

<style scoped>
.change-password {
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

.security-overview {
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
  margin-bottom: 0.25rem;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  width: 0%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-fill.very-weak { width: 20%; background-color: #ef4444; }
.strength-fill.weak { width: 40%; background-color: #f59e0b; }
.strength-fill.medium { width: 60%; background-color: #eab308; }
.strength-fill.strong { width: 80%; background-color: #10b981; }
.strength-fill.very-strong { width: 100%; background-color: #22c55e; }

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

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  background-color: white;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.password-toggle:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.input-hint {
  font-size: 0.75rem;
  color: #6b7280;
}

.password-requirements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.requirement.valid {
  color: #10b981;
  background-color: #ecfdf5;
}

.requirement i {
  font-size: 0.75rem;
}

.requirement i:not(.valid) {
  color: #9ca3af;
}

.security-tips {
  margin-bottom: 3rem;
}

.security-tips h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.tip-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.2s;
}

.tip-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tip-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  background-color: #3b82f6;
}

.tip-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.tip-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.password-history {
  margin-bottom: 3rem;
}

.password-history h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.history-table {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
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

.security-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.security-badge.very-strong {
  background-color: #ecfdf5;
  color: #065f46;
}

.security-badge.strong {
  background-color: #f0fdf4;
  color: #166534;
}

.security-badge.medium {
  background-color: #fffbeb;
  color: #92400e;
}

.security-badge.weak {
  background-color: #fef3c7;
  color: #92400e;
}

.security-badge.very-weak {
  background-color: #fee2e2;
  color: #991b1b;
}

.recovery-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.recovery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.recovery-card {
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

.recovery-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.recovery-icon {
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

.recovery-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.recovery-content p {
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

.success-content,
.error-content {
  text-align: center;
  padding: 2rem;
}

.success-content i {
  font-size: 3rem;
  color: #10b981;
  margin-bottom: 1rem;
}

.error-content i {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.success-content h4,
.error-content h4 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.success-content p,
.error-content p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
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
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .tips-grid,
  .recovery-grid {
    grid-template-columns: 1fr;
  }
  
  .password-requirements {
    grid-template-columns: 1fr;
  }
  
  .modal {
    max-width: 90vw;
  }
}
</style>