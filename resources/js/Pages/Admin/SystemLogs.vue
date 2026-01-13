<template>
    <div class="system-logs-page">
      <div class="page-header">
        <h1>System Logs</h1>
        <p>Monitor system performance and troubleshoot issues</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <div class="filters">
            <select v-model="filter.logLevel">
              <option value="all">All Levels</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
            <select v-model="filter.component">
              <option value="all">All Components</option>
              <option value="database">Database</option>
              <option value="api">API</option>
              <option value="auth">Authentication</option>
              <option value="payment">Payment</option>
              <option value="email">Email</option>
            </select>
            <select v-model="filter.timeRange">
              <option value="1h">Last 1 Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          <div class="search-actions">
            <input type="text" v-model="filter.search" placeholder="Search logs..." class="search-input" />
            <button class="btn-refresh" @click="refreshLogs">Refresh</button>
            <button class="btn-export">Export</button>
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
            <div class="metric-icon">⚡</div>
            <div class="metric-content">
              <div class="metric-value">{{ systemHealth }}</div>
              <div class="metric-label">System Health</div>
            </div>
          </div>
        </div>
        
        <div class="system-status">
          <h3>System Status</h3>
          <div class="status-grid">
            <div class="status-item" v-for="status in systemStatus" :key="status.name" :class="status.status">
              <div class="status-icon">{{ status.icon }}</div>
              <div class="status-info">
                <div class="status-name">{{ status.name }}</div>
                <div class="status-value">{{ status.value }}</div>
              </div>
              <div class="status-indicator"></div>
            </div>
          </div>
        </div>
        
        <div class="logs-container">
          <div class="log-table">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Level</th>
                  <th>Component</th>
                  <th>Message</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in filteredLogs" :key="log.id" :class="log.level">
                  <td class="log-time">{{ formatTime(log.timestamp) }}</td>
                  <td>
                    <span class="log-level" :class="log.level">{{ log.level }}</span>
                  </td>
                  <td>{{ log.component }}</td>
                  <td class="log-message">{{ log.message }}</td>
                  <td class="log-details">
                    <button class="btn-details" @click="showLogDetails(log)">Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Log Details Modal -->
        <AdminModal
          :isOpen="!!selectedLog"
          title="Log Details"
          submitText="Close"
          @close="selectedLog = null"
          @submit="selectedLog = null"
        >
          <div class="log-details-content">
            <div class="detail-row">
              <span class="label">Timestamp:</span>
              <span class="value">{{ formatTime(selectedLog?.timestamp) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Level:</span>
              <span class="value">{{ selectedLog?.level }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Component:</span>
              <span class="value">{{ selectedLog?.component }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Message:</span>
              <span class="value">{{ selectedLog?.message }}</span>
            </div>
            <div class="detail-row">
              <span class="label">File:</span>
              <span class="value">{{ selectedLog?.file }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Line:</span>
              <span class="value">{{ selectedLog?.line }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Trace:</span>
              <pre class="trace">{{ selectedLog?.trace }}</pre>
            </div>
          </div>
        </AdminModal>
        
        <!-- Empty State -->
        <div class="empty-state" v-if="filteredLogs.length === 0">
          <div class="empty-icon">📋</div>
          <h3>No System Logs</h3>
          <p>No system logs found matching your current filters.</p>
        </div>
      </div>
    </div>
</template>

<script>
import AdminModal from '@/Components/AdminModal.vue'

export default {
  name: 'SystemLogs',
  components: {
    AdminModal
  },
  data() {
    return {
      filter: {
        logLevel: 'all',
        component: 'all',
        timeRange: '24h',
        search: ''
      },
      selectedLog: null,
      logs: [
        {
          id: 1,
          timestamp: '2024-01-15T15:30:00',
          level: 'info',
          component: 'database',
          message: 'Database connection established successfully',
          file: 'database.php',
          line: 45,
          trace: 'Database connection established at 15:30:00'
        },
        {
          id: 2,
          timestamp: '2024-01-15T15:25:00',
          level: 'warning',
          component: 'api',
          message: 'High response time detected for product API',
          file: 'api.php',
          line: 123,
          trace: 'Response time: 2.5s, threshold: 2.0s'
        },
        {
          id: 3,
          timestamp: '2024-01-15T15:20:00',
          level: 'error',
          component: 'payment',
          message: 'Payment gateway timeout',
          file: 'payment.php',
          line: 89,
          trace: 'Gateway timeout after 30 seconds'
        },
        {
          id: 4,
          timestamp: '2024-01-15T15:15:00',
          level: 'critical',
          component: 'auth',
          message: 'Authentication service unavailable',
          file: 'auth.php',
          line: 234,
          trace: 'Service down, fallback to cache enabled'
        },
        {
          id: 5,
          timestamp: '2024-01-15T15:10:00',
          level: 'info',
          component: 'email',
          message: 'Email queue processed successfully',
          file: 'email.php',
          line: 67,
          trace: 'Processed 150 emails in queue'
        },
        {
          id: 6,
          timestamp: '2024-01-15T15:05:00',
          level: 'debug',
          component: 'database',
          message: 'Query optimization applied',
          file: 'database.php',
          line: 156,
          trace: 'Index applied to products table'
        }
      ],
      systemStatus: [
        { name: 'Database', value: 'Connected', status: 'healthy', icon: '🗄️' },
        { name: 'API Server', value: 'Running', status: 'healthy', icon: '🌐' },
        { name: 'Email Service', value: 'Active', status: 'healthy', icon: '📧' },
        { name: 'Payment Gateway', value: 'Degraded', status: 'warning', icon: '💳' },
        { name: 'Cache', value: 'Optimal', status: 'healthy', icon: '⚡' },
        { name: 'Storage', value: 'Available', status: 'healthy', icon: '💾' }
      ]
    }
  },
  computed: {
    filteredLogs() {
      let filtered = this.logs
      
      // Filter by log level
      if (this.filter.logLevel !== 'all') {
        filtered = filtered.filter(log => log.level === this.filter.logLevel)
      }
      
      // Filter by component
      if (this.filter.component !== 'all') {
        filtered = filtered.filter(log => log.component === this.filter.component)
      }
      
      // Filter by time range
      const now = new Date()
      let timeLimit = new Date()
      
      switch (this.filter.timeRange) {
        case '1h':
          timeLimit = new Date(now.getTime() - 60 * 60 * 1000)
          break
        case '6h':
          timeLimit = new Date(now.getTime() - 6 * 60 * 60 * 1000)
          break
        case '24h':
          timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case '7d':
          timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          timeLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= timeLimit)
      
      // Filter by search
      if (this.filter.search) {
        const query = this.filter.search.toLowerCase()
        filtered = filtered.filter(log => 
          log.message.toLowerCase().includes(query) ||
          log.component.toLowerCase().includes(query) ||
          log.file.toLowerCase().includes(query)
        )
      }
      
      return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    },
    totalLogs() {
      return this.filteredLogs.length
    },
    warningCount() {
      return this.filteredLogs.filter(log => log.level === 'warning').length
    },
    errorCount() {
      return this.filteredLogs.filter(log => log.level === 'error').length + 
             this.filteredLogs.filter(log => log.level === 'critical').length
    },
    systemHealth() {
      const healthyCount = this.systemStatus.filter(s => s.status === 'healthy').length
      const total = this.systemStatus.length
      return `${healthyCount}/${total} Services Healthy`
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
    refreshLogs() {
      // Simulate log refresh
      console.log('Refreshing logs...')
    },
    showLogDetails(log) {
      this.selectedLog = log
    }
  }
}
</script>

<style scoped>
.system-logs-page {
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

.btn-refresh, .btn-export {
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

.btn-refresh:hover, .btn-export:hover {
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

.system-status {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.system-status h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.status-item {
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.status-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.status-item.healthy {
  border-left: 4px solid #27ae60;
}

.status-item.warning {
  border-left: 4px solid #f39c12;
}

.status-item.error {
  border-left: 4px solid #e74c3c;
}

.status-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8faf7;
  border-radius: 50%;
  border: 2px solid #e8f1e1;
}

.status-info {
  flex: 1;
}

.status-name {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.status-value {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #27ae60;
  box-shadow: 0 0 10px #27ae60;
  animation: pulse 2s infinite;
}

.status-item.warning .status-indicator {
  background: #f39c12;
  box-shadow: 0 0 10px #f39c12;
}

.status-item.error .status-indicator {
  background: #e74c3c;
  box-shadow: 0 0 10px #e74c3c;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(39, 174, 96, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(39, 174, 96, 0);
  }
}

.logs-container {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
}

.log-table {
  overflow-x: auto;
}

.log-table table {
  width: 100%;
  border-collapse: collapse;
}

.log-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
  position: sticky;
  top: 0;
  z-index: 1;
}

.log-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
  font-size: 0.9rem;
}

.log-table tr:hover {
  background: #f8faf7;
}

.log-table tr.debug:hover {
  background: #e8f5e9;
}

.log-table tr.info:hover {
  background: #e3f2fd;
}

.log-table tr.warning:hover {
  background: #fff3cd;
}

.log-table tr.error:hover {
  background: #f8d7da;
}

.log-table tr.critical:hover {
  background: #f3e5f5;
}

.log-time {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #7f8c8d;
}

.log-level {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.log-level.debug {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.log-level.info {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.log-level.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.log-level.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.log-level.critical {
  background: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #e1bee7;
}

.log-message {
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.log-details {
  text-align: center;
}

.btn-details {
  background: #eafaf1;
  color: #27ae60;
  border: 1px solid #c3e6cb;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-details:hover {
  background: #d4edda;
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

/* Log Details Modal Styles */
.log-details-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 8px;
}

.detail-row .label {
  font-weight: 700;
  color: #2c3e50;
  min-width: 120px;
}

.detail-row .value {
  color: #5a6c5a;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
}

.trace {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #495057;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
  overflow-y: auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .system-logs-page {
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
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .log-table th, .log-table td {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
  
  .log-message {
    max-width: 200px;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .detail-row .label {
    min-width: auto;
  }
  
  .detail-row .value {
    text-align: left;
    margin-left: 0;
  }
}
</style>