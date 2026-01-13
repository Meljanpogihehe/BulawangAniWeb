<template>
  <!-- Loading State -->
  <LoadingSpinner v-if="isLoading" />
  
  <!-- Content -->
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
            <router-link to="/profile" class="hover:text-green-700 transition">Profile</router-link>
            <router-link to="/about" class="text-green-700 font-black border-b-2 border-green-700 transition pb-1">About</router-link>
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
            <router-link to="/profile" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              Profile
            </router-link>
            <router-link to="/about" @click="closeMobileMenu" class="block px-4 py-3 bg-green-50 text-green-700 rounded-xl font-bold transition">
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
            <span class="text-sm font-bold">Since 2020</span>
          </div>
        </div>
        <h1 class="text-6xl font-black mb-6">Our Story</h1>
        <p class="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
          Born from a simple idea to bridge the gap between farmers and city dwellers, 
          we've grown into a movement that's changing how Filipinos connect with their food.
        </p>
        <div class="mt-12 flex justify-center gap-8">
          <div class="text-center">
            <div class="text-4xl font-black text-yellow-400 mb-2">500+</div>
            <div class="text-sm text-white/80">Partner Farmers</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-black text-green-300 mb-2">100K+</div>
            <div class="text-sm text-white/80">Happy Customers</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-black text-orange-300 mb-2">10+</div>
            <div class="text-sm text-white/80">Provinces</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Mission Section -->
    <section id="mission" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-5xl font-black text-gray-900 mb-8">Our Mission</h2>
            <div class="space-y-6">
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border border-green-200">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-black text-green-800">Connect Communities</h3>
                    <p class="text-sm text-green-600">Building bridges between rural farmers and urban consumers</p>
                  </div>
                </div>
                <p class="text-gray-700 leading-relaxed">
                  We believe that every Filipino deserves access to fresh, nutritious food 
                  while ensuring our farmers receive fair compensation for their hard work.
                </p>
              </div>

              <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-8 border border-yellow-200">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-black text-yellow-800">Innovate Agriculture</h3>
                    <p class="text-sm text-yellow-600">Bringing technology to traditional farming practices</p>
                  </div>
                </div>
                <p class="text-gray-700 leading-relaxed">
                  By leveraging modern technology, we help farmers optimize their yields, 
                  reduce waste, and reach wider markets with their harvests.
                </p>
              </div>

              <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 border border-orange-200">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-black text-orange-800">Sustainable Future</h3>
                    <p class="text-sm text-orange-600">Promoting eco-friendly farming and consumption</p>
                  </div>
                </div>
                <p class="text-gray-700 leading-relaxed">
                  We're committed to sustainable practices that protect our environment 
                  while ensuring food security for generations to come.
                </p>
              </div>
            </div>
          </div>
          
          <div class="relative">
            <div class="grid grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-green-200 to-yellow-200 rounded-2xl p-6 shadow-lg">
                <div class="text-3xl font-black text-green-800 mb-2">🌾</div>
                <h4 class="font-black text-green-800 mb-2">Farm-Fresh</h4>
                <p class="text-sm text-green-600">Direct from farm to table</p>
              </div>
              <div class="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl p-6 shadow-lg">
                <div class="text-3xl font-black text-yellow-800 mb-2">🍎</div>
                <h4 class="font-black text-yellow-800 mb-2">Organic</h4>
                <p class="text-sm text-yellow-600">Chemical-free produce</p>
              </div>
              <div class="bg-gradient-to-br from-orange-200 to-red-200 rounded-2xl p-6 shadow-lg">
                <div class="text-3xl font-black text-orange-800 mb-2">🐔</div>
                <h4 class="font-black text-orange-800 mb-2">Free-Range</h4>
                <p class="text-sm text-orange-600">Humane animal care</p>
              </div>
              <div class="bg-gradient-to-br from-red-200 to-purple-200 rounded-2xl p-6 shadow-lg">
                <div class="text-3xl font-black text-red-800 mb-2">♻️</div>
                <h4 class="font-black text-red-800 mb-2">Sustainable</h4>
                <p class="text-sm text-red-600">Eco-conscious practices</p>
              </div>
            </div>
            <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full opacity-20"></div>
            <div class="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Impact Section -->
    <section id="impact" class="py-20 bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Our Impact</h2>
          <p class="text-lg text-gray-600">Measurable change through sustainable agriculture</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Impact Card 1 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition">
            <div class="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-3xl font-black text-green-700 mb-2">₱150M+</div>
              <div class="text-sm text-gray-600 font-bold uppercase tracking-widest">Farmers' Income</div>
              <p class="text-xs text-gray-500 mt-2">Generated for local farming communities</p>
            </div>
          </div>

          <!-- Impact Card 2 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition">
            <div class="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-3xl font-black text-yellow-700 mb-2">500+</div>
              <div class="text-sm text-gray-600 font-bold uppercase tracking-widest">Partner Farmers</div>
              <p class="text-xs text-gray-500 mt-2">Small-scale farmers in our network</p>
            </div>
          </div>

          <!-- Impact Card 3 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition">
            <div class="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-3xl font-black text-orange-700 mb-2">10+</div>
              <div class="text-sm text-gray-600 font-bold uppercase tracking-widest">Provinces</div>
              <p class="text-xs text-gray-500 mt-2">Across Luzon, Visayas, and Mindanao</p>
            </div>
          </div>

          <!-- Impact Card 4 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition">
            <div class="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-3xl font-black text-red-700 mb-2">100K+</div>
              <div class="text-sm text-gray-600 font-bold uppercase tracking-widest">Happy Families</div>
              <p class="text-xs text-gray-500 mt-2">Enjoying fresh, nutritious food</p>
            </div>
          </div>
        </div>

        <!-- Impact Timeline -->
        <div class="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
          <h3 class="text-2xl font-black text-gray-900 mb-8 text-center">Our Journey</h3>
          <div class="relative">
            <div class="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-yellow-400 to-orange-400 transform -translate-x-1/2"></div>
            
            <div class="space-y-12">
              <!-- 2020 -->
              <div class="relative flex items-center justify-between">
                <div class="w-1/2 pr-8 text-right">
                  <div class="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <div class="text-sm font-black text-green-800 mb-2">2020</div>
                    <div class="text-lg font-black text-green-900 mb-2">The Beginning</div>
                    <p class="text-sm text-green-700">Started with 5 farmers in Bulacan, connecting them directly to Manila consumers.</p>
                  </div>
                </div>
                <div class="absolute left-1/2 top-0 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-2 border-4 border-white shadow-lg"></div>
                <div class="w-1/2 pl-8"></div>
              </div>

              <!-- 2021 -->
              <div class="relative flex items-center justify-between">
                <div class="w-1/2 pl-8">
                  <div class="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                    <div class="text-sm font-black text-yellow-800 mb-2">2021</div>
                    <div class="text-lg font-black text-yellow-900 mb-2">Expansion</div>
                    <p class="text-sm text-yellow-700">Grew to 50 farmers across 3 provinces, launched our mobile app.</p>
                  </div>
                </div>
                <div class="absolute left-1/2 top-0 w-4 h-4 bg-yellow-500 rounded-full transform -translate-x-1/2 -translate-y-2 border-4 border-white shadow-lg"></div>
                <div class="w-1/2 pr-8 text-right"></div>
              </div>

              <!-- 2022 -->
              <div class="relative flex items-center justify-between">
                <div class="w-1/2 pr-8 text-right">
                  <div class="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                    <div class="text-sm font-black text-orange-800 mb-2">2022</div>
                    <div class="text-lg font-black text-orange-900 mb-2">Technology</div>
                    <p class="text-sm text-orange-700">Implemented blockchain for supply chain transparency and quality assurance.</p>
                  </div>
                </div>
                <div class="absolute left-1/2 top-0 w-4 h-4 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-2 border-4 border-white shadow-lg"></div>
                <div class="w-1/2 pl-8"></div>
              </div>

              <!-- 2023 -->
              <div class="relative flex items-center justify-between">
                <div class="w-1/2 pl-8">
                  <div class="bg-red-50 rounded-2xl p-6 border border-red-200">
                    <div class="text-sm font-black text-red-800 mb-2">2023</div>
                    <div class="text-lg font-black text-red-900 mb-2">Recognition</div>
                    <p class="text-sm text-red-700">Awarded Best Agri-Tech Startup, expanded to 10 provinces.</p>
                  </div>
                </div>
                <div class="absolute left-1/2 top-0 w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-2 border-4 border-white shadow-lg"></div>
                <div class="w-1/2 pr-8 text-right"></div>
              </div>

              <!-- 2024 -->
              <div class="relative flex items-center justify-between">
                <div class="w-1/2 pr-8 text-right">
                  <div class="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                    <div class="text-sm font-black text-purple-800 mb-2">2024</div>
                    <div class="text-lg font-black text-purple-900 mb-2">Sustainability</div>
                    <p class="text-sm text-purple-700">Achieved carbon-neutral operations, serving 100,000+ families.</p>
                  </div>
                </div>
                <div class="absolute left-1/2 top-0 w-4 h-4 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-2 border-4 border-white shadow-lg"></div>
                <div class="w-1/2 pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Team Section -->
    <section id="team" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Our Team</h2>
          <p class="text-lg text-gray-600">Passionate individuals driving agricultural innovation</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Team Member 1 -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 border border-green-200 hover:shadow-xl transition">
            <div class="text-center">
              <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full mx-auto mb-4 shadow-lg"></div>
              <h3 class="text-lg font-black text-green-800 mb-2">Maria Dela Cruz</h3>
              <p class="text-sm text-green-600 font-bold mb-2">CEO & Founder</p>
              <p class="text-xs text-gray-600 leading-relaxed">
                Former agri-economist with 15 years of experience in sustainable agriculture development.
              </p>
              <div class="mt-4 flex justify-center gap-2">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 3a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2h12l4 4-4-4h-3V3z" />
                  </svg>
                </div>
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Member 2 -->
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-6 border border-yellow-200 hover:shadow-xl transition">
            <div class="text-center">
              <div class="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mx-auto mb-4 shadow-lg"></div>
              <h3 class="text-lg font-black text-yellow-800 mb-2">Juan Santos</h3>
              <p class="text-sm text-yellow-600 font-bold mb-2">CTO</p>
              <p class="text-xs text-gray-600 leading-relaxed">
                Tech visionary who built our blockchain-based supply chain tracking system.
              </p>
              <div class="mt-4 flex justify-center gap-2">
                <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Member 3 -->
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200 hover:shadow-xl transition">
            <div class="text-center">
              <div class="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mx-auto mb-4 shadow-lg"></div>
              <h3 class="text-lg font-black text-orange-800 mb-2">Ana Reyes</h3>
              <p class="text-sm text-orange-600 font-bold mb-2">Head of Farmer Relations</p>
              <p class="text-xs text-gray-600 leading-relaxed">
                Former farmer advocate who ensures our partners receive fair treatment and support.
              </p>
              <div class="mt-4 flex justify-center gap-2">
                <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Member 4 -->
          <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 border border-red-200 hover:shadow-xl transition">
            <div class="text-center">
              <div class="w-24 h-24 bg-gradient-to-br from-red-400 to-purple-400 rounded-full mx-auto mb-4 shadow-lg"></div>
              <h3 class="text-lg font-black text-red-800 mb-2">Pedro Gomez</h3>
              <p class="text-sm text-red-600 font-bold mb-2">Logistics Manager</p>
              <p class="text-xs text-gray-600 leading-relaxed">
                Supply chain expert who optimized our delivery network across multiple regions.
              </p>
              <div class="mt-4 flex justify-center gap-2">
                <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Partners Section -->
    <section id="partners" class="py-20 bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Our Partners</h2>
          <p class="text-lg text-gray-600">Collaborating for a better agricultural future</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- Partner 1 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition text-center">
            <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🏛️</span>
            </div>
            <h3 class="font-black text-gray-900 mb-2">DA Philippines</h3>
            <p class="text-sm text-gray-600">Department of Agriculture</p>
          </div>

          <!-- Partner 2 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition text-center">
            <div class="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🏦</span>
            </div>
            <h3 class="font-black text-gray-900 mb-2">LandBank</h3>
            <p class="text-sm text-gray-600">Agricultural Financing</p>
          </div>

          <!-- Partner 3 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition text-center">
            <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🔬</span>
            </div>
            <h3 class="font-black text-gray-900 mb-2">UPLB</h3>
            <p class="text-sm text-gray-600">University of the Philippines</p>
          </div>

          <!-- Partner 4 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition text-center">
            <div class="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🚚</span>
            </div>
            <h3 class="font-black text-gray-900 mb-2">2GO</h3>
            <p class="text-sm text-gray-600">Logistics Partner</p>
          </div>

          <!-- Partner 5 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">📱</span>
            </div>
            <h3 class="font-black text-gray-900 mb-2">GCash</h3>
            <p class="text-sm text-gray-600">Digital Payments</p>
          </div>

          <!-- Partner 6 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🌱</span>
            </div>
            <h3 class="font-black text-gray-900 mb-2">WWF Philippines</h3>
            <p class="text-sm text-gray-600">Sustainability Partner</p>
          </div>

          <!-- Partner 7 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition text-center">
            <div class="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">📊</span>
            </div>
            <h3 class="font-black text-gray-900 mb-2">DTI</h3>
            <p class="text-sm text-gray-600">Trade & Industry</p>
          </div>

          <!-- Partner 8 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition text-center">
            <div class="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🏥</span>
            </div>
            <h3 class="font-black text-gray-900 mb-2">DOH</h3>
            <p class="text-sm text-gray-600">Health Standards</p>
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
                <p class="text-xs text-gray-500">Our Story</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              From humble beginnings to a nationwide movement, we're proud of our journey 
              and excited for what's to come in Philippine agriculture.
            </p>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Company</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#mission" class="hover:text-green-700 transition">Our Mission</a></li>
              <li><a href="#impact" class="hover:text-green-700 transition">Our Impact</a></li>
              <li><a href="#team" class="hover:text-green-700 transition">Our Team</a></li>
              <li><a href="#partners" class="hover:text-green-700 transition">Our Partners</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Careers</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#" class="hover:text-green-700 transition">Join Our Team</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Internships</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Farmer Programs</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Volunteer</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Press</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#" class="hover:text-green-700 transition">News</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Media Kit</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Awards</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Testimonials</a></li>
            </ul>
          </div>
        </div>

        <div class="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
          <p>© 2026 Bulawang Ani Philippines. Our story continues.</p>
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
import { useCartStore } from '../stores/cart';
import LoadingSpinner from '../Components/LoadingSpinner.vue';

const cartStore = useCartStore();

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

/* Animation for timeline */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slideInLeft 0.6s ease-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.6s ease-out;
}
</style>