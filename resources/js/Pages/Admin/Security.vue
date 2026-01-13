<template>
    <div class="security-page">
      <div class="page-header">
        <h1>Security Settings</h1>
        <p>Configure platform security and user authentication</p>
      </div>
      
      <div class="page-content">
        <div class="security-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <!-- Authentication Settings -->
        <div class="settings-section" v-if="activeTab === 'auth'">
          <h3>Authentication Settings</h3>
          <form @submit.prevent="saveAuthSettings" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label>Password Policy</label>
                <select v-model="authSettings.passwordPolicy">
                  <option value="basic">Basic (8+ characters)</option>
                  <option value="strong">Strong (12+ with special chars)</option>
                  <option value="very_strong">Very Strong (16+ with complexity)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Session Timeout (minutes)</label>
                <input type="number" v-model="authSettings.sessionTimeout" min="5" max="480" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Max Login Attempts</label>
                <input type="number" v-model="authSettings.maxLoginAttempts" min="1" max="10" />
              </div>
              <div class="form-group">
                <label>Lockout Duration (minutes)</label>
                <input type="number" v-model="authSettings.lockoutDuration" min="1" max="60" />
              </div>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="authSettings.twoFactorAuth" />
                Enable Two-Factor Authentication
              </label>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="authSettings.emailVerification" />
                Require Email Verification
              </label>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-save">Save Changes</button>
            </div>
          </form>
        </div>
        
        <!-- IP Whitelist -->
        <div class="settings-section" v-if="activeTab === 'ip'">
          <h3>IP Whitelist</h3>
          <div class="controls">
            <button class="btn-primary" @click="showAddIP = !showAddIP">
              {{ showAddIP ? 'Cancel' : 'Add IP Address' }}
            </button>
          </div>
          
          <div class="create-form" v-if="showAddIP">
            <h4>Add IP Address</h4>
            <form @submit.prevent="addIPAddress" class="ip-form">
              <div class="form-row">
                <div class="form-group">
                  <label>IP Address</label>
                  <input type="text" v-model="newIP.address" placeholder="e.g., 192.168.1.100" required />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <input type="text" v-model="newIP.description" placeholder="e.g., Office Network" />
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-submit">Add IP</button>
                <button type="button" @click="showAddIP = false" class="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
          
          <div class="ip-list">
            <div class="ip-item" v-for="ip in ipWhitelist" :key="ip.id">
              <div class="ip-info">
                <div class="ip-address">{{ ip.address }}</div>
                <div class="ip-description">{{ ip.description }}</div>
              </div>
              <div class="ip-actions">
                <button class="btn-delete" @click="deleteIP(ip.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- SSL/TLS Settings -->
        <div class="settings-section" v-if="activeTab === 'ssl'">
          <h3>SSL/TLS Settings</h3>
          <form @submit.prevent="saveSSLSettings" class="settings-form">
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="sslSettings.forceHTTPS" />
                Force HTTPS for all connections
              </label>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="sslSettings.hsts" />
                Enable HTTP Strict Transport Security (HSTS)
              </label>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>SSL Certificate Expiry</label>
                <input type="date" v-model="sslSettings.certExpiry" />
              </div>
              <div class="form-group">
                <label>Notification Days</label>
                <input type="number" v-model="sslSettings.notificationDays" min="1" max="90" />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-save">Save Changes</button>
            </div>
          </form>
        </div>
        
        <!-- Security Logs -->
        <div class="settings-section" v-if="activeTab === 'logs'">
          <h3>Security Logs</h3>
          <div class="log-controls">
            <div class="filters">
              <select v-model="logFilter.type">
                <option value="all">All Events</option>
                <option value="login">Login Attempts</option>
                <option value="security">Security Events</option>
                <option value="admin">Admin Actions</option>
              </select>
              <select v-model="logFilter.severity">
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div class="search-box">
              <input type="text" v-model="logFilter.search" placeholder="Search logs..." />
            </div>
          </div>
          
          <div class="logs-table">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Event</th>
                  <th>User</th>
                  <th>IP Address</th>
                  <th>Severity</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in filteredLogs" :key="log.id">
                  <td>{{ formatDate(log.timestamp) }}</td>
                  <td>{{ log.event }}</td>
                  <td>{{ log.user }}</td>
                  <td>{{ log.ipAddress }}</td>
                  <td>
                    <span :class="['severity-badge', log.severity]">{{ log.severity }}</span>
                  </td>
                  <td>{{ log.details }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Security',
  data() {
    return {
      activeTab: 'auth',
      tabs: [
        { id: 'auth', name: 'Authentication' },
        { id: 'ip', name: 'IP Whitelist' },
        { id: 'ssl', name: 'SSL/TLS' },
        { id: 'logs', name: 'Security Logs' }
      ],
      authSettings: {
        passwordPolicy: 'strong',
        sessionTimeout: 120,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        twoFactorAuth: true,
        emailVerification: true
      },
      showAddIP: false,
      newIP: {
        address: '',
        description: ''
      },
      ipWhitelist: [
        { id: 1, address: '192.168.1.100', description: 'Office Main Network' },
        { id: 2, address: '10.0.0.1', description: 'Admin Office' },
        { id: 3, address: '203.0.113.1', description: 'Data Center' }
      ],
      sslSettings: {
        forceHTTPS: true,
        hsts: true,
        certExpiry: '2025-12-31',
        notificationDays: 30
      },
      logFilter: {
        type: 'all',
        severity: 'all',
        search: ''
      },
      securityLogs: [
        { id: 1, timestamp: '2024-01-15T15:30:00', event: 'Successful Login', user: 'admin@bulawangani.com', ipAddress: '192.168.1.100', severity: 'info', details: 'Admin login successful' },
        { id: 2, timestamp: '2024-01-15T15:25:00', event: 'Failed Login', user: 'user@example.com', ipAddress: '192.168.1.101', severity: 'warning', details: 'Invalid password attempt' },
        { id: 3, timestamp: '2024-01-15T15:20:00', event: 'Password Change', user: 'manager@bulawangani.com', ipAddress: '192.168.1.102', severity: 'info', details: 'Password updated successfully' },
        { id: 4, timestamp: '2024-01-15T15:15:00', event: 'Suspicious Activity', user: 'system', ipAddress: '203.0.113.50', severity: 'error', details: 'Multiple failed login attempts detected' }
      ]
    }
  },
  computed: {
    filteredLogs() {
      let filtered = this.securityLogs
      
      if (this.logFilter.type !== 'all') {
        filtered = filtered.filter(log => log.event.toLowerCase().includes(this.logFilter.type))
      }
      
      if (this.logFilter.severity !== 'all') {
        filtered = filtered.filter(log => log.severity === this.logFilter.severity)
      }
      
      if (this.logFilter.search) {
        const query = this.logFilter.search.toLowerCase()
        filtered = filtered.filter(log => 
          log.event.toLowerCase().includes(query) ||
          log.user.toLowerCase().includes(query) ||
          log.ipAddress.includes(query) ||
          log.details.toLowerCase().includes(query)
        )
      }
      
      return filtered
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('en-PH', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    saveAuthSettings() {
      console.log('Saving auth settings:', this.authSettings)
      alert('Authentication settings saved successfully!')
    },
    addIPAddress() {
      const ip = {
        id: Date.now(),
        ...this.newIP
      }
      this.ipWhitelist.unshift(ip)
      this.resetIPForm()
      this.showAddIP = false
    },
    deleteIP(id) {
      this.ipWhitelist = this.ipWhitelist.filter(ip => ip.id !== id)
    },
    saveSSLSettings() {
      console.log('Saving SSL settings:', this.sslSettings)
      alert('SSL/TLS settings saved successfully!')
    },
    resetIPForm() {
      this.newIP = {
        address: '',
        description: ''
      }
    }
  }
}
</script>

<style scoped>
.security-page {
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

.security-tabs {
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
  margin-bottom: 2rem;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input {
  width: auto;
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

.controls {
  margin-bottom: 1.5rem;
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

.ip-form {
  display: grid;
  gap: 1rem;
}

.ip-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ip-item {
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ip-info {
  display: flex;
  flex-direction: column;
}

.ip-address {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.ip-description {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.ip-actions {
  display: flex;
  gap: 1rem;
}

.btn-delete {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background: #ffeaa7;
}

.log-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

.logs-table {
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  overflow: hidden;
}

.logs-table table {
  width: 100%;
  border-collapse: collapse;
}

.logs-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.logs-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
  font-size: 0.9rem;
}

.logs-table tr:hover {
  background: #f8faf7;
}

.severity-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.severity-badge.info {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.severity-badge.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.severity-badge.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .security-page {
    padding: 1rem;
  }
  
  .security-tabs {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .log-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filters {
    flex-direction: column;
    width: 100%;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .logs-table th, .logs-table td {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}
</style>