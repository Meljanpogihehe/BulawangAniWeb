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
            <router-link to="/products" class="text-green-700 font-black border-b-2 border-green-700 transition pb-1">Products</router-link>
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
            <router-link to="/" @click="closeMobileMenu" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl font-bold transition">
              Home
            </router-link>
            <router-link to="/products" @click="closeMobileMenu" class="block px-4 py-3 bg-green-50 text-green-700 rounded-xl font-bold transition">
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
          </nav>

          <div class="mt-8 pt-8 border-t border-gray-200">
            <router-link to="/login" @click="closeMobileMenu" class="block text-center w-full px-6 py-3 bg-green-700 text-white rounded-xl font-bold text-sm hover:bg-green-800 transition shadow-lg">
              Login
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <section class="max-w-7xl mx-auto px-4 py-12">
      <!-- Loading State -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div v-for="i in 8" :key="i" class="bg-gray-300 rounded-[2.5rem] overflow-hidden border border-gray-200 h-96"></div>
        </div>
      </div>

      <div v-else class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <h3 class="text-3xl font-black">Our <span class="text-green-700">Products</span></h3>
        <div class="flex gap-4">
          <select v-model="selectedCategory" class="bg-gray-100 px-4 py-2 rounded-xl font-bold text-sm">
            <option>All Categories</option>
            <option>Grains</option>
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Organic</option>
          </select>
          <select v-model="selectedSort" class="bg-gray-100 px-4 py-2 rounded-xl font-bold text-sm">
            <option>Sort by Price</option>
            <option>Low to High</option>
            <option>High to Low</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div v-for="product in sortedProducts" :key="product.name" class="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-green-200 transition-all group flex flex-col">
          <div class="h-64 relative overflow-hidden bg-gray-50">
            <img :src="product.img" :alt="product.name" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">

            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span v-if="product.isNew" class="bg-green-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg shadow-green-900/20">Fresh Picked</span>
              <span v-if="product.stock < 10" class="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase shadow-lg shadow-red-900/20">Only {{ product.stock }} left</span>
            </div>

            <button @click="addToWishlist(product)" class="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl hover:bg-green-700 hover:text-white transition-all transform group-hover:scale-110" :class="isInWishlist(product.id) ? 'bg-green-700 text-white' : 'hover:bg-green-700 hover:text-white'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div class="p-6 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-black text-yellow-600 uppercase tracking-widest">{{ product.tag }}</span>
                <span class="flex items-center text-xs font-bold text-gray-400">⭐ {{ product.rating }}</span>
            </div>
            <h4 class="text-lg font-black text-gray-900 leading-snug mb-2 group-hover:text-green-700 transition">{{ product.name }}</h4>
            <p class="text-xs text-gray-500 mb-6 font-medium">📍 Origin: {{ product.origin }}</p>

            <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
              <div>
                <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-black text-green-800">₱{{ product.price }}</span>
                    <span v-if="product.oldPrice" class="text-xs text-gray-400 line-through">₱{{ product.oldPrice }}</span>
                </div>
                <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-tighter">Verified Weight: {{ product.unit }}</span>
              </div>
              <div class="flex gap-2">
                <router-link :to="`/product/${product.id}`" class="bg-gray-100 text-gray-700 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-700 hover:text-white transition-all shadow-lg shadow-gray-100 hover:shadow-green-200 transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </router-link>
                <button @click="addToCart(product)" class="bg-green-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-900 transition-all shadow-lg shadow-green-100 hover:shadow-green-200 transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import LoadingSpinner from '../Components/LoadingSpinner.vue'

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()
const router = useRouter()

const selectedCategory = ref('All Categories');
const selectedSort = ref('Sort by Price');
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

const addToCart = (product) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  cartStore.addItem(product, 1)
};

const addToWishlist = (product) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  wishlistStore.toggleItem(product)
};

const isInWishlist = (productId) => {
  return wishlistStore.wishlist.some(item => item.id === productId)
}

