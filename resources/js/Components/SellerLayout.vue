<template>
  <div class="seller-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ collapsed: isCollapsed, active: isMobileActive }">
      <!-- LOGO -->
      <div class="sidebar-header">
        <div v-if="!isCollapsed" class="logo-container" @click="$router.push('/seller')">
          <div class="logo-icon">
            <span class="logo-text">B</span>
          </div>
          <div class="logo-text-container">
            <h2 class="logo-main">Bulawang <span class="logo-accent">Ani</span></h2>
          </div>
        </div>
        <button class="toggle-btn" @click="toggleSidebar">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>

      <!-- NAVIGATION -->
      <nav class="sidebar-nav">

        <!-- DASHBOARD -->
        <router-link to="/seller/dashboard" class="nav-item">
          <i class="fa-solid fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </router-link>

        <!-- PRODUCTS -->
        <div class="nav-group">
          <div class="nav-group-header" @click="toggle('products')">
            <i class="fa-solid fa-box"></i>
            <span>Products</span>
            <i class="fa-solid fa-chevron-down arrow" :class="{ open: dropdowns.products }"></i>
          </div>
          <div v-show="dropdowns.products" class="nav-sub">
            <router-link to="/seller/products" class="nav-sub-item">
              <i class="fa-solid fa-boxes"></i>
              Product List
            </router-link>
            <router-link to="/seller/add-product" class="nav-sub-item">
              <i class="fa-solid fa-plus-circle"></i>
              Add Product
            </router-link>
            <router-link to="/seller/stock-management" class="nav-sub-item">
              <i class="fa-solid fa-warehouse"></i>
              Stock Management
            </router-link>
          </div>
        </div>

        <!-- ORDERS -->
        <div class="nav-group">
          <div class="nav-group-header" @click="toggle('orders')">
            <i class="fa-solid fa-cart-shopping"></i>
            <span>Orders</span>
            <i class="fa-solid fa-chevron-down arrow" :class="{ open: dropdowns.orders }"></i>
          </div>
          <div v-show="dropdowns.orders" class="nav-sub">
            <router-link to="/seller/orders/new" class="nav-sub-item">
              <i class="fa-solid fa-clock"></i>
              New Orders
            </router-link>
            <router-link to="/seller/orders/processing" class="nav-sub-item">
              <i class="fa-solid fa-cog"></i>
              Processing
            </router-link>
            <router-link to="/seller/orders/completed" class="nav-sub-item">
              <i class="fa-solid fa-check-circle"></i>
              Completed
            </router-link>
            <router-link to="/seller/orders/cancelled" class="nav-sub-item">
              <i class="fa-solid fa-times-circle"></i>
              Cancelled
            </router-link>
            <router-link to="/seller/order-overview" class="nav-sub-item">
              <i class="fa-solid fa-list-alt"></i>
              Order Overview
            </router-link>
          </div>
        </div>

        <!-- SALES & FINANCE -->
        <div class="nav-group">
          <div class="nav-group-header" @click="toggle('sales')">
            <i class="fa-solid fa-chart-line"></i>
            <span>Sales & Finance</span>
            <i class="fa-solid fa-chevron-down arrow" :class="{ open: dropdowns.sales }"></i>
          </div>
          <div v-show="dropdowns.sales" class="nav-sub">
            <router-link to="/seller/sales-summary" class="nav-sub-item">
              <i class="fa-solid fa-chart-bar"></i>
              Sales Summary
            </router-link>
            <router-link to="/seller/earnings" class="nav-sub-item">
              <i class="fa-solid fa-wallet"></i>
              Earnings
            </router-link>
            <router-link to="/seller/payout-history" class="nav-sub-item">
              <i class="fa-solid fa-hand-holding-usd"></i>
              Payout History
            </router-link>
            <router-link to="/seller/discounts" class="nav-sub-item">
              <i class="fa-solid fa-tag"></i>
              Discounts
            </router-link>
            <router-link to="/seller/vouchers" class="nav-sub-item">
              <i class="fa-solid fa-ticket-alt"></i>
              Vouchers
            </router-link>
          </div>
        </div>

        <!-- CUSTOMER MANAGEMENT -->
        <div class="nav-group">
          <div class="nav-group-header" @click="toggle('customers')">
            <i class="fa-solid fa-users"></i>
            <span>Customer Management</span>
            <i class="fa-solid fa-chevron-down arrow" :class="{ open: dropdowns.customers }"></i>
          </div>
          <div v-show="dropdowns.customers" class="nav-sub">
            <router-link to="/seller/customer-messages" class="nav-sub-item">
              <i class="fa-solid fa-comments"></i>
              Messages
            </router-link>
            <router-link to="/seller/reviews-ratings" class="nav-sub-item">
              <i class="fa-solid fa-star"></i>
              Reviews & Ratings
            </router-link>
          </div>
        </div>

        <!-- SHIPPING -->
        <div class="nav-group">
          <div class="nav-group-header" @click="toggle('shipping')">
            <i class="fa-solid fa-truck"></i>
            <span>Shipping</span>
            <i class="fa-solid fa-chevron-down arrow" :class="{ open: dropdowns.shipping }"></i>
          </div>
          <div v-show="dropdowns.shipping" class="nav-sub">
            <router-link to="/seller/shipping-setup" class="nav-sub-item">
              <i class="fa-solid fa-cog"></i>
              Shipping Setup
            </router-link>
            <router-link to="/seller/order-fulfillment" class="nav-sub-item">
              <i class="fa-solid fa-shipping-fast"></i>
              Order Fulfillment
            </router-link>
          </div>
        </div>

        <!-- STORE MANAGEMENT -->
        <div class="nav-group">
          <div class="nav-group-header" @click="toggle('store')">
            <i class="fa-solid fa-store"></i>
            <span>Store Management</span>
            <i class="fa-solid fa-chevron-down arrow" :class="{ open: dropdowns.store }"></i>
          </div>
          <div v-show="dropdowns.store" class="nav-sub">
            <router-link to="/seller/store-profile" class="nav-sub-item">
              <i class="fa-solid fa-store"></i>
              Store Profile
            </router-link>
            <router-link to="/seller/store-policies" class="nav-sub-item">
              <i class="fa-solid fa-file-alt"></i>
              Store Policies
            </router-link>
          </div>
        </div>

        <!-- REPORTS -->
        <div class="nav-group">
          <div class="nav-group-header" @click="toggle('reports')">
            <i class="fa-solid fa-file-alt"></i>
            <span>Reports</span>
            <i class="fa-solid fa-chevron-down arrow" :class="{ open: dropdowns.reports }"></i>
          </div>
          <div v-show="dropdowns.reports" class="nav-sub">
            <router-link to="/seller/sales-reports" class="nav-sub-item">
              <i class="fa-solid fa-chart-line"></i>
              Sales Reports
            </router-link>
            <router-link to="/seller/inventory-reports" class="nav-sub-item">
              <i class="fa-solid fa-warehouse"></i>
              Inventory Reports
            </router-link>
          </div>
        </div>

        <!-- ACCOUNT -->
        <div class="nav-group">
          <div class="nav-group-header" @click="toggle('account')">
            <i class="fa-solid fa-user"></i>
            <span>Account</span>
            <i class="fa-solid fa-chevron-down arrow" :class="{ open: dropdowns.account }"></i>
          </div>
          <div v-show="dropdowns.account" class="nav-sub">
            <router-link to="/seller/profile-settings" class="nav-sub-item">
              <i class="fa-solid fa-user-cog"></i>
              Profile Settings
            </router-link>
            <router-link to="/seller/change-password" class="nav-sub-item">
              <i class="fa-solid fa-key"></i>
              Change Password
            </router-link>
          </div>
        </div>

        <!-- LOGOUT -->
        <div class="nav-item logout" @click="showLogoutModal = true">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </div>

      </nav>
    </aside>

    <!-- MAIN -->
    <main class="main-content" :class="{ expanded: isCollapsed }" @click="closeMobileSidebar">
      <slot />
    </main>

    <!-- LOGOUT MODAL -->
    <div v-if="showLogoutModal" class="logout-modal-overlay" @click="cancelLogout">
      <div class="logout-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Logout</h3>
          <button class="close-btn" @click="cancelLogout">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to logout from your seller account?</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="cancelLogout">Cancel</button>
          <button class="btn-logout" @click="confirmLogout">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SellerLayout",
  data() {
    return {
      isCollapsed: false,
      isMobileActive: false,
      showLogoutModal: false,
      dropdowns: {
        products: false,
        orders: false,
        sales: false,
        customers: false,
        shipping: false,
        store: false,
        reports: false,
        account: false
      }
    };
  },
  mounted() {
    // Initialize dropdown states based on current route
    this.initializeDropdowns();
    
    // Add window resize listener to handle sidebar state
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // Remove event listener
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    // Watch for route changes to update dropdown states
    '$route'(to) {
      this.initializeDropdowns();
    }
  },
  methods: {
    toggleSidebar() {
      // On mobile, toggle mobile sidebar
      if (window.innerWidth <= 768) {
        this.isMobileActive = !this.isMobileActive;
      } else {
        // On desktop, toggle collapse
        this.isCollapsed = !this.isCollapsed;
      }
    },
    closeMobileSidebar() {
      // Close mobile sidebar when clicking main content
      if (window.innerWidth <= 768) {
        this.isMobileActive = false;
      }
    },
    handleResize() {
      // Handle sidebar state when window is resized
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // On mobile, keep mobile sidebar state
        // Don't auto-close unless explicitly closed
      } else {
        // On desktop, ensure mobile sidebar is closed
        this.isMobileActive = false;
      }
    },
    toggle(section) {
      this.dropdowns[section] = !this.dropdowns[section];
    },
    confirmLogout() {
      // Add logout confirmation logic
      this.$emit("logout");
      this.showLogoutModal = false;
    },
    cancelLogout() {
      this.showLogoutModal = false;
    },
    initializeDropdowns() {
      // Open dropdowns based on current route
      const currentPath = this.$route.path;
      
      if (currentPath.startsWith('/seller/products') || currentPath.startsWith('/seller/add-product') || currentPath.startsWith('/seller/stock-management')) {
        this.dropdowns.products = true;
      }
      if (currentPath.startsWith('/seller/orders') || currentPath === '/seller/order-overview') {
        this.dropdowns.orders = true;
      }
      if (currentPath.startsWith('/seller/sales-summary') || currentPath.startsWith('/seller/earnings') || currentPath.startsWith('/seller/payout-history') || currentPath.startsWith('/seller/discounts') || currentPath.startsWith('/seller/vouchers')) {
        this.dropdowns.sales = true;
      }
      if (currentPath.startsWith('/seller/customer-messages') || currentPath.startsWith('/seller/reviews-ratings')) {
        this.dropdowns.customers = true;
      }
      if (currentPath.startsWith('/seller/shipping-setup') || currentPath.startsWith('/seller/order-fulfillment')) {
        this.dropdowns.shipping = true;
      }
      if (currentPath.startsWith('/seller/store-profile') || currentPath.startsWith('/seller/store-policies')) {
        this.dropdowns.store = true;
      }
      if (currentPath.startsWith('/seller/sales-reports') || currentPath.startsWith('/seller/inventory-reports')) {
        this.dropdowns.reports = true;
      }
      if (currentPath.startsWith('/seller/profile-settings') || currentPath.startsWith('/seller/change-password')) {
        this.dropdowns.account = true;
      }
    }
  }
};
</script>

