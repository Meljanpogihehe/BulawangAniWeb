<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-yellow-50 font-sans">
    <div class="bg-green-900 text-white py-2 text-xs md:text-sm font-medium text-center px-4">
    </div>

    <!-- Navigation (same as Products page) -->
    <nav class="border-b sticky top-0 bg-white/95 backdrop-blur-md z-50">
      <div class="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center gap-4">
        <router-link to="/" class="flex items-center gap-2 cursor-pointer shrink-0">
          <div class="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
            <span class="text-yellow-400 font-bold text-xl">B</span>
          </div>
          <h1 class="text-xl md:text-2xl font-black tracking-tight text-green-800">
            Bulawang <span class="text-yellow-600">Ani</span>
          </h1>
        </router-link>

        <div class="hidden md:flex flex-1 max-w-md relative group">
          <input type="text" placeholder="Search rice, vegetables, or farmers..."
                 class="w-full bg-gray-100 border-2 border-transparent rounded-full py-2.5 px-12 focus:bg-white focus:border-green-600 focus:ring-0 outline-none transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          </div>
        </div>
      </div>
    </nav>

    <!-- Product Not Found -->
    <section v-if="!product && !isLoading" class="max-w-7xl mx-auto px-4 py-20">
      <div class="bg-white rounded-3xl p-12 text-center shadow-lg">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-3xl font-black text-gray-900 mb-4">Product Not Found</h2>
        <p class="text-gray-500 mb-8">Product with ID "{{ $route.params.id }}" not found.</p>
        <div class="flex gap-4 justify-center">
          <router-link to="/products" class="px-8 py-3 bg-green-700 text-white rounded-full font-bold hover:bg-green-800 transition shadow-lg">
            Browse Products
          </router-link>
          <router-link to="/" class="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition">
            Go Home
          </router-link>
        </div>
      </div>
    </section>

    <!-- Product Detail -->
    <section v-else-if="product" class="max-w-7xl mx-auto px-4 py-12">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm mb-8 font-bold text-gray-500">
        <router-link to="/" class="hover:text-green-700 transition">Home</router-link>
        <span>›</span>
        <router-link to="/products" class="hover:text-green-700 transition">Products</router-link>
        <span>›</span>
        <span class="text-green-700">{{ product.name }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <!-- Product Images -->
        <div class="space-y-4">
          <div class="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-2xl">
            <img :src="product.img" :alt="product.name" class="w-full h-full object-cover">
          </div>
          <div class="grid grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer hover:ring-4 ring-green-600 transition">
              <img :src="product.img" :alt="product.name" class="w-full h-full object-cover opacity-70 hover:opacity-100 transition">
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <div class="flex gap-3">
            <span v-if="product.isNew" class="bg-green-600 text-white text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-widest">Fresh Picked</span>
            <span v-if="product.stock < 10" class="bg-red-500 text-white text-xs px-4 py-1.5 rounded-full font-black uppercase">Only {{ product.stock }} left</span>
            <span class="bg-yellow-600 text-white text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-widest">{{ product.tag }}</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-black text-gray-900 leading-tight">{{ product.name }}</h1>

          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="flex">
                <span v-for="i in 5" :key="i" class="text-yellow-400 text-xl">⭐</span>
              </div>
              <span class="text-sm font-bold text-gray-600">{{ product.rating }}</span>
            </div>
            <span class="text-gray-300">|</span>
            <span class="text-sm font-bold text-gray-600">📍 Origin: {{ product.origin }}</span>
          </div>

          <div class="bg-green-50 rounded-2xl p-6 border border-green-100">
            <div class="flex items-baseline gap-3 mb-2">
              <span class="text-5xl font-black text-green-800">₱{{ product.price }}</span>
              <span v-if="product.oldPrice" class="text-2xl text-gray-400 line-through">₱{{ product.oldPrice }}</span>
            </div>
            <span class="text-sm text-green-700 font-bold uppercase tracking-wide">Per {{ product.unit }}</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-black uppercase tracking-wide mb-2 text-gray-700">Quantity</label>
              <div class="flex items-center gap-4">
                <button @click="decreaseQty" class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-xl hover:bg-gray-200 transition">-</button>
                <input type="number" v-model.number="quantity" min="1" :max="product.stock" class="w-20 h-12 text-center text-xl font-black bg-white border-2 border-gray-200 rounded-xl focus:border-green-600 focus:ring-0 outline-none">
                <button @click="increaseQty" class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-xl hover:bg-gray-200 transition">+</button>
                <span class="text-sm font-bold text-gray-500">{{ product.stock }} available</span>
              </div>
            </div>

            <div class="flex gap-4">
              <button @click="handleAddToCart" class="flex-1 bg-green-700 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-800 transition shadow-lg shadow-green-200 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </button>
              <button @click="handleWishlist" class="w-16 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-green-700 hover:text-white transition" :class="isInWishlist ? 'bg-green-700 text-white' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6 space-y-4">
            <div class="flex items-center gap-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="font-bold text-gray-700">100% Fresh & Verified Quality</span>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span class="font-bold text-gray-700">Direct from Local Farmers</span>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="font-bold text-gray-700">Secure Payment & Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Description -->
      <div class="bg-white rounded-3xl p-8 shadow-lg mb-12">
        <h3 class="text-2xl font-black mb-6 text-gray-900">Product Description</h3>
        <div class="prose prose-lg max-w-none text-gray-600 leading-relaxed">
          <p>{{ product.name }} is sourced directly from certified farmers in {{ product.origin }}. Each batch is carefully selected to ensure premium quality and freshness.</p>
          <p class="mt-4">Our commitment to supporting local agriculture means you get the freshest products while helping Filipino farmers thrive. Every purchase contributes to sustainable farming practices and fair compensation for our farming communities.</p>
        </div>
      </div>

      <!-- Related Products -->
      <div>
        <h3 class="text-3xl font-black mb-8">You Might Also <span class="text-green-700">Like</span></h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" class="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-green-200 transition-all group">
            <div class="h-48 relative overflow-hidden bg-gray-50">
              <img :src="relatedProduct.img" :alt="relatedProduct.name" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
            </div>
            <div class="p-4">
              <h4 class="font-black text-gray-900 mb-2 group-hover:text-green-700 transition">{{ relatedProduct.name }}</h4>
              <div class="flex justify-between items-center">
                <span class="text-xl font-black text-green-800">₱{{ relatedProduct.price }}</span>
                <router-link :to="`/product/${relatedProduct.id}`" class="bg-green-700 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-green-900 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer (same as Products page) -->
    <footer class="bg-white border-t pt-20 pb-10 mt-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="pt-8 border-t border-gray-100 text-center text-xs font-black uppercase tracking-widest text-gray-400">
          <p>© 2026 Bulawang Ani Philippines. Supporting our local heroes.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useAuthStore } from '../stores/auth'
