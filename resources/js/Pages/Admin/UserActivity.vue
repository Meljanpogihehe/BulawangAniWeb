<template>
    <div class="user-activity-page">
      <div class="page-header">
        <h1>User Activity Reports</h1>
        <p>Monitor user behavior and platform engagement</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <div class="filters">
            <select v-model="timePeriod">
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 365 Days</option>
            </select>
            <select v-model="userType">
              <option value="all">All Users</option>
              <option value="buyers">Buyers</option>
              <option value="sellers">Sellers</option>
              <option value="admins">Admins</option>
            </select>
          </div>
          <div class="search-box">
            <input type="text" placeholder="Search user activity..." />
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">👥</div>
            <div class="metric-content">
              <div class="metric-value">{{ activeUsers }}</div>
              <div class="metric-label">Active Users</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">👁️</div>
            <div class="metric-content">
              <div class="metric-value">{{ pageViews }}</div>
              <div class="metric-label">Page Views</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🛒</div>
            <div class="metric-content">
              <div class="metric-value">{{ totalOrders }}</div>
              <div class="metric-label">Total Orders</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">⏱️</div>
            <div class="metric-content">
              <div class="metric-value">{{ avgSessionTime }}</div>
              <div class="metric-label">Avg Session</div>
            </div>
          </div>
        </div>
        
        <div class="charts-section">
          <div class="chart-card">
            <h3>User Activity Timeline</h3>
            <div class="timeline-chart">
              <div class="timeline-item" v-for="activity in activities" :key="activity.time">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-time">{{ activity.time }}</div>
                  <div class="timeline-event">{{ activity.event }}</div>
                  <div class="timeline-user">{{ activity.user }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chart-card">
            <h3>Activity by User Type</h3>
            <div class="user-type-chart">
              <div class="chart-bar" v-for="type in userTypes" :key="type.name" :style="{ height: type.percentage + '%' }">
                <span class="bar-label">{{ type.name }}</span>
                <span class="bar-value">{{ type.count }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="table-container">
          <table class="activity-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
                <th>Time</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in activityLogs" :key="log.id">
                <td>
                  <div class="user-info">
                    <div class="user-name">{{ log.user }}</div>
                    <div class="user-type">{{ log.userType }}</div>
                  </div>
                </td>
                <td>
                  <span :class="['action-badge', log.action.toLowerCase()]">
                    {{ log.action }}
                  </span>
                </td>
                <td>{{ log.details }}</td>
                <td>{{ formatTime(log.time) }}</td>
                <td>{{ log.ipAddress }}</td>
                <td>
                  <span :class="['status-badge', log.status.toLowerCase()]">
                    {{ log.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'UserActivity',
  data() {
    return {
      timePeriod: 'week',
      userType: 'all',
      activeUsers: 1250,
      pageViews: 8500,
      totalOrders: 320,
      avgSessionTime: '8m 45s',
      activities: [
        { time: '15:30', event: 'User login', user: 'john@example.com' },
        { time: '15:25', event: 'Product viewed', user: 'jane@example.com' },
        { time: '15:20', event: 'Order placed', user: 'bob@example.com' },
        { time: '15:15', event: 'Seller registration', user: 'seller@example.com' },
        { time: '15:10', event: 'Admin action', user: 'admin@example.com' }
      ],
      userTypes: [
        { name: 'Buyers', count: 850, percentage: 68 },
        { name: 'Sellers', count: 300, percentage: 24 },
        { name: 'Admins', count: 100, percentage: 8 }
      ],
      activityLogs: [
        { id: 1, user: 'John Doe', userType: 'Buyer', action: 'Login', details: 'Successful login from web', time: '2024-01-15 15:30:00', ipAddress: '192.168.1.100', status: 'Success' },
        { id: 2, user: 'Jane Smith', userType: 'Buyer', action: 'View Product', details: 'Viewed Premium Dinorado Rice', time: '2024-01-15 15:25:00', ipAddress: '192.168.1.101', status: 'Success' },
        { id: 3, user: 'Bob Wilson', userType: 'Buyer', action: 'Order', details: 'Placed order #1001', time: '2024-01-15 15:20:00', ipAddress: '192.168.1.102', status: 'Success' },
        { id: 4, user: 'Maria Santos', userType: 'Seller', action: 'Registration', details: 'New seller registration', time: '2024-01-15 15:15:00', ipAddress: '192.168.1.103', status: 'Success' },
        { id: 5, user: 'Admin User', userType: 'Admin', action: 'Update', details: 'Updated product price', time: '2024-01-15 15:10:00', ipAddress: '192.168.1.1', status: 'Success' }
      ]
    }
  },
  watch: {
    timePeriod(newPeriod) {
      console.log('Time period changed to:', newPeriod)
    },
    userType(newType) {
      console.log('User type filter changed to:', newType)
    }
  },
  methods: {
    formatTime(timeString) {
      const date = new Date(timeString)
      return date.toLocaleString('en-PH', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.user-activity-page {
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

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
}

.chart-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.timeline-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.timeline-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #27ae60;
  border: 2px solid #2ecc71;
  margin-top: 4px;
  flex-shrink: 0;
}

.timeline-content {
  background: white;
  border: 1px solid #e8f1e1;
  border-radius: 8px;
  padding: 0.75rem;
  flex-grow: 1;
}

.timeline-time {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
}

.timeline-event {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.timeline-user {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.user-type-chart {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  height: 150px;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8f1e1;
}

.chart-bar {
  flex-grow: 1;
  background: linear-gradient(to top, #27ae60, #2ecc71);
  border-radius: 4px 4px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  color: white;
  font-weight: 700;
  position: relative;
}

.bar-label {
  font-size: 0.7rem;
  text-align: center;
}

.bar-value {
  font-size: 0.9rem;
  font-weight: 800;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 2px solid #e8f1e1;
  background: #f8faf7;
}

.activity-table td {
  padding: 1rem;
  border-bottom: 1px solid #e8f1e1;
  color: #5a6c5a;
  vertical-align: middle;
}

.activity-table tr:hover {
  background: #f8faf7;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.user-type {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.action-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.action-badge.login {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.action-badge.view {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.action-badge.order {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.action-badge.registration {
  background: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #e1bee7;
}

.action-badge.update {
  background: #e0f2f1;
  color: #00695c;
  border: 1px solid #b2dfdb;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .user-activity-page {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .activity-table {
    font-size: 0.9rem;
  }
  
  .activity-table th, .activity-table td {
    padding: 0.75rem;
  }
  
  .user-type-chart {
    flex-direction: column;
    height: auto;
    gap: 0.5rem;
  }
  
  .chart-bar {
    height: 20px;
    border-radius: 4px;
    padding: 0;
    justify-content: flex-start;
  }
  
  .bar-label {
    margin-right: auto;
  }
  
  .bar-value {
    margin-left: auto;
  }
}
</style>