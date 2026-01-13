<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-yellow-50 font-sans">

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
            <router-link to="/orders" class="text-green-700 font-black border-b-2 border-green-700 transition pb-1">Orders</router-link>
            <router-link to="/profile" class="hover:text-green-700 transition">Profile</router-link>
            <router-link to="/about" class="hover:text-green-700 transition">About</router-link>
            <router-link to="/contact" class="hover:text-green-700 transition">Contact</router-link>
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
            <router-link to="/orders" @click="closeMobileMenu" class="block px-4 py-3 bg-green-50 text-green-700 rounded-xl font-bold transition">
              Orders
            </router-link>
            <router-link to="/profile" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              Profile
            </router-link>
            <router-link to="/about" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              About
            </router-link>
            <router-link to="/contact" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              Contact
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
      <!-- My Orders Section -->
      <div class="mb-12">
        <h2 class="text-3xl font-black mb-4">My <span class="text-green-700">Orders</span></h2>
        <p class="text-gray-600 mb-8">View and track all your orders in one place.</p>

        <!-- Empty Orders State -->
        <div v-if="ordersStore.orders.length === 0" class="text-center py-16 bg-white rounded-[2rem] border border-gray-100">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">You haven't placed any orders yet</h3>
          <p class="text-gray-500 mb-6">Start shopping to see your orders here!</p>
          <router-link to="/products" class="bg-green-700 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-800 transition">Start Shopping</router-link>
        </div>

        <!-- Orders List -->
        <div v-else class="space-y-6">
          <div v-for="order in ordersStore.orders" :key="order.id"
               class="bg-white rounded-[2rem] p-6 border border-gray-100 hover:border-green-200 transition-all">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <img :src="order.items[0].img" :alt="order.items[0].name" class="w-16 h-16 object-cover rounded-xl shadow-sm hover:scale-105 transition-transform duration-300">
                <div>
                  <h4 class="font-black text-lg text-gray-900">Order #{{ order.id }}</h4>
                  <p class="text-sm text-gray-500">{{ order.date }}</p>
                  <p class="text-sm text-gray-500">{{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }}</p>
                </div>
              </div>

              <div class="flex flex-col md:flex-row md:items-center gap-4">
                <div class="text-right">
                  <div class="text-xl font-black text-green-800">₱{{ order.total.toLocaleString() }}</div>
                  <div :class="getStatusColor(order.status)" class="text-sm font-bold uppercase tracking-widest">
                    {{ order.status }}
                  </div>
                </div>

                <div class="flex gap-2">
                  <button @click="viewOrderDetails(order)"
                          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
                    View Details
                  </button>
                  <button @click="trackOrder(order)"
                          class="px-4 py-2 bg-green-700 text-white rounded-xl font-bold text-sm hover:bg-green-800 transition">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div v-if="selectedOrder" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-scroll">
          <div class="p-8">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-black">Order Details</h3>
              <button @click="closeOrderDetails" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Order Status -->
            <div class="bg-gray-50 rounded-2xl p-6 mb-6">
              <div class="flex items-center gap-4 mb-4">
                <div :class="getStatusIcon(selectedOrder.status)" class="w-12 h-12 rounded-full flex items-center justify-center text-white">
                  <span class="text-xl">{{ getStatusEmoji(selectedOrder.status) }}</span>
                </div>
                <div>
                  <h4 class="font-black text-lg">{{ selectedOrder.status }}</h4>
                  <p class="text-gray-600">{{ getStatusMessage(selectedOrder.status) }}</p>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="mb-6">
              <h4 class="font-black text-lg mb-4">Order Items</h4>
              <p class="text-gray-600 mb-4">Here are the items included in your order.</p>
              <div class="space-y-4">
                <div v-for="item in selectedOrder.items" :key="item.name"
                     class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <img :src="item.img" :alt="item.name" class="w-16 h-16 object-cover rounded-lg shadow-sm">
                  <div class="flex-1">
                    <h5 class="font-bold text-gray-900">{{ item.name }}</h5>
                    <p class="text-sm text-gray-500">Quantity: {{ item.quantity }} × {{ item.unit }}</p>
                    <p class="text-xs text-gray-400">📍 {{ item.origin }}</p>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-green-800">₱{{ (parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString() }}</div>
                    <div class="text-sm text-gray-500">₱{{ item.price }} each</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Information -->
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 class="font-black text-lg mb-4">Delivery Address</h4>
                <p class="text-gray-600 mb-4">Please ensure your delivery details are correct.</p>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="font-bold">{{ selectedOrder.delivery.name }}</p>
                  <p>{{ selectedOrder.delivery.phone }}</p>
                  <p>{{ selectedOrder.delivery.address }}</p>
                </div>
              </div>

              <div>
                <h4 class="font-black text-lg mb-4">Payment Details</h4>
                <div class="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div class="flex justify-between">
                    <span>Payment Method:</span>
                    <span class="font-bold">{{ selectedOrder.payment.method }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Item Total:</span>
                    <span>₱{{ selectedOrder.subtotal.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>₱{{ selectedOrder.deliveryFee.toLocaleString() }}</span>
                  </div>
                  <hr class="border-gray-300">
                  <div class="flex justify-between font-bold">
                    <span>Grand Total:</span>
                    <span class="text-green-800">₱{{ selectedOrder.total.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Payment Status:</span>
                    <span :class="selectedOrder.payment.status === 'Paid' ? 'text-green-600' : 'text-red-600'" class="font-bold">
                      {{ selectedOrder.payment.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Timeline -->
            <div class="mb-6">
              <h4 class="font-black text-lg mb-4">Order Timeline</h4>
              <p class="text-gray-600 mb-4">Track your order progress in real time.</p>
              <div class="space-y-4">
                <div v-for="(step, index) in selectedOrder.timeline" :key="index"
                     class="flex items-center gap-4">
                  <div :class="step.completed ? 'bg-green-600' : 'bg-gray-300'"
                       class="w-4 h-4 rounded-full flex-shrink-0"></div>
                  <div class="flex-1">
                    <p :class="step.completed ? 'text-gray-900' : 'text-gray-500'" class="font-bold">
                      {{ step.title }}
                    </p>
                    <p class="text-sm text-gray-500">{{ step.time }}</p>
                  </div>
                  <div v-if="step.completed" class="text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4">
              <button v-if="selectedOrder.status === 'Preparing' || selectedOrder.status === 'Pending'"
                      class="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">
                Cancel Order
              </button>
              <button v-if="selectedOrder.status === 'Delivered'"
                      class="px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition">
                Confirm Receipt
              </button>
              <button class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                Contact Support
              </button>
              <button class="px-6 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition">
                Reorder
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Order Tracking Modal -->
      <div v-if="trackingModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-scroll">
          <div class="p-8">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-black">Track Order #{{ trackingOrder?.id }}</h3>
              <button @click="closeTrackingModal" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <div v-if="trackingOrder" class="space-y-8">
              <!-- Current Status -->
              <div class="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 border border-green-100">
                <div class="flex items-center gap-4 mb-4">
                  <div :class="getStatusIcon(trackingOrder.status)" class="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg">
                    <span class="text-2xl">{{ getStatusEmoji(trackingOrder.status) }}</span>
                  </div>
                  <div>
                    <h4 class="font-black text-xl text-gray-900">{{ trackingOrder.status }}</h4>
                    <p class="text-gray-600">{{ getStatusMessage(trackingOrder.status) }}</p>
                    <p class="text-sm text-gray-500 mt-1">Estimated delivery: {{ trackingOrder.estimatedDelivery || 'TBD' }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Tracking Progress -->
              <div class="bg-white border border-gray-100 rounded-2xl p-6">
                <h4 class="font-black text-lg mb-6">Order Progress</h4>
                <div class="relative">
                  <!-- Progress Bar -->
                  <div class="w-full bg-gray-200 rounded-full h-3 mb-8">
                    <div :class="getProgressBarColor(trackingOrder.status)"
                         class="h-3 rounded-full transition-all duration-1000 ease-out"
                         :style="{ width: getProgressPercentage(trackingOrder.status) + '%' }"></div>
                  </div>
  
                  <!-- Timeline Steps -->
                  <div class="space-y-6">
                    <div v-for="(step, index) in trackingOrder.timeline" :key="index"
                         class="flex items-start gap-4">
                      <div :class="step.completed ? 'bg-green-600' : step.current ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'"
                           class="w-5 h-5 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                        <div v-if="step.completed" class="w-2 h-2 bg-white rounded-full"></div>
                        <div v-else-if="step.current" class="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      </div>
                      <div class="flex-1 pb-6">
                        <div class="flex items-center justify-between">
                          <p :class="step.completed ? 'text-gray-900' : step.current ? 'text-blue-600' : 'text-gray-500'"
                             class="font-bold text-lg">
                            {{ step.title }}
                          </p>
                          <span :class="step.completed ? 'text-green-600' : step.current ? 'text-blue-600' : 'text-gray-400'"
                                class="text-sm font-medium">
                            {{ step.time }}
                          </span>
                        </div>
                        <p class="text-gray-600 mt-1">{{ step.description || getStepDescription(step.title) }}</p>
                        <div v-if="step.location" class="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {{ step.location }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Delivery Information -->
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-white border border-gray-100 rounded-2xl p-6">
                  <h4 class="font-black text-lg mb-4">Delivery Details</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Courier:</span>
                      <span class="font-bold">{{ trackingOrder.courier || 'Bulawang Ani Logistics' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Tracking Number:</span>
                      <span class="font-bold font-mono">{{ trackingOrder.trackingNumber || 'BA' + trackingOrder.id }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Estimated Delivery:</span>
                      <span class="font-bold">{{ trackingOrder.estimatedDelivery || 'Within 2-3 days' }}</span>
                    </div>
                  </div>
                </div>
  
                <div class="bg-white border border-gray-100 rounded-2xl p-6">
                  <h4 class="font-black text-lg mb-4">Delivery Address</h4>
                  <div class="text-gray-900">
                    <p class="font-bold">{{ trackingOrder.delivery.name }}</p>
                    <p>{{ trackingOrder.delivery.phone }}</p>
                    <p>{{ trackingOrder.delivery.address }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-4 pt-4">
                <button @click="viewOrderDetails(trackingOrder); closeTrackingModal()"
                        class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                  View Full Details
                </button>
                <button class="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition">
                  Contact Courier
                </button>
                <button class="px-6 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition">
                  Download Receipt
                </button>
              </div>
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
import { ref, onMounted } from 'vue';
import LoadingSpinner from '../Components/LoadingSpinner.vue';

const isMobileMenuOpen = ref(false);
const isLoading = ref(true);

// Simulate loading delay
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

import { useOrdersStore } from '../stores/orders'
import { useCartStore } from '../stores/cart'

const ordersStore = useOrdersStore()
const cartStore = useCartStore()
const selectedOrder = ref(null);
const trackingModalOpen = ref(false);
const trackingOrder = ref(null);

const viewOrderDetails = (order) => {
  selectedOrder.value = order;
};

const closeOrderDetails = () => {
  selectedOrder.value = null;
};

const trackOrder = (order) => {
  trackingOrder.value = order;
  trackingModalOpen.value = true;
};

const closeTrackingModal = () => {
  trackingModalOpen.value = false;
  trackingOrder.value = null;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered': return 'text-green-600';
    case 'On the Way': return 'text-blue-600';
    case 'Preparing': return 'text-yellow-600';
    case 'Pending': return 'text-gray-600';
    case 'Cancelled': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Delivered': return 'bg-green-600';
    case 'On the Way': return 'bg-blue-600';
    case 'Preparing': return 'bg-yellow-600';
    case 'Pending': return 'bg-gray-600';
    case 'Cancelled': return 'bg-red-600';
    default: return 'bg-gray-600';
  }
};

const getStatusEmoji = (status) => {
  switch (status) {
    case 'Delivered': return '✅';
    case 'On the Way': return '🚚';
    case 'Preparing': return '📦';
    case 'Pending': return '🕒';
    case 'Cancelled': return '❌';
    default: return '🕒';
  }
};

const getStatusMessage = (status) => {
  switch (status) {
    case 'Delivered': return 'Your order has been successfully delivered.';
    case 'On the Way': return 'Your order is out for delivery.';
    case 'Preparing': return 'Your order is currently being prepared.';
    case 'Pending': return 'Your order has been received and is pending processing.';
    case 'Cancelled': return 'This order has been cancelled.';
    default: return 'Order status unknown.';
  }
};

const getProgressPercentage = (status) => {
  switch (status) {
    case 'Pending': return 10;
    case 'Preparing': return 30;
    case 'On the Way': return 70;
    case 'Delivered': return 100;
    case 'Cancelled': return 0;
    default: return 0;
  }
};

const getProgressBarColor = (status) => {
  switch (status) {
    case 'Delivered': return 'bg-green-600';
    case 'On the Way': return 'bg-blue-600';
    case 'Preparing': return 'bg-yellow-600';
    case 'Pending': return 'bg-gray-600';
    case 'Cancelled': return 'bg-red-600';
    default: return 'bg-gray-600';
  }
};

const getStepDescription = (title) => {
  switch (title) {
    case 'Order Placed': return 'Your order has been received and is being processed.';
    case 'Payment Confirmed': return 'Your payment has been verified and processed.';
    case 'Order Confirmed': return 'Your order details have been confirmed by our team.';
    case 'Preparing Order': return 'Your items are being carefully packed for shipment.';
    case 'Quality Check': return 'Final quality inspection before shipping.';
    case 'Shipped': return 'Your order has been handed over to our delivery partner.';
    case 'Out for Delivery': return 'Your order is on its way to your location.';
    case 'Delivered': return 'Your order has been successfully delivered.';
    default: return 'Processing your order...';
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Hide modal scrollbar */
.modal-scroll::-webkit-scrollbar {
  display: none;
}
.modal-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom extra-small breakpoint for very narrow devices */
@media (max-width: 400px) {
  .xs\:inline { display: inline; }
}
</style>
