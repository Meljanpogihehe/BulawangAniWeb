<template>
  <div class="customer-messages">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Customer Messages</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="exportMessages">
          <i class="fas fa-download"></i> Export
        </button>
        <button class="btn-primary" @click="createTemplate">
          <i class="fas fa-plus"></i> Create Template
        </button>
      </div>
    </div>

    <!-- Stats Banner -->
    <div class="stats-banner">
      <div class="stat-item">
        <span class="stat-label">Total Messages:</span>
        <span class="stat-value">{{ totalMessages }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Unread:</span>
        <span class="stat-value warning">{{ unreadMessages }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Response Rate:</span>
        <span class="stat-value">{{ responseRate }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Avg Response Time:</span>
        <span class="stat-value">{{ avgResponseTime }} hours</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <select v-model="selectedStatus" class="filter-select" @change="filterMessages">
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
        
        <select v-model="selectedType" class="filter-select" @change="filterMessages">
          <option value="all">All Types</option>
          <option value="question">Question</option>
          <option value="complaint">Complaint</option>
          <option value="feedback">Feedback</option>
          <option value="order">Order Inquiry</option>
        </select>
        
        <select v-model="selectedSort" class="filter-select" @change="sortMessages">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="unread">Unread First</option>
        </select>
      </div>
      
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search messages..." 
          class="search-input"
          @input="searchMessages"
        >
        <i class="fas fa-search search-icon"></i>
      </div>
    </div>

    <!-- Messages List -->
    <div class="messages-section">
      <div class="messages-grid">
        <!-- Message List -->
        <div class="message-list">
          <div v-if="filteredMessages.length === 0" class="empty-state">
            <i class="fas fa-comments"></i>
            <h3>No messages found</h3>
            <p>No customer messages match your current filters.</p>
          </div>

          <div 
            v-for="message in paginatedMessages" 
            :key="message.id" 
            class="message-card"
            :class="{ unread: !message.read, replied: message.replied }"
            @click="selectMessage(message)"
          >
            <div class="message-header">
              <div class="customer-info">
                <div class="customer-avatar">
                  {{ getInitials(message.customer.name) }}
                </div>
                <div class="customer-details">
                  <div class="customer-name">{{ message.customer.name }}</div>
                  <div class="customer-order">Order #{{ message.orderId }}</div>
                </div>
              </div>
              <div class="message-meta">
                <span class="message-time">{{ formatTime(message.date) }}</span>
                <span class="message-type" :class="message.type">{{ message.type }}</span>
              </div>
            </div>
            
            <div class="message-preview">
              <div class="message-subject">{{ message.subject }}</div>
              <div class="message-content">{{ truncateText(message.content, 100) }}</div>
            </div>
            
            <div class="message-actions">
              <button class="btn-reply" @click.stop="replyToMessage(message)">
                <i class="fas fa-reply"></i> Reply
              </button>
              <button class="btn-mark" @click.stop="toggleRead(message)">
                <i class="fas" :class="message.read ? 'fa-envelope-open' : 'fa-envelope'"></i>
                {{ message.read ? 'Mark Unread' : 'Mark Read' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Message Details -->
        <div v-if="selectedMessage" class="message-details">
          <div class="message-detail-header">
            <div class="message-detail-info">
              <div class="customer-avatar large">
                {{ getInitials(selectedMessage.customer.name) }}
              </div>
              <div class="customer-info">
                <div class="customer-name">{{ selectedMessage.customer.name }}</div>
                <div class="customer-contact">{{ selectedMessage.customer.email }}</div>
                <div class="customer-order">Order #{{ selectedMessage.orderId }}</div>
              </div>
            </div>
            <div class="message-detail-meta">
              <span class="message-date">{{ formatDate(selectedMessage.date) }}</span>
              <span class="message-time">{{ formatTime(selectedMessage.date) }}</span>
              <span class="message-type" :class="selectedMessage.type">{{ selectedMessage.type }}</span>
            </div>
          </div>

          <div class="message-content">
            <h3>{{ selectedMessage.subject }}</h3>
            <p>{{ selectedMessage.content }}</p>
          </div>

          <!-- Reply Section -->
          <div class="reply-section">
            <h4>Reply to Customer</h4>
            <div class="reply-form">
              <textarea 
                v-model="replyMessage"
                placeholder="Type your response here..."
                class="reply-textarea"
              ></textarea>
              <div class="reply-actions">
                <select v-model="selectedTemplate" class="template-select">
                  <option value="">Quick Templates</option>
                  <option v-for="template in messageTemplates" :key="template.id" :value="template.content">
                    {{ template.name }}
                  </option>
                </select>
                <div class="reply-buttons">
                  <button class="btn-secondary" @click="sendReply">
                    <i class="fas fa-paper-plane"></i> Send Reply
                  </button>
                  <button class="btn-outline" @click="saveDraft">
                    <i class="fas fa-save"></i> Save Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Selection Message -->
        <div v-else class="no-selection">
          <i class="fas fa-inbox"></i>
          <h3>Select a message</h3>
          <p>Click on a message from the list to view and reply.</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="pagination-btn" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      <div class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <button 
        class="pagination-btn" 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <div class="action-card" @click="bulkMarkRead">
          <div class="action-icon">
            <i class="fas fa-envelope-open"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Mark All Read</div>
            <div class="action-subtitle">{{ unreadMessages }} unread messages</div>
          </div>
        </div>

        <div class="action-card" @click="sendBroadcast">
          <div class="action-icon">
            <i class="fas fa-bullhorn"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Broadcast Message</div>
            <div class="action-subtitle">Send to all customers</div>
          </div>
        </div>

        <div class="action-card" @click="viewAnalytics">
          <div class="action-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="action-content">
            <div class="action-title">Message Analytics</div>
            <div class="action-subtitle">Response time & satisfaction</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Templates Modal -->
    <div v-if="showTemplateModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Message Templates</h3>
          <button class="btn-close" @click="closeTemplateModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="template-list">
            <div v-for="template in messageTemplates" :key="template.id" class="template-item">
              <div class="template-header">
                <h4>{{ template.name }}</h4>
                <div class="template-actions">
                  <button class="btn-edit" @click="editTemplate(template)">
                    <i class="fas fa-edit"></i> Edit
                  </button>
                  <button class="btn-delete" @click="deleteTemplate(template.id)">
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
              <div class="template-content">{{ template.content }}</div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeTemplateModal">Close</button>
          <button class="btn-primary" @click="addNewTemplate">Add Template</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'CustomerMessages',
  setup() {
    const searchQuery = ref('')
    const selectedStatus = ref('all')
    const selectedType = ref('all')
    const selectedSort = ref('newest')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const selectedMessage = ref(null)
    const replyMessage = ref('')
    const selectedTemplate = ref('')
    const showTemplateModal = ref(false)

    // Mock message data
    const messages = ref([
      {
        id: 1,
        customer: {
          name: 'Maria Santos',
          email: 'maria.santos@example.com'
        },
        orderId: 'ORD-2024-001',
        subject: 'Product Quality Question',
        content: 'Hi, I received my order today and I have a question about the quality of the handwoven bag. The stitching seems a bit loose in some areas. Is this normal for handmade products?',
        type: 'question',
        date: '2024-01-15T10:30:00',
        read: false,
        replied: false
      },
      {
        id: 2,
        customer: {
          name: 'Juan Dela Cruz',
          email: 'juan.delacruz@example.com'
        },
        orderId: 'ORD-2024-002',
        subject: 'Shipping Delay',
        content: 'Hello, I placed an order 5 days ago and I havent received any shipping updates. Can you please check the status of my order? I need it by next week.',
        type: 'order',
        date: '2024-01-14T14:20:00',
        read: false,
        replied: true
      },
      {
        id: 3,
        customer: {
          name: 'Ana Reyes',
          email: 'ana.reyes@example.com'
        },
        orderId: 'ORD-2024-003',
        subject: 'Excellent Service!',
        content: 'I just wanted to say thank you for the excellent service and beautiful products. The traditional weaving set I ordered is absolutely stunning and was delivered faster than expected. Will definitely order again!',
        type: 'feedback',
        date: '2024-01-13T16:45:00',
        read: true,
        replied: true
      },
      {
        id: 4,
        customer: {
          name: 'Pedro Gomez',
          email: 'pedro.gomez@example.com'
        },
        orderId: 'ORD-2024-004',
        subject: 'Wrong Item Received',
        content: 'I received the wrong item in my order. I ordered the bamboo home decor set but received a pottery set instead. Please advise on how to return this and get the correct item.',
        type: 'complaint',
        date: '2024-01-12T09:15:00',
        read: false,
        replied: false
      },
      {
        id: 5,
        customer: {
          name: 'Liza Cruz',
          email: 'liza.cruz@example.com'
        },
        orderId: 'ORD-2024-005',
        subject: 'Custom Order Inquiry',
        content: 'Hi, I love your handmade products and was wondering if you accept custom orders. I would like to order a custom-sized abaca bag in a different color. Is this possible?',
        type: 'question',
        date: '2024-01-11T11:30:00',
        read: true,
        replied: false
      }
    ])

    const messageTemplates = ref([
      {
        id: 1,
        name: 'Thank You Response',
        content: 'Thank you for your message! We appreciate your feedback and will get back to you shortly.'
      },
      {
        id: 2,
        name: 'Shipping Update',
        content: 'Thank you for your patience. Your order is currently being processed and will be shipped within 1-2 business days. We will send you tracking information once it ships.'
      },
      {
        id: 3,
        name: 'Product Quality',
        content: 'Thank you for bringing this to our attention. All our products are handmade, so minor variations are normal. However, if you notice any significant quality issues, please let us know and we will be happy to assist you.'
      },
      {
        id: 4,
        name: 'Custom Order',
        content: 'Thank you for your interest in custom orders! We do accept custom requests. Please let us know your specific requirements including size, color, and any other details, and we will provide you with a quote.'
      }
    ])

    const filteredMessages = computed(() => {
      let filtered = messages.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(message => 
          message.subject.toLowerCase().includes(query) ||
          message.content.toLowerCase().includes(query) ||
          message.customer.name.toLowerCase().includes(query) ||
          message.orderId.toLowerCase().includes(query)
        )
      }

      // Status filter
      if (selectedStatus.value !== 'all') {
        switch (selectedStatus.value) {
          case 'unread':
            filtered = filtered.filter(message => !message.read)
            break
          case 'read':
            filtered = filtered.filter(message => message.read)
            break
          case 'replied':
            filtered = filtered.filter(message => message.replied)
            break
        }
      }

      // Type filter
      if (selectedType.value !== 'all') {
        filtered = filtered.filter(message => message.type === selectedType.value)
      }

      // Sort
      filtered.sort((a, b) => {
        switch (selectedSort.value) {
          case 'newest':
            return new Date(b.date) - new Date(a.date)
          case 'oldest':
            return new Date(a.date) - new Date(b.date)
          case 'unread':
            if (a.read === b.read) {
              return new Date(b.date) - new Date(a.date)
            }
            return a.read ? 1 : -1
          default:
            return 0
        }
      })

      return filtered
    })

    const paginatedMessages = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredMessages.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredMessages.value.length / itemsPerPage)
    })

    const totalMessages = computed(() => messages.value.length)
    const unreadMessages = computed(() => {
      return messages.value.filter(m => !m.read).length
    })
    const responseRate = computed(() => {
      const total = messages.value.length
      const replied = messages.value.filter(m => m.replied).length
      return total > 0 ? Math.round((replied / total) * 100) : 0
    })
    const avgResponseTime = computed(() => 24) // Mock data

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(amount)
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getInitials = (name) => {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text
      return text.slice(0, maxLength) + '...'
    }

    const filterMessages = () => {
      currentPage.value = 1
    }

    const searchMessages = () => {
      currentPage.value = 1
    }

    const sortMessages = () => {
      // Sorting is handled in computed property
    }

    const changePage = (page) => {
      currentPage.value = page
    }

    const selectMessage = (message) => {
      selectedMessage.value = message
      if (!message.read) {
        message.read = true
      }
    }

    const replyToMessage = (message) => {
      selectedMessage.value = message
      replyMessage.value = ''
    }

    const toggleRead = (message) => {
      message.read = !message.read
    }

    const sendReply = () => {
      if (selectedMessage.value && replyMessage.value.trim()) {
        selectedMessage.value.replied = true
        alert(`Reply sent to ${selectedMessage.value.customer.name}!`)
        replyMessage.value = ''
      }
    }

    const saveDraft = () => {
      if (replyMessage.value.trim()) {
        alert('Draft saved successfully!')
      }
    }

    const exportMessages = () => {
      alert('Exporting messages...')
    }

    const createTemplate = () => {
      showTemplateModal.value = true
    }

    const closeTemplateModal = () => {
      showTemplateModal.value = false
    }

    const editTemplate = (template) => {
      alert(`Editing template: ${template.name}`)
    }

    const deleteTemplate = (templateId) => {
      if (confirm('Are you sure you want to delete this template?')) {
        const index = messageTemplates.value.findIndex(t => t.id === templateId)
        if (index > -1) {
          messageTemplates.value.splice(index, 1)
        }
      }
    }

    const addNewTemplate = () => {
      alert('Adding new template...')
    }

    const bulkMarkRead = () => {
      messages.value.forEach(message => {
        message.read = true
      })
      alert(`Marked ${unreadMessages.value} messages as read!`)
    }

    const sendBroadcast = () => {
      alert('Sending broadcast message...')
    }

    const viewAnalytics = () => {
      alert('Viewing message analytics...')
    }

    return {
      searchQuery,
      selectedStatus,
      selectedType,
      selectedSort,
      currentPage,
      selectedMessage,
      replyMessage,
      selectedTemplate,
      showTemplateModal,
      messages,
      messageTemplates,
      filteredMessages,
      paginatedMessages,
      totalPages,
      totalMessages,
      unreadMessages,
      responseRate,
      avgResponseTime,
      formatCurrency,
      formatDate,
      formatTime,
      getInitials,
      truncateText,
      filterMessages,
      searchMessages,
      sortMessages,
      changePage,
      selectMessage,
      replyToMessage,
      toggleRead,
      sendReply,
      saveDraft,
      exportMessages,
      createTemplate,
      closeTemplateModal,
      editTemplate,
      deleteTemplate,
      addNewTemplate,
      bulkMarkRead,
      sendBroadcast,
      viewAnalytics
    }
  }
}
</script>

