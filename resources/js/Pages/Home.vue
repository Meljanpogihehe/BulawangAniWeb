<template>
  <!-- Loading State -->
  <LoadingSpinner v-if="isLoading" />
  
  <!-- Content -->
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
            <router-link to="/" class="text-green-700 font-black border-b-2 border-green-700 transition pb-1">Home</router-link>
            <router-link to="/products" class="hover:text-green-700 transition">Products</router-link>
            <router-link to="/orders" class="hover:text-green-700 transition">Orders</router-link>
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
            <router-link to="/" @click="closeMobileMenu" class="block px-4 py-3 bg-green-50 text-green-700 rounded-xl font-bold transition">
              Home
            </router-link>
            <router-link to="/products" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              Products
            </router-link>
            <router-link to="/orders" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
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
            <router-link to="/design" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              Design
            </router-link>
          </nav>

          <div class="mt-8 pt-8 border-t border-gray-200">
            <button @click="closeMobileMenu" class="block text-center w-full px-6 py-3 bg-green-700 text-white rounded-xl font-bold text-sm hover:bg-green-800 transition shadow-lg">
              My Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <section class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-8">
          <div class="space-y-4">
            <h1 class="text-5xl md:text-6xl font-black leading-tight">Fresh <span class="text-green-700">Harvest</span> Delivered to Your Door</h1>
            <p class="text-lg md:text-xl text-gray-600 leading-relaxed">Pioneering the future of Philippine agriculture by connecting the soil to the soul of the city. We believe in fair pay, fresh food, and full transparency.</p>
          </div>

          <div class="flex flex-wrap gap-4">
            <button class="bg-green-700 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Shop Now
            </button>
            <button class="bg-white text-green-700 px-8 py-4 rounded-2xl font-black text-lg hover:bg-green-50 transition-all border border-green-200">
              Learn More
            </button>
          </div>

          <div class="flex items-center gap-8 text-sm text-gray-500 font-bold">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>100% Fresh</span>
            </div>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Direct from Farmers</span>
            </div>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-green-100 rounded-2xl p-6">
              <div class="w-16 h-16 bg-green-600 rounded-xl mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 class="font-black text-lg mb-2">Same Day Delivery</h3>
              <p class="text-sm text-gray-600">Order by 2PM and get your fresh produce delivered the same day.</p>
            </div>
            <div class="bg-yellow-100 rounded-2xl p-6">
              <div class="w-16 h-16 bg-yellow-600 rounded-xl mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 class="font-black text-lg mb-2">Sunshine Guaranteed</h3>
              <p class="text-sm text-gray-600">Every product is grown with care and harvested at peak freshness.</p>
            </div>
            <div class="bg-blue-100 rounded-2xl p-6">
              <div class="w-16 h-16 bg-blue-600 rounded-xl mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="font-black text-lg mb-2">Farmer Support</h3>
              <p class="text-sm text-gray-600">We support local farmers with fair prices and sustainable practices.</p>
            </div>
            <div class="bg-purple-100 rounded-2xl p-6">
              <div class="w-16 h-16 bg-purple-600 rounded-xl mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="font-black text-lg mb-2">Quality Assured</h3>
              <p class="text-sm text-gray-600">Every item is inspected for quality and freshness.</p>
            </div>
          </div>
          <div class="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-black mb-4">Our <span class="text-green-700">Products</span></h2>
        <p class="text-lg text-gray-600">Discover the freshest produce from our partner farmers across the Philippines.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div class="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-green-200 transition-all group flex flex-col">
          <div class="h-64 relative overflow-hidden bg-gray-50">
            <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800" alt="Premium Dinorado Rice" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">

            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span class="bg-green-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg shadow-green-900/20">Fresh Picked</span>
              <span class="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase shadow-lg shadow-red-900/20">Only 5 left</span>
            </div>

            <button class="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl hover:bg-green-700 hover:text-white transition-all transform group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div class="p-6 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Grains</span>
                <span class="flex items-center text-xs font-bold text-gray-400">⭐ 4.9 (120+)</span>
            </div>
            <h4 class="text-lg font-black text-gray-900 leading-snug mb-2 group-hover:text-green-700 transition">Premium Dinorado Rice</h4>
            <p class="text-xs text-gray-500 mb-6 font-medium">📍 Origin: Isabela</p>

            <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
              <div>
                <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-black text-green-800">₱2,250</span>
                    <span class="text-xs text-gray-400 line-through">₱2,400</span>
                </div>
                <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-tighter">Verified Weight: 25kg bag</span>
              </div>
              <button class="bg-green-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-900 transition-all shadow-lg shadow-green-100 hover:shadow-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-green-200 transition-all group flex flex-col">
          <div class="h-64 relative overflow-hidden bg-gray-50">
            <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800" alt="Organic Benguet Tomatoes" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">

            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span class="bg-green-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg shadow-green-900/20">Fresh Picked</span>
            </div>

            <button class="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl hover:bg-green-700 hover:text-white transition-all transform group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div class="p-6 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Vegetables</span>
                <span class="flex items-center text-xs font-bold text-gray-400">⭐ 4.8 (85)</span>
            </div>
            <h4 class="text-lg font-black text-gray-900 leading-snug mb-2 group-hover:text-green-700 transition">Organic Benguet Tomatoes</h4>
            <p class="text-xs text-gray-500 mb-6 font-medium">📍 Origin: Benguet</p>

            <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
              <div>
                <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-black text-green-800">₱120</span>
                </div>
                <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-tighter">Verified Weight: kg</span>
              </div>
              <button class="bg-green-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-900 transition-all shadow-lg shadow-green-100 hover:shadow-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-green-200 transition-all group flex flex-col">
          <div class="h-64 relative overflow-hidden bg-gray-50">
            <img src="https://images.unsplash.com/photo-1571771894821-ad99026107b8?auto=format&fit=crop&q=80&w=800" alt="Davao Golden Bananas" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">

            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span class="bg-green-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg shadow-green-900/20">Fresh Picked</span>
            </div>

            <button class="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl hover:bg-green-700 hover:text-white transition-all transform group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div class="p-6 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Fruits</span>
                <span class="flex items-center text-xs font-bold text-gray-400">⭐ 4.7 (200+)</span>
            </div>
            <h4 class="text-lg font-black text-gray-900 leading-snug mb-2 group-hover:text-green-700 transition">Davao Golden Bananas</h4>
            <p class="text-xs text-gray-500 mb-6 font-medium">📍 Origin: Davao City</p>

            <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
              <div>
                <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-black text-green-800">₱85</span>
                </div>
                <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-tighter">Verified Weight: bunch</span>
              </div>
              <button class="bg-green-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-900 transition-all shadow-lg shadow-green-100 hover:shadow-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-green-200 transition-all group flex flex-col">
          <div class="h-64 relative overflow-hidden bg-gray-50">
            <img src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800" alt="Wild Bukidnon Honey" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">

            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span class="bg-green-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg shadow-green-900/20">Fresh Picked</span>
            </div>

            <button class="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl hover:bg-green-700 hover:text-white transition-all transform group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div class="p-6 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Organic</span>
                <span class="flex items-center text-xs font-bold text-gray-400">⭐ 5.0 (50)</span>
            </div>
            <h4 class="text-lg font-black text-gray-900 leading-snug mb-2 group-hover:text-green-700 transition">Wild Bukidnon Honey</h4>
            <p class="text-xs text-gray-500 mb-6 font-medium">📍 Origin: Bukidnon</p>

            <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
              <div>
                <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-black text-green-800">₱450</span>
                </div>
                <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-tighter">Verified Weight: 500ml</span>
              </div>
              <button class="bg-green-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-900 transition-all shadow-lg shadow-green-100 hover:shadow-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-12">
        <router-link to="/products" class="inline-block bg-green-700 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          View All Products
        </router-link>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <img src="https://images.yummy.ph/yummy/uploads/2018/05/salamat-sa-ani-0001.jpg" alt="Farmer with fresh produce" class="w-full rounded-[2rem] shadow-2xl">
        </div>
        <div class="space-y-8">
          <div class="space-y-4">
            <h2 class="text-4xl font-black">Supporting <span class="text-green-700">Local Farmers</span></h2>
            <p class="text-lg text-gray-600 leading-relaxed">We work directly with farmers across the Philippines to bring you the freshest produce while ensuring fair compensation and sustainable farming practices.</p>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white rounded-xl p-6 border border-gray-100">
              <div class="text-3xl font-black text-green-700 mb-2">1,500+</div>
              <div class="text-sm text-gray-600 font-bold">Partner Farmers</div>
            </div>
            <div class="bg-white rounded-xl p-6 border border-gray-100">
              <div class="text-3xl font-black text-green-700 mb-2">50,000+</div>
              <div class="text-sm text-gray-600 font-bold">Happy Customers</div>
            </div>
            <div class="bg-white rounded-xl p-6 border border-gray-100">
              <div class="text-3xl font-black text-green-700 mb-2">250+</div>
              <div class="text-sm text-gray-600 font-bold">Product Varieties</div>
            </div>
            <div class="bg-white rounded-xl p-6 border border-gray-100">
              <div class="text-3xl font-black text-green-700 mb-2">45%</div>
              <div class="text-sm text-gray-600 font-bold">Carbon Reduction</div>
            </div>
          </div>

          <div class="flex flex-wrap gap-4">
            <button class="bg-green-700 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Join Our Mission
            </button>
            <button class="bg-white text-green-700 px-8 py-4 rounded-2xl font-black text-lg hover:bg-green-50 transition-all border border-green-200">
              Learn About Farmers
            </button>
          </div>
        </div>
      </div>
    </section>

    <footer class="bg-white border-t pt-20 pb-10">
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
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import LoadingSpinner from '../Components/LoadingSpinner.vue'

const cartStore = useCartStore()
const isMobileMenuOpen = ref(false)
const isLoading = ref(true)

// Simulate loading delay
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Custom extra-small breakpoint for very narrow devices */
@media (max-width: 400px) {
  .xs\:inline { display: inline; }
}
</style>