import LoadingSpinner from '../Components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const quantity = ref(1)

// All products data (same as Products page)
const allProducts = [
  { id: 1, name: 'Premium Dinorado Rice', price: '2,250', oldPrice: '2,400', unit: '25kg bag', tag: 'Grains', rating: '4.9 (120+)', stock: 5, origin: 'Isabela', isNew: false, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Red Cargo Rice', price: '2,100', unit: '25kg bag', tag: 'Grains', rating: '4.8 (95)', stock: 12, origin: 'Nueva Ecija', isNew: true, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800' },
  { id: 3, name: 'Brown Rice Premium', price: '2,800', unit: '25kg bag', tag: 'Grains', rating: '4.7 (80)', stock: 8, origin: 'Bicol', isNew: false, img: 'https://images.unsplash.com/photo-1536304993881-ff6e9aefacd9?auto=format&fit=crop&q=80&w=800' },
  { id: 4, name: 'Sweet Corn Kernels', price: '95', unit: 'kg', tag: 'Grains', rating: '4.6 (65)', stock: 25, origin: 'Mindanao', isNew: true, img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800' },
  { id: 5, name: 'Organic Benguet Tomatoes', price: '120', unit: 'kg', tag: 'Vegetables', rating: '4.8 (85)', stock: 45, origin: 'Benguet', isNew: true, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800' },
  { id: 6, name: 'Benguet Garlic Bulbs', price: '200', unit: 'kg', tag: 'Vegetables', rating: '4.8 (75)', stock: 30, origin: 'Benguet', isNew: true, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
  { id: 7, name: 'Fresh Eggplant', price: '80', unit: 'kg', tag: 'Vegetables', rating: '4.5 (60)', stock: 35, origin: 'Pampanga', isNew: false, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800' },
  { id: 8, name: 'Red Onions', price: '90', unit: 'kg', tag: 'Vegetables', rating: '4.7 (90)', stock: 40, origin: 'Ilocos', isNew: false, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800' },
  { id: 9, name: 'Calabaza Squash', price: '70', unit: 'kg', tag: 'Vegetables', rating: '4.4 (55)', stock: 20, origin: 'Laguna', isNew: true, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800' },
  { id: 10, name: 'Malunggay Leaves', price: '150', unit: 'kg', tag: 'Vegetables', rating: '4.9 (45)', stock: 15, origin: 'Quezon', isNew: false, img: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&q=80&w=800' },
  { id: 11, name: 'Davao Golden Bananas', price: '85', unit: 'bunch', tag: 'Fruits', rating: '4.7 (200+)', stock: 8, origin: 'Davao City', isNew: false, img: 'https://images.unsplash.com/photo-1571771894821-ad99026107b8?auto=format&fit=crop&q=80&w=800' },
  { id: 12, name: 'Fresh Laguna Calamansi', price: '150', unit: 'kg', tag: 'Fruits', rating: '4.6 (95)', stock: 20, origin: 'Laguna', isNew: false, img: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&q=80&w=800' },
  { id: 13, name: 'Cebu Mangoes', price: '180', unit: 'kg', tag: 'Fruits', rating: '4.7 (150)', stock: 15, origin: 'Cebu', isNew: true, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800' },
  { id: 14, name: 'Pineapple Gold', price: '120', unit: 'kg', tag: 'Fruits', rating: '4.8 (110)', stock: 18, origin: 'Mindoro', isNew: false, img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=800' },
  { id: 15, name: 'Carabao Mangoes', price: '220', unit: 'kg', tag: 'Fruits', rating: '4.9 (180)', stock: 10, origin: 'Guimaras', isNew: true, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800' },
  { id: 16, name: 'Papaya Solo', price: '60', unit: 'kg', tag: 'Fruits', rating: '4.5 (70)', stock: 22, origin: 'Batangas', isNew: false, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800' },
  { id: 17, name: 'Wild Bukidnon Honey', price: '450', unit: '500ml', tag: 'Organic', rating: '5.0 (50)', stock: 12, origin: 'Bukidnon', isNew: true, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800' },
  { id: 18, name: 'Ilocos Vinegar', price: '80', unit: '750ml', tag: 'Organic', rating: '4.9 (110)', stock: 50, origin: 'Ilocos Norte', isNew: false, img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800' },
  { id: 19, name: 'Virgin Coconut Oil', price: '350', unit: '500ml', tag: 'Organic', rating: '4.8 (85)', stock: 20, origin: 'Cebu', isNew: true, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800' },
  { id: 20, name: 'Organic Coffee Beans', price: '280', unit: '500g', tag: 'Organic', rating: '4.7 (65)', stock: 15, origin: 'Benguet', isNew: false, img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800' },
]

const product = computed(() => {
  const id = parseInt(route.params.id)
  return allProducts.find(p => p.id === id)
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return allProducts
    .filter(p => p.tag === product.value.tag && p.id !== product.value.id)
    .slice(0, 4)
})

const isInWishlist = computed(() => {
  return wishlistStore.wishlist?.some(item => item.id === product.value?.id) || false
})

const increaseQty = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQty = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleAddToCart = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  cartStore.addItem(product.value, quantity.value)
  // Show success feedback (you can add a toast notification here)
  alert(`Added ${quantity.value} ${product.value.name} to cart!`)
}

const handleWishlist = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  wishlistStore.toggleItem(product.value)
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>