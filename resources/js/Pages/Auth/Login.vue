<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-yellow-50 font-sans flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
      <!-- Header / Logo Area -->
      <div class="bg-green-900 p-8 text-center relative overflow-hidden">
        <!-- Decorative background pattern/overlay -->
        <div class="absolute inset-0 bg-green-800 opacity-50"></div>
        
        <div class="relative z-10 flex flex-col items-center">
          <div class="w-16 h-16 bg-green-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/50 mb-4">
            <span class="text-yellow-400 font-bold text-3xl">B</span>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-white">
            Bulawang <span class="text-yellow-400">Ani</span>
          </h1>
          <p class="text-green-100 text-sm mt-2 font-medium">Welcome back, farmer friend!</p>
        </div>
      </div>

      <!-- Login Form -->
      <div class="p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email"
              class="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-green-600 focus:ring-0 outline-none transition-all font-medium"
              placeholder="you@example.com"
              required
            >
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label for="password" class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Password</label>
              <a href="#" class="text-xs font-bold text-green-700 hover:text-green-800">Forgot Password?</a>
            </div>
            <input 
              type="password" 
              id="password" 
              v-model="form.password"
              class="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-green-600 focus:ring-0 outline-none transition-all font-medium"
              placeholder="••••••••"
              required
            >
          </div>

          <button 
            type="submit" 
            class="w-full bg-green-700 text-white py-4 rounded-xl font-black text-lg hover:bg-green-800 transition shadow-lg shadow-green-100 hover:shadow-green-200 transform hover:-translate-y-1"
          >
            Sign In
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-gray-500 text-sm font-medium">
            Don't have an account? 
            <router-link to="/register" class="text-green-700 font-bold hover:underline">Create Account</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
});

const handleLogin = () => {
  // Placeholder for login logic
  console.log('Login attempt:', form);
  
  // Simulate successful login
  authStore.login({
    name: 'Juan Dela Cruz',
    email: form.email
  });
  
  // Redirect to home
  router.push('/');
};
</script>
