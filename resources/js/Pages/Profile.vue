<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-yellow-50 font-sans">
    <!-- Header -->
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
            <router-link to="/profile" class="text-green-700 font-black border-b-2 border-green-700 transition pb-1">Profile</router-link>
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
            <router-link to="/orders" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              Orders
            </router-link>
            <router-link to="/profile" @click="closeMobileMenu" class="block px-4 py-3 bg-green-50 text-green-700 rounded-xl font-bold transition">
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
              My Account
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="relative py-24 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative max-w-7xl mx-auto px-4 text-center">
        <div class="mb-8">
          <div class="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span class="text-sm font-bold">Welcome Back</span>
          </div>
        </div>
        <div class="flex justify-center mb-8">
          <div class="w-32 h-32 bg-gradient-to-br from-green-600 to-yellow-400 rounded-full shadow-2xl border-4 border-white flex items-center justify-center">
            <span class="text-6xl font-black text-white">👨‍🌾</span>
          </div>
        </div>
        <h1 class="text-6xl font-black mb-4">Maria Santos</h1>
        <p class="text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
          Connecting you with the freshest harvests from our local farming community
        </p>
        <div class="mt-8 flex justify-center gap-6">
          <div class="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <span class="text-sm">Member since 2024</span>
          </div>
          <div class="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <span class="text-sm">12 Orders Completed</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Overview -->
    <section id="overview" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border border-green-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-black text-green-800 mb-2">₱12,450</h3>
                <p class="text-sm text-green-600 font-bold">Total Spent</p>
              </div>
              <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-8 border border-yellow-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-black text-yellow-800 mb-2">15</h3>
                <p class="text-sm text-yellow-600 font-bold">Products Loved</p>
              </div>
              <div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 border border-orange-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-black text-orange-800 mb-2">8</h3>
                <p class="text-sm text-orange-600 font-bold">Active Orders</p>
              </div>
              <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-black text-slate-800 mb-2">VIP</h3>
                <p class="text-sm text-slate-600 font-bold">Member Level</p>
              </div>
              <div class="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Orders Section -->
    <section id="orders" class="py-16 bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Recent Orders</h2>
          <p class="text-lg text-gray-600">Track your recent purchases and delivery status</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Order Card 1 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-xl font-black text-gray-900 mb-2">Order #BN-2024-001</h3>
                <p class="text-sm text-gray-500">Placed on December 15, 2024</p>
              </div>
              <div class="text-right">
                <span class="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full">Delivered</span>
                <p class="text-sm text-gray-500 mt-1">Dec 18, 2024</p>
              </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-green-50 rounded-xl p-4 text-center">
                <div class="w-16 h-16 bg-gradient-to-br from-green-200 to-yellow-200 rounded-lg mx-auto mb-3"></div>
                <p class="font-bold text-sm">Organic Rice</p>
                <p class="text-xs text-gray-500">5kg</p>
              </div>
              <div class="bg-yellow-50 rounded-xl p-4 text-center">
                <div class="w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg mx-auto mb-3"></div>
                <p class="font-bold text-sm">Fresh Mangoes</p>
                <p class="text-xs text-gray-500">1kg</p>
              </div>
              <div class="bg-orange-50 rounded-xl p-4 text-center">
                <div class="w-16 h-16 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg mx-auto mb-3"></div>
                <p class="font-bold text-sm">Free-Range Eggs</p>
                <p class="text-xs text-gray-500">1 dozen</p>
              </div>
            </div>

            <div class="flex justify-between items-center border-t border-gray-100 pt-4">
              <div>
                <p class="text-sm text-gray-500">Total Amount</p>
                <p class="text-2xl font-black text-green-700">₱1,250.00</p>
              </div>
              <button class="bg-green-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-800 transition">
                View Details
              </button>
            </div>
          </div>

          <!-- Order Card 2 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-xl font-black text-gray-900 mb-2">Order #BN-2024-002</h3>
                <p class="text-sm text-gray-500">Placed on December 20, 2024</p>
              </div>
              <div class="text-right">
                <span class="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full">In Transit</span>
                <p class="text-sm text-gray-500 mt-1">Expected: Dec 22</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-green-50 rounded-xl p-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-green-200 to-yellow-200 rounded-lg"></div>
                  <div>
                    <p class="font-bold text-sm">Brown Rice</p>
                    <p class="text-xs text-gray-500">2kg</p>
                  </div>
                </div>
              </div>
              <div class="bg-yellow-50 rounded-xl p-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg"></div>
                  <div>
                    <p class="font-bold text-sm">Bananas</p>
                    <p class="text-xs text-gray-500">3kg</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center border-t border-gray-100 pt-4">
              <div>
                <p class="text-sm text-gray-500">Total Amount</p>
                <p class="text-2xl font-black text-green-700">₱850.00</p>
              </div>
              <button class="bg-yellow-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-yellow-700 transition">
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Wishlist Section -->
    <section id="wishlist" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Your Wishlist</h2>
          <p class="text-lg text-gray-600">Products you've marked for future purchase</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Wishlist Item 1 -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 border border-green-200 hover:shadow-lg transition">
            <div class="relative mb-4">
              <div class="w-full h-48 bg-gradient-to-br from-green-200 to-yellow-200 rounded-2xl"></div>
              <button class="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div class="space-y-3">
              <h3 class="text-lg font-black text-green-800">Organic Jasmine Rice</h3>
              <p class="text-sm text-green-600">Premium quality, farm-fresh</p>
              <div class="flex justify-between items-center">
                <span class="text-xl font-black text-green-700">₱240/kg</span>
                <button class="bg-green-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-800 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <!-- Wishlist Item 2 -->
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-6 border border-yellow-200 hover:shadow-lg transition">
            <div class="relative mb-4">
              <div class="w-full h-48 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl"></div>
              <button class="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div class="space-y-3">
              <h3 class="text-lg font-black text-yellow-800">Cavendish Bananas</h3>
              <p class="text-sm text-yellow-600">Sweet and ripe, perfect for smoothies</p>
              <div class="flex justify-between items-center">
                <span class="text-xl font-black text-yellow-700">₱60/kg</span>
                <button class="bg-yellow-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-yellow-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <!-- Wishlist Item 3 -->
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200 hover:shadow-lg transition">
            <div class="relative mb-4">
              <div class="w-full h-48 bg-gradient-to-br from-orange-200 to-red-200 rounded-2xl"></div>
              <button class="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div class="space-y-3">
              <h3 class="text-lg font-black text-orange-800">Free-Range Eggs</h3>
              <p class="text-sm text-orange-600">Farm-fresh, nutritious</p>
              <div class="flex justify-between items-center">
                <span class="text-xl font-black text-orange-700">₱120/dozen</span>
                <button class="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Settings Section -->
    <section id="settings" class="py-16 bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Account Settings</h2>
          <p class="text-lg text-gray-600">Manage your preferences and account information</p>
        </div>

        <div class="space-y-6">
          <!-- Personal Information -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
            <h3 class="text-2xl font-black text-gray-900 mb-6">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input type="text" value="Maria Santos" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input type="email" value="maria.santos@example.com" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" value="+63 912 345 6789" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                <input type="date" value="1985-06-15" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
            </div>
          </div>

          <!-- Address Information -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
            <h3 class="text-2xl font-black text-gray-900 mb-6">Address Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                <input type="text" value="123 Farm Road, Barangay San Isidro" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">City/Municipality</label>
                <input type="text" value="San Jose del Monte" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Province</label>
                <input type="text" value="Bulacan" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Postal Code</label>
                <input type="text" value="3023" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Country</label>
                <input type="text" value="Philippines" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
            <h3 class="text-2xl font-black text-gray-900 mb-6">Preferences</h3>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-gray-800">Email Notifications</h4>
                  <p class="text-sm text-gray-600">Receive updates about your orders and promotions</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-gray-800">SMS Notifications</h4>
                  <p class="text-sm text-gray-600">Get delivery updates via text message</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-gray-800">Newsletter</h4>
                  <p class="text-sm text-gray-600">Subscribe to our weekly newsletter</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <button class="flex-1 bg-green-700 text-white py-4 px-8 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-green-800 transition shadow-lg">
              Save Changes
            </button>
            <button class="flex-1 bg-gray-200 text-gray-700 py-4 px-8 rounded-xl font-bold hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-green-700 to-green-800 rounded-xl flex items-center justify-center">
                <span class="text-yellow-400 font-bold text-lg">B</span>
              </div>
              <div>
                <h3 class="text-xl font-black text-green-800">Bulawang <span class="text-yellow-600">Ani</span></h3>
                <p class="text-xs text-gray-500">Your Account</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              Managing your connection to our farming community and tracking your journey with fresh, local produce.
            </p>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Account</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#overview" class="hover:text-green-700 transition">Overview</a></li>
              <li><a href="#orders" class="hover:text-green-700 transition">Orders</a></li>
              <li><a href="#wishlist" class="hover:text-green-700 transition">Wishlist</a></li>
              <li><a href="#settings" class="hover:text-green-700 transition">Settings</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Support</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#" class="hover:text-green-700 transition">Help Center</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Delivery Info</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Returns</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Farmers</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#" class="hover:text-green-700 transition">Join Our Network</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Farmer Resources</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Sustainability</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Community</a></li>
            </ul>
          </div>
        </div>

        <div class="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
          <p>© 2026 Bulawang Ani Philippines. Supporting our local heroes.</p>
          <div class="flex gap-8">
            <a href="#" class="hover:text-green-700 transition">Privacy Policy</a>
            <a href="#" class="hover:text-green-700 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '../stores/cart'
import LoadingSpinner from '../Components/LoadingSpinner.vue';

const cartStore = useCartStore()

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
</script>

<style scoped>
/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation for stats cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
</style>