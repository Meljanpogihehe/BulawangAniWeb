<template>
    <LoadingSpinner v-if="isLoading" />
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-yellow-50 font-sans">
    <div class="bg-green-900 text-white py-2 text-xs md:text-sm font-medium text-center px-4">
    </div>

    <nav class="border-b sticky top-0 bg-white/95 backdrop-blur-md z-50">
      <div class="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center gap-4">
        <div class="flex items-center gap-2 cursor-pointer shrink-0">
          <div class="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
            <span class="text-yellow-400 font-bold text-xl">B</span>
          </div>
          <h1 class="text-xl md:text-2xl font-black tracking-tight text-green-800">
            Bulawang <span class="text-yellow-600">Ani</span>
          </h1>
        </div>

        <div class="hidden md:flex flex-1 max-w-md relative group">
          <input type="text" placeholder="Search rice, vegetables, or farmers..."
                 class="w-full bg-gray-100 border-2 border-transparent rounded-full py-2.5 px-12 focus:bg-white focus:border-green-600 focus:ring-0 outline-none transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-3 text-gray-400 group-focus-within:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex items-center gap-2 md:gap-6">
          <div class="hidden lg:flex gap-6 font-bold text-sm text-gray-600 uppercase tracking-wide">
            <router-link to="/" class="hover:text-green-700 transition">Home</router-link>
            <router-link to="/products" class="hover:text-green-700 transition">Products</router-link>
            <router-link to="/orders" class="hover:text-green-700 transition">Orders</router-link>
          </div>

          <div class="flex items-center gap-1 md:gap-3 border-l pl-4 md:pl-6 border-gray-200">
            <router-link to="/cart" class="p-2 hover:bg-green-50 rounded-full transition relative group">
              <span class="absolute -top-0 -right-0 bg-yellow-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">{{ cartStore.totalItems }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 group-hover:text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </router-link>
            <router-link to="/login" class="hidden sm:block px-5 py-2.5 bg-green-700 text-white rounded-full font-bold text-sm hover:bg-green-800 transition shadow-lg shadow-green-100">My Account</router-link>
            <button @click="toggleMobileMenu" class="lg:hidden p-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 lg:hidden">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="closeMobileMenu"></div>
      <div class="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div class="p-6">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-xl font-black text-green-800">Menu</h2>
            <button @click="closeMobileMenu" class="p-2 hover:bg-gray-100 rounded-full transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav class="space-y-4">
            <router-link to="/" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              Home
            </router-link>
            <router-link to="/products" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              Products
            </router-link>
            <router-link to="/orders" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              Orders
            </router-link>
          </nav>

          <div class="mt-8 pt-8 border-t border-gray-200">
            <router-link to="/login" @click="closeMobileMenu" class="block text-center w-full px-6 py-3 bg-green-700 text-white rounded-xl font-bold text-sm hover:bg-green-800 transition shadow-lg">
              Login
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Checkout Form -->
        <div class="space-y-8">
          <div class="bg-white rounded-[2rem] p-8 border border-gray-100">
            <h2 class="text-3xl font-black mb-6">Checkout</h2>
            
            <!-- Delivery Information -->
            <div class="mb-8">
              <h3 class="font-black text-lg mb-4">Delivery Information</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input v-model="deliveryInfo.name" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-0 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input v-model="deliveryInfo.phone" type="tel" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-0 outline-none">
                </div>
              </div>
              <div class="mt-4">
                <label class="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
                <textarea v-model="deliveryInfo.address" rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-0 outline-none"></textarea>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="mb-8">
              <h3 class="font-black text-lg mb-4">Payment Method</h3>
              <div class="space-y-4">
                <label class="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-transparent hover:border-green-200 transition">
                  <input type="radio" v-model="paymentInfo.method" value="Cash on Delivery" class="text-green-600">
                  <div>
                    <div class="font-bold text-gray-900">Cash on Delivery</div>
                    <div class="text-sm text-gray-500">Pay when your order is delivered</div>
                  </div>
                </label>
                <label class="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-transparent hover:border-green-200 transition">
                  <input type="radio" v-model="paymentInfo.method" value="GCash" class="text-green-600">
                  <div>
                    <div class="font-bold text-gray-900">GCash</div>
                    <div class="text-sm text-gray-500">Pay securely with GCash</div>
                  </div>
                </label>
                <label class="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-transparent hover:border-green-200 transition">
                  <input type="radio" v-model="paymentInfo.method" value="Credit Card" class="text-green-600">
                  <div>
                    <div class="font-bold text-gray-900">Credit Card</div>
                    <div class="text-sm text-gray-500">Visa, MasterCard, or American Express</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Order Notes -->
            <div>
              <h3 class="font-black text-lg mb-4">Order Notes (Optional)</h3>
              <textarea v-model="orderNotes" rows="3" placeholder="Any special instructions for your order..." class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-0 outline-none"></textarea>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:sticky lg:top-24">
          <div class="bg-white rounded-[2rem] p-8 border border-gray-100">
            <h3 class="text-2xl font-black mb-6">Order Summary</h3>

            <div class="space-y-4 mb-6">
              <div v-for="(item, index) in cartStore.items" :key="item.name" class="flex items-center gap-4 hover:bg-gray-50 p-3 rounded-xl transition">
                <img :src="item.img" :alt="item.name" class="w-16 h-16 object-cover rounded-xl shadow-sm">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900">{{ item.name }}</h4>
                  <p class="text-sm text-gray-500">Qty: {{ item.quantity }} × {{ item.unit }}</p>
                  <p class="text-xs text-gray-400">📍 {{ item.origin }}</p>
                </div>
                <div class="text-right">
                  <div class="font-bold text-green-800">₱{{ (parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString() }}</div>
                  <div class="text-xs text-gray-500">₱{{ item.price }} each</div>
                </div>
              </div>
            </div>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600 font-medium">Subtotal ({{ cartStore.totalItems }} items)</span>
                <span class="font-black text-lg">₱{{ cartStore.subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 font-medium">Delivery Fee</span>
                <span class="font-black text-lg">₱{{ cartStore.deliveryFee.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 font-medium">Service Fee</span>
                <span class="font-black text-lg">₱{{ cartStore.serviceFee.toLocaleString() }}</span>
              </div>
              <hr class="border-gray-300 my-4">
              <div class="flex justify-between text-xl font-black">
                <span>Total</span>
                <span class="text-green-800">₱{{ cartStore.total.toLocaleString() }}</span>
              </div>
            </div>

            <!-- Promo Code -->
            <div class="mb-6">
              <label class="block font-black text-gray-900 mb-2">Promo Code</label>
              <div class="flex gap-2">
                <input type="text" v-model="promoCode"
                       placeholder="Enter promo code"
                       class="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-0 outline-none">
                <button @click="cartStore.applyPromoCode(promoCode)"
                        class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">
                  Apply
                </button>
              </div>
              <p v-if="cartStore.promoApplied" class="text-green-600 text-sm mt-2 font-medium">Promo code applied! 10% discount</p>
            </div>

            <!-- Place Order Button -->
            <button @click="placeOrder"
                    class="w-full bg-green-700 text-white py-4 rounded-2xl font-black text-xl hover:bg-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-4">
              Place Order
            </button>

            <div class="text-center">
              <p class="text-xs text-gray-500">Secure checkout powered by multiple payment options</p>
            </div>

            <!-- Continue Shopping -->
            <div class="mt-6 text-center">
              <router-link to="/products" class="text-green-700 font-bold hover:text-green-800 transition">
                ← Continue Shopping
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="bg-white border-t pt-20 pb-10 mt-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div class="space-y-6">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center shadow-md">
                <span class="text-yellow-400 font-bold text-sm">B</span>
              </div>
              <h2 class="text-xl font-black text-green-800">Bulawang <span class="text-yellow-600">Ani</span></h2>
            </div>
            <p class="text-sm text-gray-500 leading-relaxed">Pioneering the future of Philippine agriculture by connecting the soil to the soul of the city. We believe in fair pay, fresh food, and full transparency.</p>
            <div class="flex gap-4">
                <div v-for="i in 3" :key="i" class="w-10 h-10 bg-gray-100 rounded-xl hover:bg-green-600 hover:text-white transition-all cursor-pointer flex items-center justify-center">
                    <div class="w-4 h-4 bg-current rounded-sm"></div>
                </div>
            </div>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-8 text-gray-900">Farm Shop</h4>
            <ul class="space-y-4 text-gray-500 font-bold text-sm">
              <li><a href="#" class="hover:text-green-700 transition">Wholesale Grains</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Subscription Boxes</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Organic Poultry</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Flash Harvest Deals</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-8 text-gray-900">Governance</h4>
            <ul class="space-y-4 text-gray-500 font-bold text-sm">
              <li><a href="#" class="hover:text-green-700 transition">Sustainability Policy</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Farmer Grant Program</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Logistics Network</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Refund & Freshness Policy</a></li>
            </ul>
          </div>

          <div class="bg-green-50 p-8 rounded-[2rem] border border-green-100">
            <h4 class="font-black text-green-900 text-lg mb-2">Join the Harvest</h4>
            <p class="text-xs text-green-700/70 mb-6 font-medium leading-relaxed">Sign up to receive "Harvest Alerts" when your favorite crops are freshly picked.</p>
            <div class="space-y-2">
              <input type="email" placeholder="Email address" class="w-full bg-white px-4 py-3 rounded-xl outline-none text-sm border-none shadow-sm focus:ring-2 focus:ring-green-600">
              <button class="w-full bg-green-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-800 transition shadow-lg shadow-green-900/10">Subscribe Now</button>
            </div>
          </div>
        </div>

        <div class="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <p>© 2026 Bulawang Ani Philippines. Supporting our local heroes.</p>
          <div class="flex gap-8">
            <a href="#" class="hover:text-green-700 transition">Privacy</a>
            <a href="#" class="hover:text-green-700 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart'
import { useOrdersStore } from '../stores/orders'

const router = useRouter();
const cartStore = useCartStore();
const ordersStore = useOrdersStore();

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const deliveryInfo = ref({
  name: 'Juan Dela Cruz',
  phone: '+63 917 123 4567',
  address: '123 Poblacion St, Bulacan, Philippines'
});

const paymentInfo = ref({
  method: 'Cash on Delivery'
});

const orderNotes = ref('');
const promoCode = ref('');

const placeOrder = () => {
  if (cartStore.items.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  if (!deliveryInfo.value.name || !deliveryInfo.value.phone || !deliveryInfo.value.address) {
    alert('Please fill in all delivery information.');
    return;
  }

  // Create order from cart
  const orderData = {
    items: cartStore.items,
    subtotal: cartStore.subtotal,
    deliveryFee: cartStore.deliveryFee,
    total: cartStore.total,
    delivery: deliveryInfo.value,
    payment: {
      method: paymentInfo.value.method,
      status: paymentInfo.value.method === 'Cash on Delivery' ? 'Unpaid' : 'Paid'
    },
    notes: orderNotes.value,
    timeline: [
      { title: 'Order Placed', time: new Date().toLocaleString(), completed: true },
      { title: 'Preparing Order', time: 'In Progress', completed: true },
      { title: 'Out for Delivery', time: 'Pending', completed: false },
      { title: 'Delivered', time: 'Pending', completed: false }
    ]
  };

  // Add to orders
  ordersStore.addOrder(orderData);

  // Clear cart
  cartStore.clearCart();

  // Navigate to orders
  router.push('/orders');
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Custom extra-small breakpoint for very narrow devices */
@media (max-width: 400px) {
  .xs\:inline { display: inline; }
}
</style>