const products = [
  // Grains
  { id: 1, name: 'Premium Dinorado Rice', price: '2,250', oldPrice: '2,400', unit: '25kg bag', tag: 'Grains', rating: '4.9 (120+)', stock: 5, origin: 'Isabela', isNew: false, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Red Cargo Rice', price: '2,100', unit: '25kg bag', tag: 'Grains', rating: '4.8 (95)', stock: 12, origin: 'Nueva Ecija', isNew: true, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800' },
  { id: 3, name: 'Brown Rice Premium', price: '2,800', unit: '25kg bag', tag: 'Grains', rating: '4.7 (80)', stock: 8, origin: 'Bicol', isNew: false, img: 'https://img.etimg.com/thumb/width-1200,height-900,imgsize-242102,resizemode-75,msid-120284877/magazines/panache/is-brown-rice-as-healthy-as-you-think-new-study-uncovers-concerning-toxic-arsenic-risk.jpg' },
  { id: 4, name: 'Sweet Corn Kernels', price: '95', unit: 'kg', tag: 'Grains', rating: '4.6 (65)', stock: 25, origin: 'Mindanao', isNew: true, img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800' },

  // Vegetables
  { id: 5, name: 'Organic Benguet Tomatoes', price: '120', unit: 'kg', tag: 'Vegetables', rating: '4.8 (85)', stock: 45, origin: 'Benguet', isNew: true, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800' },
  { id: 6, name: 'Benguet Garlic Bulbs', price: '200', unit: 'kg', tag: 'Vegetables', rating: '4.8 (75)', stock: 30, origin: 'Benguet', isNew: true, img: 'https://wardsnursery.com/wp-content/uploads/2019/10/garlic-growing-guide.jpg' },
  { id: 7, name: 'Fresh Eggplant', price: '80', unit: 'kg', tag: 'Vegetables', rating: '4.5 (60)', stock: 35, origin: 'Pampanga', isNew: false, img: 'https://allianceforscience.org/wp-content/uploads/2018/02/22172931728_1223b8c407_k.jpg' },
  { id: 8, name: 'Red Onions', price: '90', unit: 'kg', tag: 'Vegetables', rating: '4.7 (90)', stock: 40, origin: 'Ilocos', isNew: false, img: 'https://dzrh-bucket.s3.ap-southeast-1.amazonaws.com/featuredimage/red-onions-hitting-p600kilo/l-intro-1644158494.jpg' },
  { id: 9, name: 'Calabaza Squash', price: '70', unit: 'kg', tag: 'Vegetables', rating: '4.4 (55)', stock: 20, origin: 'Laguna', isNew: true, img: 'https://specialtyproduce.com/sppics/1198.png' },
  { id: 10, name: 'Malunggay Leaves', price: '150', unit: 'kg', tag: 'Vegetables', rating: '4.9 (45)', stock: 15, origin: 'Quezon', isNew: false, img: 'https://businessdiary.com.ph/wp-content/uploads/2012/11/moringa-oleifera.jpg' },

  // Fruits
  { id: 11, name: 'Davao Golden Bananas', price: '85', unit: 'bunch', tag: 'Fruits', rating: '4.7 (200+)', stock: 8, origin: 'Davao City', isNew: false, img: 'https://www.cartacapital.com.br/wp-content/uploads/2025/09/banana-fruta-outono-1024x683.jpg' },
  { id: 12, name: 'Fresh Laguna Calamansi', price: '150', unit: 'kg', tag: 'Fruits', rating: '4.6 (95)', stock: 20, origin: 'Laguna', isNew: false, img: 'https://epicureanearth.com/wp-content/uploads/2024/09/all-about-the-calamansi-scaled.jpg' },
  { id: 13, name: 'Cebu Mangoes', price: '180', unit: 'kg', tag: 'Fruits', rating: '4.7 (150)', stock: 15, origin: 'Cebu', isNew: true, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800' },
  { id: 14, name: 'Pineapple Gold', price: '120', unit: 'kg', tag: 'Fruits', rating: '4.8 (110)', stock: 18, origin: 'Mindoro', isNew: false, img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=800' },
  { id: 15, name: 'Carabao Mangoes', price: '220', unit: 'kg', tag: 'Fruits', rating: '4.9 (180)', stock: 10, origin: 'Guimaras', isNew: true, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800' },
  { id: 16, name: 'Papaya Solo', price: '60', unit: 'kg', tag: 'Fruits', rating: '4.5 (70)', stock: 22, origin: 'Batangas', isNew: false, img: 'https://www.dreamfoodscaribe.com/wp-content/uploads/2024/07/papaya-fruit.webp' },

  // Organic
  { id: 17, name: 'Wild Bukidnon Honey', price: '450', unit: '500ml', tag: 'Organic', rating: '5.0 (50)', stock: 12, origin: 'Bukidnon', isNew: true, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800' },
  { id: 18, name: 'Ilocos Vinegar', price: '80', unit: '750ml', tag: 'Organic', rating: '4.9 (110)', stock: 50, origin: 'Ilocos Norte', isNew: false, img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800' },
  { id: 19, name: 'Virgin Coconut Oil', price: '350', unit: '500ml', tag: 'Organic', rating: '4.8 (85)', stock: 20, origin: 'Cebu', isNew: true, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800' },
  { id: 20, name: 'Organic Coffee Beans', price: '280', unit: '500g', tag: 'Organic', rating: '4.7 (65)', stock: 15, origin: 'Benguet', isNew: false, img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800' },
];

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'All Categories') {
    return products;
  }
  return products.filter(product => product.tag === selectedCategory.value);
});

const sortedProducts = computed(() => {
  const filtered = [...filteredProducts.value];
  if (selectedSort.value === 'Low to High') {
    return filtered.sort((a, b) => parseFloat(a.price.replace(',', '')) - parseFloat(b.price.replace(',', '')));
  } else if (selectedSort.value === 'High to Low') {
    return filtered.sort((a, b) => parseFloat(b.price.replace(',', '')) - parseFloat(a.price.replace(',', '')));
  }
  return filtered;
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Custom extra-small breakpoint for very narrow devices */
@media (max-width: 400px) {
  .xs\:inline { display: inline; }
}
</style>
