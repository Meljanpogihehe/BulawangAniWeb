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
            <router-link to="/about" class="hover:text-green-700 transition">About</router-link>
            <router-link to="/contact" class="text-green-700 font-black border-b-2 border-green-700 transition pb-1">Contact</router-link>
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
            <router-link to="/about" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              About
            </router-link>
            <router-link to="/contact" @click="closeMobileMenu" class="block px-4 py-3 bg-green-50 text-green-700 rounded-xl font-bold transition">
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
            <span class="text-sm font-bold">24/7 Support</span>
          </div>
        </div>
        <h1 class="text-6xl font-black mb-6">Get in Touch</h1>
        <p class="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
          We're here to help you connect with the freshest harvests from our local farmers. 
          Reach out to us through any of our channels.
        </p>
        <div class="mt-12 flex justify-center gap-8">
          <div class="text-center">
            <div class="text-3xl font-black text-yellow-400 mb-2">📞</div>
            <div class="text-sm text-white/80">Hotline</div>
            <div class="text-lg font-bold">+63 2 123 4567</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-black text-green-300 mb-2">📧</div>
            <div class="text-sm text-white/80">Email</div>
            <div class="text-lg font-bold">hello@bulawangani.com</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-black text-orange-300 mb-2">💬</div>
            <div class="text-sm text-white/80">Chat</div>
            <div class="text-lg font-bold">Live Support</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section id="contact-form" class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Send Us a Message</h2>
          <p class="text-lg text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="space-y-8">
            <!-- Contact Form -->
            <form class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input type="text" placeholder="Juan" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input type="text" placeholder="Dela Cruz" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input type="email" placeholder="juan.dela.cruz@example.com" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" placeholder="+63 912 345 6789" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <select class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Farming Partnership</option>
                  <option>Technical Issue</option>
                  <option>Media Request</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea rows="6" placeholder="Tell us more about your inquiry..." class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 outline-none transition resize-none"></textarea>
              </div>
              
              <div class="flex items-center gap-4">
                <input type="checkbox" id="newsletter" class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2">
                <label for="newsletter" class="text-sm text-gray-700">Subscribe to our newsletter for updates and special offers</label>
              </div>
              
              <button type="submit" class="w-full bg-green-700 text-white py-4 px-8 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-green-800 transition shadow-lg shadow-green-900/20">
                Send Message
              </button>
            </form>

            <!-- Quick Contact Info -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border border-green-200">
              <h3 class="text-xl font-black text-green-800 mb-6">Quick Contact</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.82 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-green-800">Email</h4>
                    <p class="text-sm text-green-600">hello@bulawangani.com</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-green-800">Phone</h4>
                    <p class="text-sm text-green-600">+63 2 123 4567</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-green-800">Live Chat</h4>
                    <p class="text-sm text-green-600">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Image -->
          <div class="relative">
            <div class="bg-gradient-to-br from-green-200 to-yellow-200 rounded-3xl p-8 shadow-xl">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white rounded-2xl p-6 shadow-lg">
                  <div class="text-3xl font-black text-green-800 mb-4">📞</div>
                  <h4 class="font-black text-green-800 mb-2">Customer Service</h4>
                  <p class="text-sm text-green-600">Mon-Sun: 8AM - 10PM</p>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-lg">
                  <div class="text-3xl font-black text-yellow-800 mb-4">📧</div>
                  <h4 class="font-black text-yellow-800 mb-2">Email Support</h4>
                  <p class="text-sm text-yellow-600">Response within 24 hours</p>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-lg">
                  <div class="text-3xl font-black text-orange-800 mb-4">💬</div>
                  <h4 class="font-black text-orange-800 mb-2">Live Chat</h4>
                  <p class="text-sm text-orange-600">Instant response</p>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-lg">
                  <div class="text-3xl font-black text-red-800 mb-4">📱</div>
                  <h4 class="font-black text-red-800 mb-2">Social Media</h4>
                  <p class="text-sm text-red-600">Follow us for updates</p>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full opacity-20"></div>
            <div class="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Locations Section -->
    <section id="locations" class="py-20 bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Our Locations</h2>
          <p class="text-lg text-gray-600">Find us across the Philippines</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Location 1 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-black text-green-800">Manila HQ</h3>
                <p class="text-sm text-green-600">Headquarters</p>
              </div>
            </div>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex gap-2">
                <span class="text-green-500">📍</span>
                <span>123 Agri Business Center, Makati City</span>
              </div>
              <div class="flex gap-2">
                <span class="text-green-500">📞</span>
                <span>+63 2 123 4567</span>
              </div>
              <div class="flex gap-2">
                <span class="text-green-500">🕒</span>
                <span>Mon-Sat: 9AM - 6PM</span>
              </div>
              <div class="flex gap-2">
                <span class="text-green-500">📧</span>
                <span>manila@bulawangani.com</span>
              </div>
            </div>
            <div class="mt-6">
              <button class="w-full bg-green-700 text-white py-2 px-4 rounded-xl font-bold hover:bg-green-800 transition">
                Get Directions
              </button>
            </div>
          </div>

          <!-- Location 2 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-black text-yellow-800">Cebu Office</h3>
                <p class="text-sm text-yellow-600">Visayas Hub</p>
              </div>
            </div>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex gap-2">
                <span class="text-yellow-500">📍</span>
                <span>456 Farm Trade Center, Cebu City</span>
              </div>
              <div class="flex gap-2">
                <span class="text-yellow-500">📞</span>
                <span>+63 32 987 6543</span>
              </div>
              <div class="flex gap-2">
                <span class="text-yellow-500">🕒</span>
                <span>Mon-Sat: 9AM - 6PM</span>
              </div>
              <div class="flex gap-2">
                <span class="text-yellow-500">📧</span>
                <span>cebu@bulawangani.com</span>
              </div>
            </div>
            <div class="mt-6">
              <button class="w-full bg-yellow-600 text-white py-2 px-4 rounded-xl font-bold hover:bg-yellow-700 transition">
                Get Directions
              </button>
            </div>
          </div>

          <!-- Location 3 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-black text-orange-800">Davao Center</h3>
                <p class="text-sm text-orange-600">Mindanao Hub</p>
              </div>
            </div>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex gap-2">
                <span class="text-orange-500">📍</span>
                <span>789 Agri Innovation Park, Davao City</span>
              </div>
              <div class="flex gap-2">
                <span class="text-orange-500">📞</span>
                <span>+63 82 555 1234</span>
              </div>
              <div class="flex gap-2">
                <span class="text-orange-500">🕒</span>
                <span>Mon-Sat: 9AM - 6PM</span>
              </div>
              <div class="flex gap-2">
                <span class="text-orange-500">📧</span>
                <span>davao@bulawangani.com</span>
              </div>
            </div>
            <div class="mt-6">
              <button class="w-full bg-orange-600 text-white py-2 px-4 rounded-xl font-bold hover:bg-orange-700 transition">
                Get Directions
              </button>
            </div>
          </div>

          <!-- Location 4 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-black text-red-800">Baguio Farm</h3>
                <p class="text-sm text-red-600">Highland Produce</p>
              </div>
            </div>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex gap-2">
                <span class="text-red-500">📍</span>
                <span>101 Mountain View Farm, Baguio City</span>
              </div>
              <div class="flex gap-2">
                <span class="text-red-500">📞</span>
                <span>+63 74 111 2233</span>
              </div>
              <div class="flex gap-2">
                <span class="text-red-500">🕒</span>
                <span>Mon-Sat: 8AM - 5PM</span>
              </div>
              <div class="flex gap-2">
                <span class="text-red-500">📧</span>
                <span>baguio@bulawangani.com</span>
              </div>
            </div>
            <div class="mt-6">
              <button class="w-full bg-red-600 text-white py-2 px-4 rounded-xl font-bold hover:bg-red-700 transition">
                Get Directions
              </button>
            </div>
          </div>

          <!-- Location 5 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-black text-purple-800">Iloilo Hub</h3>
                <p class="text-sm text-purple-600">Western Visayas</p>
              </div>
            </div>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex gap-2">
                <span class="text-purple-500">📍</span>
                <span>222 Rice Trade Center, Iloilo City</span>
              </div>
              <div class="flex gap-2">
                <span class="text-purple-500">📞</span>
                <span>+63 33 444 5566</span>
              </div>
              <div class="flex gap-2">
                <span class="text-purple-500">🕒</span>
                <span>Mon-Sat: 9AM - 6PM</span>
              </div>
              <div class="flex gap-2">
                <span class="text-purple-500">📧</span>
                <span>iloilo@bulawangani.com</span>
              </div>
            </div>
            <div class="mt-6">
              <button class="w-full bg-purple-600 text-white py-2 px-4 rounded-xl font-bold hover:bg-purple-700 transition">
                Get Directions
              </button>
            </div>
          </div>

          <!-- Location 6 -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-black text-blue-800">Pampanga Farm</h3>
                <p class="text-sm text-blue-600">Central Luzon</p>
              </div>
            </div>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex gap-2">
                <span class="text-blue-500">📍</span>
                <span>333 Harvest Lane, San Fernando, Pampanga</span>
              </div>
              <div class="flex gap-2">
                <span class="text-blue-500">📞</span>
                <span>+63 45 777 8899</span>
              </div>
              <div class="flex gap-2">
                <span class="text-blue-500">🕒</span>
                <span>Mon-Sat: 7AM - 4PM</span>
              </div>
              <div class="flex gap-2">
                <span class="text-blue-500">📧</span>
                <span>pampanga@bulawangani.com</span>
              </div>
            </div>
            <div class="mt-6">
              <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-xl font-bold hover:bg-blue-700 transition">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Support Section -->
    <section id="support" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Support Center</h2>
          <p class="text-lg text-gray-600">Find answers to common questions and get help</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Support Card 1 -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border border-green-200 hover:shadow-xl transition">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-green-800">Order Support</h3>
                <p class="text-sm text-green-600">Track, modify, or cancel orders</p>
              </div>
            </div>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• How to track your order</li>
              <li>• Order modification process</li>
              <li>• Cancellation policy</li>
              <li>• Delivery timeframes</li>
            </ul>
            <button class="mt-6 w-full bg-green-700 text-white py-2 px-4 rounded-xl font-bold hover:bg-green-800 transition">
              Learn More
            </button>
          </div>

          <!-- Support Card 2 -->
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-8 border border-yellow-200 hover:shadow-xl transition">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-yellow-800">Technical Support</h3>
                <p class="text-sm text-yellow-600">App and website issues</p>
              </div>
            </div>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• App troubleshooting</li>
              <li>• Website navigation</li>
              <li>• Payment issues</li>
              <li>• Account problems</li>
            </ul>
            <button class="mt-6 w-full bg-yellow-600 text-white py-2 px-4 rounded-xl font-bold hover:bg-yellow-700 transition">
              Learn More
            </button>
          </div>

          <!-- Support Card 3 -->
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 border border-orange-200 hover:shadow-xl transition">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-orange-800">Farmer Support</h3>
                <p class="text-sm text-orange-600">For our farming partners</p>
              </div>
            </div>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• Partnership requirements</li>
              <li>• Quality standards</li>
              <li>• Payment terms</li>
              <li>• Technical assistance</li>
            </ul>
            <button class="mt-6 w-full bg-orange-600 text-white py-2 px-4 rounded-xl font-bold hover:bg-orange-700 transition">
              Learn More
            </button>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="mt-16 bg-gradient-to-br from-slate-50 to-gray-50 rounded-3xl p-8 border border-gray-200">
          <h3 class="text-2xl font-black text-gray-900 mb-8">Frequently Asked Questions</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 class="font-black text-gray-900 mb-2">How do I track my order?</h4>
              <p class="text-sm text-gray-600">You can track your order through our app or by visiting our tracking page with your order number.</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 class="font-black text-gray-900 mb-2">What are your delivery areas?</h4>
              <p class="text-sm text-gray-600">We deliver to Metro Manila, Luzon, Visayas, and Mindanao. Check our delivery map for details.</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 class="font-black text-gray-900 mb-2">How fresh are your products?</h4>
              <p class="text-sm text-gray-600">Our products are harvested within 24-48 hours of delivery to ensure maximum freshness.</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 class="font-black text-gray-900 mb-2">Can I return products?</h4>
              <p class="text-sm text-gray-600">We offer a 100% satisfaction guarantee. Contact us within 24 hours for returns or exchanges.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partnership Section -->
    <section id="partnership" class="py-20 bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Partnership Opportunities</h2>
          <p class="text-lg text-gray-600">Join us in transforming Philippine agriculture</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
              <h3 class="text-2xl font-black text-gray-900 mb-6">For Farmers</h3>
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-black text-green-800">Fair Pricing</h4>
                    <p class="text-sm text-gray-600">Receive fair market prices for your harvests</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-black text-green-800">Market Access</h4>
                    <p class="text-sm text-gray-600">Access to urban markets and direct consumers</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-black text-green-800">Quality Support</h4>
                    <p class="text-sm text-gray-600">Technical assistance and quality standards</p>
                  </div>
                </div>
              </div>
              <button class="mt-6 w-full bg-green-700 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-800 transition">
                Join as Farmer
              </button>
            </div>

            <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
              <h3 class="text-2xl font-black text-gray-900 mb-6">For Businesses</h3>
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-black text-yellow-800">Bulk Supply</h4>
                    <p class="text-sm text-gray-600">Reliable supply of fresh agricultural products</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-black text-yellow-800">Distribution</h4>
                    <p class="text-sm text-gray-600">Leverage our nationwide distribution network</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-black text-yellow-800">Technology</h4>
                    <p class="text-sm text-gray-600">Access to our agri-tech platform and tools</p>
                  </div>
                </div>
              </div>
              <button class="mt-6 w-full bg-yellow-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-yellow-700 transition">
                Partner with Us
              </button>
            </div>
          </div>

          <div class="relative">
            <div class="bg-gradient-to-br from-green-200 to-yellow-200 rounded-3xl p-8 shadow-xl">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white rounded-2xl p-6 shadow-lg">
                  <div class="text-3xl font-black text-green-800 mb-4">👨‍🌾</div>
                  <h4 class="font-black text-green-800 mb-2">500+ Farmers</h4>
                  <p class="text-sm text-green-600">Partner network</p>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-lg">
                  <div class="text-3xl font-black text-yellow-800 mb-4">🏢</div>
                  <h4 class="font-black text-yellow-800 mb-2">100+ Businesses</h4>
                  <p class="text-sm text-yellow-600">Corporate partners</p>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-lg">
                  <div class="text-3xl font-black text-orange-800 mb-4">🚚</div>
                  <h4 class="font-black text-orange-800 mb-2">10+ Locations</h4>
                  <p class="text-sm text-orange-600">Distribution centers</p>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-lg">
                  <div class="text-3xl font-black text-red-800 mb-4">📱</div>
                  <h4 class="font-black text-red-800 mb-2">50K+ Downloads</h4>
                  <p class="text-sm text-red-600">Mobile app users</p>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full opacity-20"></div>
            <div class="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20"></div>
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
                <p class="text-xs text-gray-500 uppercase tracking-widest">Get in Touch</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              We're here to help you connect with the freshest harvests from our local farmers. 
              Reach out to us through any of our channels.
            </p>
            <div class="flex gap-4">
              <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-green-100 transition cursor-pointer">
                <span class="text-lg">📱</span>
              </div>
              <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-green-100 transition cursor-pointer">
                <span class="text-lg">💬</span>
              </div>
              <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-green-100 transition cursor-pointer">
                <span class="text-lg">📧</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Contact</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#contact-form" class="hover:text-green-700 transition">Contact Form</a></li>
              <li><a href="#locations" class="hover:text-green-700 transition">Our Locations</a></li>
              <li><a href="#support" class="hover:text-green-700 transition">Support Center</a></li>
              <li><a href="#partnership" class="hover:text-green-700 transition">Partnership</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Support</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#" class="hover:text-green-700 transition">Help Center</a></li>
              <li><a href="#" class="hover:text-green-700 transition">FAQ</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Live Chat</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Phone Support</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Business</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#" class="hover:text-green-700 transition">For Farmers</a></li>
              <li><a href="#" class="hover:text-green-700 transition">For Businesses</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Distribution</a></li>
              <li><a href="#" class="hover:text-green-700 transition">Technology</a></li>
            </ul>
          </div>
        </div>

        <div class="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
          <p>© 2026 Bulawang Ani Philippines. We're here for you.</p>
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
import LoadingSpinner from '../Components/LoadingSpinner.vue';
import { useCartStore } from '../stores/cart.js';

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

/* Animation for contact cards */
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