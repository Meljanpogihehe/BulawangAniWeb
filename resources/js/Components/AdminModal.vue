<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="modal-close" @click="closeModal">
          <span>×</span>
        </button>
      </div>
      
      <div class="modal-body">
        <slot></slot>
      </div>
      
      <div class="modal-footer">
        <slot name="footer">
          <button class="btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn-primary" @click="submitForm" :disabled="isLoading">
            {{ isLoading ? loadingText : submitText }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Modal Title'
    },
    submitText: {
      type: String,
      default: 'Save'
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    },
    loadingText: {
      type: String,
      default: 'Saving...'
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    submitForm() {
      this.$emit('submit')
    },
    handleOverlayClick() {
      if (this.closeOnOverlay) {
        this.closeModal()
      }
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
    }
  },
  beforeUnmount() {
    document.body.style.overflow = 'unset'
  }
}
</script>

<style scoped>
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
  backdrop-filter: blur(4px);
  /* Ensure proper stacking context */
  isolation: isolate;
}

.modal-content {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
  max-height: 70vh;
  overflow: hidden;
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e8f1e1;
  /* Prevent content overflow issues */
  position: relative;
  /* Ensure proper scroll container */
  display: flex;
  flex-direction: column;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e8f1e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8faf7, #f0f7ee);
  position: sticky;
  top: 0;
  z-index: 1;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 800;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: #5a6c5a;
  padding: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.modal-close:hover {
  background: #e8f1e1;
  color: #27ae60;
}

.modal-close:focus {
  outline: 2px solid #27ae60;
  outline-offset: 2px;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  /* Ensure smooth scrolling */
  -webkit-overflow-scrolling: touch;
  /* Prevent horizontal overflow */
  overflow-x: hidden;
  /* Better scroll styling */
  scrollbar-width: thin;
  scrollbar-color: #27ae60 #f8faf7;
  /* Flex grow to take available space */
  flex: 1;
  /* Add visual indicator for scrollable content */
  position: relative;
}

/* Add a subtle shadow to indicate scrollable content */
.modal-body::after {
  content: '';
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Show shadow when content is scrollable and not at bottom */
.modal-body:not(:hover)::after {
  opacity: 0;
}

.modal-body:hover::after {
  opacity: 1;
}

/* Webkit scrollbar styling */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f8faf7;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #27ae60;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #2ecc71;
}

/* Form styling within modals */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e8f1e1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background: #fff;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #27ae60;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #e74c3c;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Checkbox styling for document selection */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  color: #5a6c5a;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #27ae60;
  cursor: pointer;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e8f1e1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #fafafa;
  position: sticky;
  bottom: 0;
  z-index: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-height: 48px;
  min-width: 120px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-height: 48px;
  min-width: 120px;
}

.btn-secondary:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-content {
    max-width: 95vw;
    margin: 1rem;
    max-height: 85vh;
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
  }
  
  .modal-header h3 {
    font-size: 1.1rem;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .modal-content {
    animation: none;
  }
  
  .modal-close,
  .btn-primary,
  .btn-secondary {
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .modal-overlay {
    background: rgba(0, 0, 0, 0.7);
  }
  
  .modal-content {
    border: 2px solid #000;
  }
  
  .modal-header {
    background: #fff;
    border-bottom: 2px solid #000;
  }
  
  .modal-footer {
    background: #fff;
    border-top: 2px solid #000;
  }
}
</style>