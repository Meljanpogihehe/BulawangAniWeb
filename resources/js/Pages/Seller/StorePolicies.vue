<template>
    <div class="store-policies">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Store Policies</h1>
        <div class="header-actions">
          <button class="btn-secondary" @click="previewPolicies">
            <i class="fas fa-eye"></i> Preview
          </button>
          <button class="btn-primary" @click="savePolicies">
            <i class="fas fa-save"></i> Save Changes
          </button>
        </div>
      </div>

      <!-- Policy Overview -->
      <div class="policy-overview">
        <div class="overview-grid">
          <div class="overview-card">
            <div class="card-icon">
              <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Total Policies</div>
              <div class="card-value">{{ policies.length }}</div>
            </div>
          </div>

          <div class="overview-card">
            <div class="card-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Last Updated</div>
              <div class="card-value">{{ lastUpdated }}</div>
            </div>
          </div>

          <div class="overview-card">
            <div class="card-icon">
              <i class="fas fa-eye"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Customer Views</div>
              <div class="card-value">{{ formatNumber(totalViews) }}</div>
            </div>
          </div>

          <div class="overview-card">
            <div class="card-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Compliance</div>
              <div class="card-value">{{ complianceScore }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Policy Categories -->
      <div class="policy-categories">
        <div class="category-list">
          <div 
            v-for="category in policyCategories" 
            :key="category.id" 
            class="category-card"
            :class="{ active: activeCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            <div class="category-icon">
              <i :class="category.icon"></i>
            </div>
            <div class="category-info">
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
            </div>
            <div class="category-status">
              <span :class="['status-badge', category.status]">{{ category.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Policy Editor -->
      <div class="policy-editor">
        <div class="editor-header">
          <h2>{{ getActiveCategoryName() }} Policy</h2>
          <div class="editor-actions">
            <button class="btn-secondary" @click="resetToDefault">
              <i class="fas fa-undo"></i> Reset to Default
            </button>
            <button class="btn-outline" @click="previewPolicy">
              <i class="fas fa-eye"></i> Preview
            </button>
          </div>
        </div>

        <div class="policy-form">
          <div class="form-group">
            <label for="policy-title">Policy Title</label>
            <input 
              id="policy-title"
              v-model="currentPolicy.title"
              type="text"
              class="form-input"
              placeholder="Enter policy title"
            >
          </div>

          <div class="form-group">
            <label for="policy-summary">Policy Summary</label>
            <textarea 
              id="policy-summary"
              v-model="currentPolicy.summary"
              class="form-textarea"
              rows="3"
              placeholder="Brief summary of this policy..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="policy-content">Policy Content</label>
            <div class="editor-toolbar">
              <button class="toolbar-btn" @click="insertText('**', '**')">
                <i class="fas fa-bold"></i> Bold
              </button>
              <button class="toolbar-btn" @click="insertText('*', '*')">
                <i class="fas fa-italic"></i> Italic
              </button>
              <button class="toolbar-btn" @click="insertText('### ', '')">
                <i class="fas fa-heading"></i> Heading
              </button>
              <button class="toolbar-btn" @click="insertText('- ', '')">
                <i class="fas fa-list-ul"></i> List
              </button>
              <button class="toolbar-btn" @click="insertText('\n\n', '')">
                <i class="fas fa-paragraph"></i> Paragraph
              </button>
            </div>
            <textarea 
              id="policy-content"
              v-model="currentPolicy.content"
              class="form-textarea editor"
              rows="15"
              placeholder="Write your policy content here..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="policy-effective">Effective Date</label>
            <input 
              id="policy-effective"
              v-model="currentPolicy.effectiveDate"
              type="date"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="currentPolicy.published">
              <span class="checkbox-text">Publish this policy</span>
            </label>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="currentPolicy.customerAgreement">
              <span class="checkbox-text">Require customer agreement</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Policy Templates -->
      <div class="policy-templates">
        <h2>Policy Templates</h2>
        <div class="templates-grid">
          <div 
            v-for="template in policyTemplates" 
            :key="template.id" 
            class="template-card"
          >
            <div class="template-header">
              <h3>{{ template.name }}</h3>
              <span class="template-category">{{ template.category }}</span>
            </div>
            <div class="template-content">
              <p>{{ template.description }}</p>
            </div>
            <div class="template-actions">
              <button class="btn-outline" @click="applyTemplate(template)">
                <i class="fas fa-copy"></i> Use Template
              </button>
              <button class="btn-secondary" @click="previewTemplate(template)">
                <i class="fas fa-eye"></i> Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Policy Compliance -->
      <div class="compliance-section">
        <h2>Policy Compliance</h2>
        <div class="compliance-grid">
          <div class="compliance-card">
            <div class="compliance-header">
              <h3>Legal Requirements</h3>
              <span class="compliance-score">{{ legalCompliance }}%</span>
            </div>
            <div class="compliance-items">
              <div v-for="item in legalRequirements" :key="item.id" class="compliance-item">
                <i class="fas" :class="item.status === 'compliant' ? 'fa-check-circle' : 'fa-exclamation-circle'"></i>
                <span>{{ item.description }}</span>
              </div>
            </div>
          </div>

          <div class="compliance-card">
            <div class="compliance-header">
              <h3>Best Practices</h3>
              <span class="compliance-score">{{ bestPracticeCompliance }}%</span>
            </div>
            <div class="compliance-items">
              <div v-for="item in bestPractices" :key="item.id" class="compliance-item">
                <i class="fas" :class="item.status === 'implemented' ? 'fa-check-circle' : 'fa-times-circle'"></i>
                <span>{{ item.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Policy History -->
      <div class="policy-history">
        <h2>Policy History</h2>
        <div class="history-list">
          <div v-for="history in policyHistory" :key="history.id" class="history-item">
            <div class="history-header">
              <span class="history-date">{{ formatDate(history.date) }}</span>
              <span class="history-type">{{ history.type }}</span>
            </div>
            <div class="history-content">
              <div class="history-title">{{ history.title }}</div>
              <div class="history-summary">{{ history.summary }}</div>
            </div>
            <div class="history-actions">
              <button class="btn-outline" @click="viewHistory(history)">
                <i class="fas fa-eye"></i> View
              </button>
              <button class="btn-secondary" @click="restoreHistory(history)">
                <i class="fas fa-undo"></i> Restore
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Policy Preview Modal -->
      <div v-if="showPreviewModal" class="modal-overlay">
        <div class="modal modal-lg">
          <div class="modal-header">
            <h3>Policy Preview</h3>
            <button class="btn-close" @click="closePreviewModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-content">
            <div class="policy-preview">
              <div class="preview-header">
                <h1>{{ currentPolicy.title }}</h1>
                <div class="preview-meta">
                  <span>Effective Date: {{ formatDate(currentPolicy.effectiveDate) }}</span>
                  <span>Status: {{ currentPolicy.published ? 'Published' : 'Draft' }}</span>
                </div>
              </div>
              <div class="preview-content">
                <div class="preview-summary">
                  <h2>Summary</h2>
                  <p>{{ currentPolicy.summary }}</p>
                </div>
                <div class="preview-full">
                  <h2>Full Policy</h2>
                  <div class="policy-content-rendered" v-html="renderMarkdown(currentPolicy.content)"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="closePreviewModal">Close</button>
            <button class="btn-primary" @click="savePolicies">Save Policy</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default {
  name: 'StorePolicies',
  components: {
    SellerLayout
  },
  setup() {
    const activeCategory = ref('return')
    const showPreviewModal = ref(false)
    const lastUpdated = 'Jan 10, 2024'
    const totalViews = 1250
    const complianceScore = 85

    const policyCategories = [
      {
        id: 'return',
        name: 'Return & Refund Policy',
        description: 'Set your return and refund terms for customers',
        icon: 'fas fa-undo',
        status: 'updated'
      },
      {
        id: 'shipping',
        name: 'Shipping Policy',
        description: 'Define your shipping methods and delivery times',
        icon: 'fas fa-truck',
        status: 'current'
      },
      {
        id: 'privacy',
        name: 'Privacy Policy',
        description: 'Explain how you handle customer data',
        icon: 'fas fa-shield-alt',
        status: 'compliant'
      },
      {
        id: 'terms',
        name: 'Terms of Service',
        description: 'Set the terms for using your store',
        icon: 'fas fa-file-contract',
        status: 'current'
      },
      {
        id: 'warranty',
        name: 'Warranty Policy',
        description: 'Define product warranty terms',
        icon: 'fas fa-gift',
        status: 'none'
      }
    ]

    const policies = ref([
      {
        id: 'return',
        title: 'Return & Refund Policy',
        summary: 'We accept returns within 30 days for unused items in original condition.',
        content: `## Return Eligibility\n\nItems must be:\n- Unused and in original condition\n- Returned within 30 days of purchase\n- Accompanied by original receipt\n\n## Refund Process\n\n1. Contact our customer service\n2. Provide order details\n3. Ship item to our return address\n4. Receive refund within 5-7 business days\n\n## Non-Returnable Items\n\n- Custom or personalized orders\n- Perishable goods\n- Intimate or sanitary items\n- Digital downloads`,
        effectiveDate: '2024-01-01',
        published: true,
        customerAgreement: true
      },
      {
        id: 'shipping',
        name: 'Shipping Policy',
        summary: 'We offer various shipping options with tracking and insurance.',
        content: `## Shipping Options\n\n**Standard Shipping**: 3-7 business days, ₱150\n**Express Shipping**: 1-3 business days, ₱300\n**Same Day Delivery**: Metro Manila only, ₱500\n\n## Processing Time\n\nOrders are processed within 1-2 business days.\n\n## International Shipping\n\nAvailable to select countries. Additional fees apply.`,
        effectiveDate: '2024-01-01',
        published: true,
        customerAgreement: false
      }
    ])

    const policyTemplates = [
      {
        id: 1,
        name: 'Standard Return Policy',
        category: 'Return & Refund',
        description: 'A comprehensive return policy template for most businesses.',
        content: 'Standard return policy content...'
      },
      {
        id: 2,
        name: 'Basic Shipping Policy',
        category: 'Shipping',
        description: 'Simple shipping policy for small businesses.',
        content: 'Basic shipping policy content...'
      }
    ]

    const legalRequirements = [
      { id: 1, description: 'Clear return timeframes', status: 'compliant' },
      { id: 2, description: 'Refund method disclosure', status: 'compliant' },
      { id: 3, description: 'Customer rights information', status: 'pending' }
    ]

    const bestPractices = [
      { id: 1, description: 'Easy-to-understand language', status: 'implemented' },
      { id: 2, description: 'Multiple contact methods', status: 'implemented' },
      { id: 3, description: 'FAQ section included', status: 'pending' }
    ]

    const policyHistory = [
      {
        id: 1,
        date: '2024-01-10T10:30:00',
        type: 'Updated',
        title: 'Return & Refund Policy',
        summary: 'Updated return timeframe from 14 to 30 days'
      },
      {
        id: 2,
        date: '2023-12-15T14:20:00',
        type: 'Created',
        title: 'Shipping Policy',
        summary: 'Initial shipping policy created'
      }
    ]

    const currentPolicy = computed(() => {
      return policies.value.find(p => p.id === activeCategory.value) || {
        id: activeCategory.value,
        title: '',
        summary: '',
        content: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        published: false,
        customerAgreement: false
      }
    })

    const legalCompliance = computed(() => {
      const compliantItems = legalRequirements.filter(item => item.status === 'compliant').length
      return Math.round((compliantItems / legalRequirements.length) * 100)
    })

    const bestPracticeCompliance = computed(() => {
      const implementedItems = bestPractices.filter(item => item.status === 'implemented').length
      return Math.round((implementedItems / bestPractices.length) * 100)
    })

    const getActiveCategoryName = () => {
      const category = policyCategories.find(c => c.id === activeCategory.value)
      return category ? category.name : 'Policy'
    }

    const selectCategory = (categoryId) => {
      activeCategory.value = categoryId
    }

    const insertText = (prefix, suffix) => {
      // Simple text insertion for the editor
      const textarea = document.getElementById('policy-content')
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = currentPolicy.value.content
      currentPolicy.value.content = text.slice(0, start) + prefix + text.slice(start, end) + suffix + text.slice(end)
    }

    const applyTemplate = (template) => {
      currentPolicy.value.content = template.content
      currentPolicy.value.title = template.name
      alert('Template applied successfully!')
    }

    const previewTemplate = (template) => {
      alert(`Previewing template: ${template.name}`)
    }

    const previewPolicy = () => {
      showPreviewModal.value = true
    }

    const closePreviewModal = () => {
      showPreviewModal.value = false
    }

    const renderMarkdown = (content) => {
      // Simple markdown rendering
      let html = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^\- (.*$)/gm, '• $1')
        .replace(/\n\n/g, '<br><br>')
      return html
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatNumber = (number) => {
      return new Intl.NumberFormat('en-PH').format(number)
    }

    const resetToDefault = () => {
      if (confirm('Reset to default template?')) {
        currentPolicy.value.content = 'Default policy content...'
        currentPolicy.value.title = getActiveCategoryName()
        alert('Policy reset to default!')
      }
    }

    const savePolicies = () => {
      alert('Policies saved successfully!')
    }

    const previewPolicies = () => {
      alert('Previewing all policies...')
    }

    const viewHistory = (history) => {
      alert(`Viewing history: ${history.title}`)
    }

    const restoreHistory = (history) => {
      if (confirm('Restore this version?')) {
        alert('Policy restored!')
      }
    }

    return {
      activeCategory,
      showPreviewModal,
      lastUpdated,
      totalViews,
      complianceScore,
      policyCategories,
      policies,
      policyTemplates,
      legalRequirements,
      bestPractices,
      policyHistory,
      currentPolicy,
      legalCompliance,
      bestPracticeCompliance,
      getActiveCategoryName,
      selectCategory,
      insertText,
      applyTemplate,
      previewTemplate,
      previewPolicy,
      closePreviewModal,
      renderMarkdown,
      formatDate,
      formatNumber,
      resetToDefault,
      savePolicies,
      previewPolicies,
      viewHistory,
      restoreHistory
    }
  }
}
</script>

<style scoped>
.store-policies {
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

.policy-overview {
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

.policy-categories {
  margin-bottom: 3rem;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-card.active {
  border-left: 4px solid #3b82f6;
  background-color: #f0f9ff;
}

.category-icon {
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

.category-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.category-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.category-status {
  margin-left: auto;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.updated {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.current {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.compliant {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-badge.none {
  background-color: #f3f4f6;
  color: #6b7280;
}

.policy-editor {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 2rem;
  margin-bottom: 3rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.editor-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.editor-actions {
  display: flex;
  gap: 1rem;
}

.policy-form {
  display: flex;
  flex-direction: column;
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

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  background-color: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.toolbar-btn {
  background-color: white;
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.editor {
  font-family: 'Courier New', monospace;
  line-height: 1.5;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-text {
  font-size: 1rem;
  color: #374151;
}

.policy-templates h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.template-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.template-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.template-category {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
  color: #374151;
}

.template-content p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

.template-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.compliance-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.compliance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.compliance-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.compliance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.compliance-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.compliance-score {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.compliance-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.compliance-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.compliance-item .fa-check-circle {
  color: #10b981;
}

.compliance-item .fa-exclamation-circle,
.compliance-item .fa-times-circle {
  color: #ef4444;
}

.policy-history h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.history-date {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.history-type {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: #e0e7ff;
  border-radius: 9999px;
  color: #3730a3;
  font-weight: 600;
}

.history-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.history-summary {
  color: #6b7280;
  line-height: 1.5;
}

.history-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
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
  max-width: 800px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-lg {
  max-width: 1000px;
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
  max-height: 60vh;
  overflow-y: auto;
}

.policy-preview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preview-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.preview-meta {
  display: flex;
  gap: 2rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preview-summary h2,
.preview-full h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.preview-summary p {
  margin: 0;
  color: #374151;
  line-height: 1.6;
}

.policy-content-rendered {
  color: #374151;
  line-height: 1.6;
}

.policy-content-rendered h1,
.policy-content-rendered h2,
.policy-content-rendered h3 {
  margin: 1.5rem 0 1rem 0;
  color: #1f2937;
}

.policy-content-rendered strong {
  font-weight: 700;
}

.policy-content-rendered em {
  font-style: italic;
}

.policy-content-rendered br {
  margin-bottom: 1rem;
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
  .category-list {
    grid-template-columns: 1fr;
  }
  
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .compliance-grid {
    grid-template-columns: 1fr;
  }
  
  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .modal-lg {
    max-width: 90vw;
  }
}
</style>