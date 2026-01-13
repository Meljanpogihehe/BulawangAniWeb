<template>
    <div class="activity-logs-page">
      <div class="page-header">
        <h1>Activity Logs</h1>
        <p>Monitor and audit all system activities and user actions</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <div class="filters">
            <select v-model="filter.type">
              <option value="all">All Activities</option>
              <option value="login">Login/Logout</option>
              <option value="admin">Admin Actions</option>
              <option value="user">User Actions</option>
              <option value="system">System Events</option>
            </select>
            <select v-model="filter.severity">
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
            <select v-model="filter.userType">
              <option value="all">All Users</option>
              <option value="admin">Admins</option>
              <option value="seller">Sellers</option>
              <option value="buyer">Buyers</option>
            </select>
          </div>
          <div class="search-actions">
            <input type="text" v-model="filter.search" placeholder="Search logs..." class="search-input" />
            <button class="btn-export">Export Logs</button>
            <button class="btn-clear" @click="clearFilters">Clear Filters</button>
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <div class="metric-value">{{ totalLogs }}</div>
              <div class="metric-label">Total Logs</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">⚠️</div>
            <div class="metric-content">
              <div class="metric-value">{{ warningCount }}</div>
              <div class="metric-label">Warnings</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">❌</div>
            <div class="metric-content">
              <div class="metric-value">{{ errorCount }}</div>
              <div class="metric-label">Errors</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">👤</div>
            <div class="metric-content">
              <div class="metric-value">{{ uniqueUsers }}</div>
              <div class="metric-label">Active Users</div>
            </div>
          </div>
        </div>
        
        <div class="logs-container">
          <div class="log-timeline">
            <div class="timeline-item" v-for="log in filteredLogs" :key="log.id" :class="log.severity">
              <div class="timeline-marker">
                <div class="marker-icon" :class="log.type">
                  {{ getActivityIcon(log.type) }}
                </div>
              </div>
              <div class="timeline-content">
                <div class="log-header">
                  <span class="log-time">{{ formatTime(log.timestamp) }}</span>
                  <span class="log-severity" :class="log.severity">{{ log.severity }}</span>
                </div>
                <div class="log-details">
                  <div class="log-action">{{ log.action }}</div>
                  <div class="log-user">{{ log.user }}</div>
                  <div class="log-description">{{ log.description }}</div>
                  <div class="log-metadata">
                    <span class="meta-item">IP: {{ log.ipAddress }}</span>
                    <span class="meta-item">User Agent: {{ log.userAgent }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div class="empty-state" v-if="filteredLogs.length === 0">
          <div class="empty-icon">📋</div>
          <h3>No Activity Logs</h3>
          <p>No logs found matching your current filters.</p>
          <button class="btn-clear" @click="clearFilters">Clear Filters</button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ActivityLogs',
  data() {
    return {
      filter: {
        type: 'all',
        severity: 'all',
        userType: 'all',
        search: ''
      },
      logs: [
        {
          id: 1,
          timestamp: '2024-01-15T15:30:00',
          type: 'login',
          severity: 'info',
          action: 'User Login',
          user: 'admin@bulawangani.com (Admin)',
          description: 'Successful admin login from office network',
          ipAddress: '192.168.1.100',
          userAgent: 'Chrome/120.0.0.0'
        },
        {
          id: 2,
          timestamp: '2024-01-15T15:25:00',
          type: 'admin',
          severity: 'info',
          action: 'Product Updated',
          user: 'manager@bulawangani.com (Admin)',
          description: 'Updated price for Premium Dinorado Rice',
          ipAddress: '192.168.1.102',
          userAgent: 'Firefox/121.0'
        },
        {
          id: 3,
          timestamp: '2024-01-15T15:20:00',
          type: 'warning',
          severity: 'warning',
          action: 'Multiple Failed Logins',
          user: 'Unknown User',
          description: '5 failed login attempts detected from single IP',
          ipAddress: '203.0.113.50',
          userAgent: 'Unknown'
        },
        {
          id: 4,
          timestamp: '2024-01-15T15:15:00',
          type: 'system',
          severity: 'info',
          action: 'Database Backup',
          user: 'System',
          description: 'Daily database backup completed successfully',
          ipAddress: '127.0.0.1',
          userAgent: 'Cron Job'
        },
        {
          id: 5,
          timestamp: '2024-01-15T15:10:00',
          type: 'user',
          severity: 'info',
          action: 'Order Placed',
          user: 'john@example.com (Buyer)',
          description: 'New order #1001 placed successfully',
          ipAddress: '192.168.1.105',
          userAgent: 'Safari/16.0'
        },
        {
          id: 6,
          timestamp: '2024-01-15T15:05:00',
          type: 'admin',
          severity: 'error',
          action: 'Permission Denied',
          user: 'staff@bulawangani.com (Admin)',
          description: 'Attempted access to restricted financial reports',
          ipAddress: '192.168.1.103',
          userAgent: 'Edge/120.0'
        },
        {
          id: 7,
          timestamp: '2024-01-15T15:00:00',
          type: 'seller',
          severity: 'info',
          action: 'Product Listed',
          user: 'seller@freshfarm.com (Seller)',
          description: 'New product "Organic Tomatoes" listed for sale',
          ipAddress: '192.168.1.110',
          userAgent: 'Chrome/120.0.0.0'
        }
      ]
    }
  },
  computed: {
    filteredLogs() {
      let filtered = this.logs
      
      // Filter by type
      if (this.filter.type !== 'all') {
        filtered = filtered.filter(log => log.type === this.filter.type)
      }
      
      // Filter by severity
      if (this.filter.severity !== 'all') {
        filtered = filtered.filter(log => log.severity === this.filter.severity)
      }
      
      // Filter by user type
      if (this.filter.userType !== 'all') {
        const userTypeMap = {
          admin: ['Admin'],
          seller: ['Seller'],
          buyer: ['Buyer']
        }
        const allowedTypes = userTypeMap[this.filter.userType] || []
        filtered = filtered.filter(log => {
          return allowedTypes.some(type => log.user.includes(`(${type})`))
        })
      }
      
      // Filter by search
      if (this.filter.search) {
        const query = this.filter.search.toLowerCase()
        filtered = filtered.filter(log => 
          log.action.toLowerCase().includes(query) ||
          log.user.toLowerCase().includes(query) ||
          log.description.toLowerCase().includes(query) ||
          log.ipAddress.includes(query)
        )
      }
      
      return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    },
    totalLogs() {
      return this.filteredLogs.length
    },
    warningCount() {
      return this.filteredLogs.filter(log => log.severity === 'warning').length
    },
    errorCount() {
      return this.filteredLogs.filter(log => log.severity === 'error').length
    },
    uniqueUsers() {
      const users = new Set(this.filteredLogs.map(log => log.user))
      return users.size
    }
  },
  methods: {
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('en-PH', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getActivityIcon(type) {
      const icons = {
        login: '🔐',
        admin: '⚙️',
        user: '👤',
        system: '🤖',
        warning: '⚠️',
        error: '❌'
      }
      return icons[type] || '📋'
    },
    clearFilters() {
      this.filter = {
        type: 'all',
        severity: 'all',
        userType: 'all',
        search: ''
      }
    }
  }
}
</script>

<style scoped>
.activity-logs-page {
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

.search-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  width: 300px;
}

.search-input:focus {
  border-color: #27ae60;
}

.btn-export, .btn-clear {
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

.btn-export:hover, .btn-clear:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
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

.logs-container {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
}

.log-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
}

.timeline-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.timeline-item.info {
  border-left: 4px solid #27ae60;
}

.timeline-item.warning {
  border-left: 4px solid #f39c12;
}

.timeline-item.error {
  border-left: 4px solid #e74c3c;
}

.timeline-item.critical {
  border-left: 4px solid #8e44ad;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.5rem;
}

.marker-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8faf7;
  border-radius: 50%;
  border: 2px solid #e8f1e1;
  font-size: 1.2rem;
}

.timeline-content {
  flex: 1;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.log-time {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 600;
}

.log-severity {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.log-severity.info {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.log-severity.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.log-severity.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.log-severity.critical {
  background: #e6e6fa;
  color: #4b0082;
  border: 1px solid #d8bfd8;
}

.log-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.log-action {
  font-weight: 700;
  color: #2c3e50;
}

.log-user {
  font-size: 0.9rem;
  color: #5a6c5a;
}

.log-description {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.log-metadata {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #95a5a6;
  margin-top: 0.5rem;
}

.meta-item {
  background: #ecf0f1;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  border: 1px solid #d5dbdb;
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
  margin: 0 0 1.5rem 0;
  color: #7f8c8d;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .activity-logs-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
    width: 100%;
  }
  
  .search-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .timeline-marker {
    align-self: flex-start;
  }
  
  .log-header {
    width: 100%;
    justify-content: space-between;
  }
  
  .log-metadata {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>