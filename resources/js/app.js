import './bootstrap';
import '../css/app.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

// Import stores
import { useCartStore } from './stores/cart';
import { useAuthStore } from './stores/auth';
import { useWishlistStore } from './stores/wishlist';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

// Install plugins
app.use(pinia);
app.use(router);

// Initialize stores
const cartStore = useCartStore();
const authStore = useAuthStore();
const wishlistStore = useWishlistStore();

// Global properties for easy access
app.config.globalProperties.$cart = cartStore;
app.config.globalProperties.$auth = authStore;
app.config.globalProperties.$wishlist = wishlistStore;

console.log('Vue app mounting...');
console.log('Router:', router);
console.log('Pinia:', pinia);

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.error('Component:', vm);
  console.error('Info:', info);
};

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

try {
  app.mount('#app');
  console.log('Vue app mounted successfully');
} catch (error) {
  console.error('Failed to mount Vue app:', error);
}