<style scoped>
.customer-messages {
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

.stats-banner {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-value.warning {
  color: #f59e0b;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.messages-section {
  margin-bottom: 3rem;
}

.messages-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.message-list {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  max-height: 600px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #9ca3af;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.message-card {
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s;
}

.message-card:hover {
  background-color: #f9fafb;
}

.message-card.unread {
  background-color: #f0f9ff;
  border-left: 4px solid #3b82f6;
}

.message-card.replied {
  border-left: 4px solid #10b981;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.customer-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.customer-avatar.large {
  width: 60px;
  height: 60px;
  font-size: 1.25rem;
}

.customer-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.customer-name {
  font-weight: 600;
  color: #1f2937;
}

.customer-order {
  font-size: 0.75rem;
  color: #6b7280;
}

.message-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.message-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.message-type {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
}

.message-type.question {
  background-color: #dbeafe;
  color: #1e40af;
}

.message-type.complaint {
  background-color: #fee2e2;
  color: #991b1b;
}

.message-type.feedback {
  background-color: #d1fae5;
  color: #065f46;
}

.message-type.order {
  background-color: #fef3c7;
  color: #92400e;
}

.message-preview {
  margin-bottom: 1rem;
}

.message-subject {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.message-content {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.message-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-reply,
.btn-mark {
  background-color: #6b7280;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-reply:hover {
  background-color: #4b5563;
}

.btn-mark:hover {
  background-color: #4b5563;
}

.message-details {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 2rem;
  max-height: 600px;
  overflow-y: auto;
}

.message-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.message-detail-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.customer-contact {
  font-size: 0.875rem;
  color: #6b7280;
}

.message-detail-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.message-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.message-content h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.message-content p {
  margin: 0;
  color: #374151;
  line-height: 1.6;
}

.reply-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f3f4f6;
}

.reply-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.reply-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reply-textarea {
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s;
}

.reply-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.reply-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  width: 300px;
}

.reply-buttons {
  display: flex;
  gap: 1rem;
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

.no-selection {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

.no-selection i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #9ca3af;
}

.no-selection h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #f3f4f6;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.quick-actions h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 50px;
  height: 50px;
  background: #f3f4f6;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1.25rem;
}

.action-content {
  flex: 1;
}

.action-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.action-subtitle {
  font-size: 0.875rem;
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

.template-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.template-item {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.template-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.template-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  background: none;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn-delete:hover {
  background-color: #fee2e2;
  border-color: #fecaca;
  color: #991b1b;
}

.template-content {
  font-size: 0.875rem;
  color: #374151;
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
  .filters-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-container {
    width: 100%;
  }
  
  .messages-grid {
    grid-template-columns: 1fr;
  }
  
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .message-detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .reply-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .template-select {
    width: 100%;
  }
}
</style>