<style scoped>
.seller-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6faf7 0%, #f0f7ee 100%);
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* SIDEBAR */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #ffffff 0%, #f8faf7 100%);
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  position: fixed;
  height: 100vh;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(39, 174, 96, 0.1);
  z-index: 1000;
}

.sidebar.collapsed {
  width: 80px;
}

/* HEADER */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px;
  border-bottom: 1px solid rgba(39, 174, 96, 0.1);
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  position: sticky;
  top: 0;
  z-index: 1001;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo-container:hover {
  transform: scale(1.02);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.logo-container:hover .logo-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

.logo-text {
  color: #27ae60;
  font-weight: 800;
  font-size: 1.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
}

.logo-main {
  color: white;
  font-weight: 800;
  font-size: 1.2rem;
  margin: 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.logo-accent {
  color: #e8f5e9;
  text-shadow: none;
}

.toggle-btn {
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.toggle-btn:active {
  transform: scale(0.95);
}

/* NAV */
.sidebar-nav {
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 80px);
  scrollbar-width: thin;
  scrollbar-color: #eafaf1 #f8faf7;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: #f8faf7;
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #eafaf1;
  border-radius: 3px;
}

.nav-item,
.nav-group-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  margin-bottom: 8px;
  border-radius: 16px;
  font-weight: 600;
  color: #5f6f65;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-item:hover,
.nav-group-header:hover {
  background: linear-gradient(135deg, #eafaf1 0%, #d4edda 100%);
  color: #27ae60;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.15);
}

.nav-item.router-link-active {
  background: linear-gradient(135deg, #eafaf1 0%, #d4edda 100%);
  color: #27ae60;
  box-shadow: 0 6px 16px rgba(39, 174, 96, 0.25);
  border-left: 4px solid #27ae60;
}

.nav-item.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #27ae60, #2ecc71);
  border-radius: 0 4px 4px 0;
}

.arrow {
  margin-left: auto;
  transition: all 0.3s ease;
  font-size: 12px;
}

.arrow.open {
  transform: rotate(180deg);
}

.nav-sub {
  padding-left: 56px;
  margin-top: 8px;
}

.nav-sub-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  font-size: 14px;
  color: #6b7c73;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 4px;
}

.nav-sub-item i {
  font-size: 14px;
  width: 18px;
  text-align: center;
  opacity: 0.8;
}

.nav-sub-item:hover {
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
  transform: translateX(4px);
}

/* LOGOUT */
.logout {
  margin-top: 20px;
  background: linear-gradient(135deg, #fff4e5 0%, #ffeaa7 100%);
  color: #856404;
  border: 1px solid rgba(230, 126, 34, 0.2);
  box-shadow: 0 4px 12px rgba(230, 126, 34, 0.15);
}

.logout:hover {
  background: linear-gradient(135deg, #ffeaa7 0%, #ffd700 100%);
  color: #7f5a00;
  transform: translateX(4px);
}

/* COLLAPSE */
.sidebar.collapsed span,
.sidebar.collapsed .arrow {
  display: none;
}

.sidebar.collapsed .nav-group-header,
.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 16px;
  gap: 0;
}

.sidebar.collapsed .nav-sub {
  padding-left: 0;
  display: none;
}

/* MAIN */
.main-content {
  margin-left: 280px;
  padding: 32px;
  width: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
}

.main-content.expanded {
  margin-left: 80px;
}

/* RESPONSIVE DESIGN */
@media (max-width: 1024px) {
  .sidebar {
    width: 250px;
  }
  
  .main-content {
    margin-left: 250px;
  }
  
  .main-content.expanded {
    margin-left: 72px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: -280px;
    height: 100vh;
    z-index: 2000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 20px rgba(0,0,0,0.15);
  }
  
  .sidebar.active {
    left: 0;
  }
  
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  
  .main-content.expanded {
    margin-left: 0;
  }
  
  /* Mobile overlay */
  .sidebar::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: -1;
    transition: all 0.4s ease;
  }
  
  .sidebar.active::after {
    left: -280px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 280px;
  }
  
  .sidebar-header {
    padding: 20px 16px;
  }
  
  .logo {
    font-size: 1.25rem;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .nav-item,
  .nav-group-header {
    padding: 12px 14px;
    gap: 12px;
  }
  
  .nav-sub {
    padding-left: 48px;
  }
  
  .nav-sub-item {
    padding: 8px 10px;
    font-size: 13px;
  }
}

/* ANIMATIONS */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-item,
.nav-group-header {
  animation: slideIn 0.3s ease-out;
}

/* ACCESSIBILITY */
.sidebar-header .toggle-btn:focus,
.nav-item:focus,
.nav-group-header:focus {
  outline: 2px solid #27ae60;
  outline-offset: 2px;
}

.nav-sub-item:focus {
  outline: 2px solid #27ae60;
  outline-offset: -2px;
}

/* DARK MODE SUPPORT */
@media (prefers-color-scheme: dark) {
  .seller-layout {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }
  
  .sidebar {
    background: linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%);
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  
  .sidebar-nav {
    scrollbar-color: #404040 #2d2d2d;
  }
  
  .sidebar-nav::-webkit-scrollbar-thumb {
    background: #404040;
  }
  
  .nav-item,
  .nav-group-header {
    color: #d1d1d1;
  }
  
  .nav-item:hover,
  .nav-group-header:hover {
    background: linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%);
    color: #44bd32;
  }
  
  .nav-sub-item {
    color: #b1b1b1;
  }
  
  .nav-sub-item:hover {
    color: #44bd32;
    background: rgba(68, 189, 50, 0.1);
  }
}

/* LOGOUT MODAL */
.logout-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  backdrop-filter: blur(4px);
}

.logout-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(39, 174, 96, 0.1);
  overflow: hidden;
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(39, 174, 96, 0.1);
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
}

.modal-header h3 {
  color: white;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-body {
  padding: 24px;
  text-align: center;
}

.modal-body p {
  color: #5a6c5a;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(39, 174, 96, 0.1);
  background: #f8faf7;
}

.btn-cancel {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e8f1e1;
  border-radius: 12px;
  background: white;
  color: #5a6c5a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-cancel:hover {
  background: #eafaf1;
  border-color: #d4edda;
  transform: translateY(-1px);
}

.btn-logout {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.btn-logout:hover {
  background: linear-gradient(135deg, #c0392b, #a93226);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
}

/* RESPONSIVE MODAL */
@media (max-width: 480px) {
  .logout-modal {
    width: 95%;
    margin: 0 10px;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-header h3 {
    font-size: 1.1rem;
  }
  
  .modal-body {
    padding: 20px 20px;
  }
  
  .modal-footer {
    padding: 16px 20px;
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-logout {
    width: 100%;
  }
}
</style>