<template>
    <div class="announcements-page">
      <div class="page-header">
        <h1>Announcements</h1>
        <p>Create and manage platform announcements and notifications</p>
      </div>
      
      <div class="page-content">
        <div class="controls">
          <button class="btn-primary" @click="showCreateForm = !showCreateForm">
            {{ showCreateForm ? 'Cancel' : 'Create Announcement' }}
          </button>
          <div class="search-box">
            <input type="text" placeholder="Search announcements..." v-model="searchQuery" />
          </div>
        </div>
        
        <!-- Create Announcement Form -->
        <div class="create-form" v-if="showCreateForm">
          <h3>Create New Announcement</h3>
          <form @submit.prevent="createAnnouncement" class="announcement-form">
            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="newAnnouncement.title" placeholder="Enter announcement title" required />
            </div>
            <div class="form-group">
              <label>Content</label>
              <textarea v-model="newAnnouncement.content" placeholder="Enter announcement content" rows="4" required></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Type</label>
                <select v-model="newAnnouncement.type" required>
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div class="form-group">
                <label>Priority</label>
                <select v-model="newAnnouncement.priority" required>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Start Date</label>
                <input type="date" v-model="newAnnouncement.startDate" required />
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input type="date" v-model="newAnnouncement.endDate" required />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-submit">Create Announcement</button>
              <button type="button" @click="showCreateForm = false" class="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
        
        <!-- Announcements List -->
        <div class="announcements-list">
          <div class="announcement-card" v-for="announcement in filteredAnnouncements" :key="announcement.id">
            <div class="announcement-header">
              <div class="announcement-type" :class="announcement.type">
                {{ getTypeLabel(announcement.type) }}
              </div>
              <div class="announcement-priority" :class="announcement.priority">
                {{ announcement.priority.toUpperCase() }}
              </div>
              <div class="announcement-date">
                {{ formatDate(announcement.startDate) }} - {{ formatDate(announcement.endDate) }}
              </div>
            </div>
            <div class="announcement-content">
              <h4>{{ announcement.title }}</h4>
              <p>{{ announcement.content }}</p>
            </div>
            <div class="announcement-actions">
              <button class="btn-edit" @click="editAnnouncement(announcement)">Edit</button>
              <button class="btn-delete" @click="deleteAnnouncement(announcement.id)">Delete</button>
              <button class="btn-preview">Preview</button>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div class="empty-state" v-if="filteredAnnouncements.length === 0">
          <div class="empty-icon">📢</div>
          <h3>No Announcements</h3>
          <p>Create your first announcement to inform users about important updates.</p>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Announcements',
  data() {
    return {
      showCreateForm: false,
      searchQuery: '',
      newAnnouncement: {
        title: '',
        content: '',
        type: 'info',
        priority: 'medium',
        startDate: '',
        endDate: ''
      },
      announcements: [
        {
          id: 1,
          title: 'New Payment Methods Available',
          content: 'We are excited to announce that GCash and PayMaya are now available as payment options for your convenience.',
          type: 'success',
          priority: 'high',
          startDate: '2024-01-15',
          endDate: '2024-02-15'
        },
        {
          id: 2,
          title: 'Scheduled Maintenance',
          content: 'Our platform will undergo scheduled maintenance on January 20th from 10:00 PM to 12:00 AM. During this time, some features may be temporarily unavailable.',
          type: 'warning',
          priority: 'medium',
          startDate: '2024-01-20',
          endDate: '2024-01-20'
        },
        {
          id: 3,
          title: 'Farmers Market Weekend Sale',
          content: 'Join us this weekend for our special Farmers Market Sale! Enjoy discounts of up to 20% on selected fresh produce and organic products.',
          type: 'info',
          priority: 'low',
          startDate: '2024-01-18',
          endDate: '2024-01-21'
        }
      ]
    }
  },
  computed: {
    filteredAnnouncements() {
      if (!this.searchQuery) {
        return this.announcements
      }
      const query = this.searchQuery.toLowerCase()
      return this.announcements.filter(announcement => 
        announcement.title.toLowerCase().includes(query) ||
        announcement.content.toLowerCase().includes(query) ||
        announcement.type.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    getTypeLabel(type) {
      const labels = {
        info: 'Information',
        warning: 'Warning',
        success: 'Success',
        urgent: 'Urgent'
      }
      return labels[type] || type
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    createAnnouncement() {
      const announcement = {
        id: Date.now(),
        ...this.newAnnouncement
      }
      this.announcements.unshift(announcement)
      this.resetForm()
      this.showCreateForm = false
    },
    editAnnouncement(announcement) {
      // Implement edit functionality
      console.log('Editing announcement:', announcement)
    },
    deleteAnnouncement(id) {
      this.announcements = this.announcements.filter(a => a.id !== id)
    },
    resetForm() {
      this.newAnnouncement = {
        title: '',
        content: '',
        type: 'info',
        priority: 'medium',
        startDate: '',
        endDate: ''
      }
    }
  }
}
</script>

<style scoped>
.announcements-page {
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

.announcement-form {
  display: grid;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.announcements-list {
  display: grid;
  gap: 1.5rem;
}

.announcement-card {
  background: #f8faf7;
  border: 1px solid #e8f1e1;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.announcement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.announcement-type {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.announcement-type.info {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.announcement-type.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.announcement-type.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.announcement-type.urgent {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.announcement-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.announcement-priority.low {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.announcement-priority.medium {
  background: #fff3e0;
  color: #ef6c00;
  border: 1px solid #ffcc02;
}

.announcement-priority.high {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ef5350;
}

.announcement-date {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 600;
}

.announcement-content h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.announcement-content p {
  margin: 0;
  color: #5a6c5a;
  line-height: 1.6;
}

.announcement-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-edit, .btn-delete, .btn-preview {
  padding: 0.5rem 1rem;
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
  .announcements-page {
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
  
  .announcement-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .announcement-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>