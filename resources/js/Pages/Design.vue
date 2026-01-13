<template>
    <LoadingSpinner v-if="isLoading" />
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-yellow-50 font-sans">
    <!-- Header -->
    <header class="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-700 to-green-800 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
            <span class="text-yellow-400 text-2xl font-bold">B</span>
          </div>
          <div>
            <h1 class="text-2xl font-black text-green-800">Bulawang <span class="text-yellow-600">Ani</span></h1>
            <p class="text-xs text-gray-500 uppercase tracking-widest">Design System</p>
          </div>
        </div>
        
        <nav class="hidden md:flex gap-8">
          <a href="#colors" class="text-gray-600 hover:text-green-700 font-bold transition">Colors</a>
          <a href="#typography" class="text-gray-600 hover:text-green-700 font-bold transition">Typography</a>
          <a href="#components" class="text-gray-600 hover:text-green-700 font-bold transition">Components</a>
          <a href="#layout" class="text-gray-600 hover:text-green-700 font-bold transition">Layout</a>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative py-24 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative max-w-7xl mx-auto px-4 text-center">
        <div class="mb-8">
          <div class="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span class="text-sm font-bold">Design System</span>
          </div>
        </div>
        <h1 class="text-6xl md:text-8xl font-black mb-6">Bulawang Ani</h1>
        <p class="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
          A comprehensive design system that reflects our connection to Philippine agriculture,
          combining earthy tones with modern digital experiences.
        </p>
      </div>
    </section>

    <!-- Color Palette Section -->
    <section id="colors" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Color Palette</h2>
          <p class="text-lg text-gray-600">Inspired by the rich colors of Philippine agriculture</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Primary Colors -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-2xl font-black text-gray-900 mb-6">Primary Colors</h3>
            <div class="space-y-6">
              <div class="group cursor-pointer" @click="copyColor('#14532d')">
                <div class="w-full h-16 bg-green-900 rounded-2xl shadow-lg mb-3 transition-transform group-hover:scale-105"></div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-800">Forest Green</span>
                  <span class="text-sm text-gray-500">#14532d</span>
                </div>
              </div>
              <div class="group cursor-pointer" @click="copyColor('#166534')">
                <div class="w-full h-16 bg-green-800 rounded-2xl shadow-lg mb-3 transition-transform group-hover:scale-105"></div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-800">Deep Green</span>
                  <span class="text-sm text-gray-500">#166534</span>
                </div>
              </div>
              <div class="group cursor-pointer" @click="copyColor('#22c55e')">
                <div class="w-full h-16 bg-green-500 rounded-2xl shadow-lg mb-3 transition-transform group-hover:scale-105"></div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-800">Fresh Green</span>
                  <span class="text-sm text-gray-500">#22c55e</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Colors -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-2xl font-black text-gray-900 mb-6">Secondary Colors</h3>
            <div class="space-y-6">
              <div class="group cursor-pointer" @click="copyColor('#eab308')">
                <div class="w-full h-16 bg-yellow-500 rounded-2xl shadow-lg mb-3 transition-transform group-hover:scale-105"></div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-800">Golden Yellow</span>
                  <span class="text-sm text-gray-500">#eab308</span>
                </div>
              </div>
              <div class="group cursor-pointer" @click="copyColor('#f59e0b')">
                <div class="w-full h-16 bg-orange-500 rounded-2xl shadow-lg mb-3 transition-transform group-hover:scale-105"></div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-800">Harvest Orange</span>
                  <span class="text-sm text-gray-500">#f59e0b</span>
                </div>
              </div>
              <div class="group cursor-pointer" @click="copyColor('#f97316')">
                <div class="w-full h-16 bg-orange-400 rounded-2xl shadow-lg mb-3 transition-transform group-hover:scale-105"></div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-800">Sunset Orange</span>
                  <span class="text-sm text-gray-500">#f97316</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Neutral Colors -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-2xl font-black text-gray-900 mb-6">Neutral Colors</h3>
            <div class="space-y-6">
              <div class="group cursor-pointer" @click="copyColor('#ffffff')">
                <div class="w-full h-16 bg-white rounded-2xl shadow-lg mb-3 border border-gray-200 transition-transform group-hover:scale-105"></div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-800">Pure White</span>
                  <span class="text-sm text-gray-500">#ffffff</span>
                </div>
              </div>
              <div class="group cursor-pointer" @click="copyColor('#6b7280')">
                <div class="w-full h-16 bg-gray-500 rounded-2xl shadow-lg mb-3 transition-transform group-hover:scale-105"></div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-800">Slate Gray</span>
                  <span class="text-sm text-gray-500">#6b7280</span>
                </div>
              </div>
              <div class="group cursor-pointer" @click="copyColor('#f3f4f6')">
                <div class="w-full h-16 bg-gray-100 rounded-2xl shadow-lg mb-3 transition-transform group-hover:scale-105"></div>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-800">Light Gray</span>
                  <span class="text-sm text-gray-500">#f3f4f6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Typography Section -->
    <section id="typography" class="py-20 bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Typography</h2>
          <p class="text-lg text-gray-600">Clean, readable fonts that reflect our agricultural heritage</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-2xl font-black text-gray-900 mb-8">Font Hierarchy</h3>
            <div class="space-y-6">
              <div>
                <div class="text-6xl font-black text-green-800 mb-2">Bulawang Ani</div>
                <div class="text-sm text-gray-500">Font Size: 4rem (64px) | Weight: 900</div>
              </div>
              <div>
                <div class="text-4xl font-black text-green-700 mb-2">Product Categories</div>
                <div class="text-sm text-gray-500">Font Size: 2.25rem (36px) | Weight: 900</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-800 mb-2">Section Headers</div>
                <div class="text-sm text-gray-500">Font Size: 1.5rem (24px) | Weight: 700</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-gray-700 mb-2">Product Names</div>
                <div class="text-sm text-gray-500">Font Size: 1.125rem (18px) | Weight: 600</div>
              </div>
              <div>
                <div class="text-base text-gray-600 mb-2">Body Text</div>
                <div class="text-sm text-gray-500">Font Size: 1rem (16px) | Weight: 400</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-2xl font-black text-gray-900 mb-8">Text Styles</h3>
            <div class="space-y-6">
              <div class="bg-green-50 p-6 rounded-2xl">
                <h4 class="font-black text-green-800 mb-2">Brand Text</h4>
                <p class="text-green-700">Used for brand names, key messages, and important highlights.</p>
              </div>
              <div class="bg-yellow-50 p-6 rounded-2xl">
                <h4 class="font-bold text-yellow-800 mb-2">Highlight Text</h4>
                <p class="text-yellow-700">Used for special offers, discounts, and call-to-action elements.</p>
              </div>
              <div class="bg-gray-50 p-6 rounded-2xl">
                <h4 class="font-semibold text-gray-800 mb-2">Secondary Text</h4>
                <p class="text-gray-600">Used for descriptions, details, and supporting information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Components Section -->
    <section id="components" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Components</h2>
          <p class="text-lg text-gray-600">Reusable UI components that maintain consistency</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Primary Button -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-xl font-black text-gray-900 mb-6">Primary Button</h3>
            <div class="space-y-4">
              <button class="w-full bg-green-700 text-white py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-800 transition shadow-lg shadow-green-900/20">
                Add to Cart
              </button>
              <div class="text-xs text-gray-500">
                Background: #22c55e | Text: #ffffff | Border Radius: 1rem
              </div>
            </div>
          </div>

          <!-- Secondary Button -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-xl font-black text-gray-900 mb-6">Secondary Button</h3>
            <div class="space-y-4">
              <button class="w-full bg-white text-green-700 py-4 px-6 rounded-2xl font-bold border-2 border-green-700 hover:bg-green-50 transition">
                View Details
              </button>
              <div class="text-xs text-gray-500">
                Background: #ffffff | Text: #22c55e | Border: 2px solid #22c55e
              </div>
            </div>
          </div>

          <!-- Product Card -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-xl font-black text-gray-900 mb-6">Product Card</h3>
            <div class="bg-gray-50 rounded-2xl p-4">
              <div class="w-full h-32 bg-gradient-to-br from-green-200 to-yellow-200 rounded-xl mb-4"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                <div class="h-3 bg-gray-300 rounded w-1/2"></div>
                <div class="flex justify-between items-center">
                  <div class="h-4 bg-green-300 rounded w-16"></div>
                  <div class="h-6 bg-yellow-300 rounded w-12"></div>
                </div>
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-4">
              Card: White background with subtle shadow | Image: Rounded corners | Price: Yellow accent
            </div>
          </div>

          <!-- Navigation -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-xl font-black text-gray-900 mb-6">Navigation</h3>
            <div class="bg-white rounded-2xl border border-gray-200 p-4">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-green-700 to-green-800 rounded-xl"></div>
                  <div>
                    <div class="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                    <div class="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <div class="flex gap-6">
                <div class="h-3 bg-gray-300 rounded w-12"></div>
                <div class="h-3 bg-gray-300 rounded w-12"></div>
                <div class="h-3 bg-green-300 rounded w-12"></div>
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-4">
              Logo: Green gradient | Links: Gray with active green | Cart: Icon with badge
            </div>
          </div>

          <!-- Form Elements -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-xl font-black text-gray-900 mb-6">Form Elements</h3>
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-3">
                <div class="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                <div class="h-10 bg-white rounded-lg border-2 border-gray-200"></div>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <div class="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div class="h-12 bg-white rounded-lg border-2 border-green-500 relative">
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-green-500 rounded"></div>
                </div>
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-4">
              Input: White background with gray border | Focus: Green border | Select: Green accent
            </div>
          </div>

          <!-- Badges -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-xl font-black text-gray-900 mb-6">Badges & Tags</h3>
            <div class="space-y-3">
              <div class="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                Organic
              </div>
              <div class="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Fresh
              </div>
              <div class="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                Limited
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-4">
              Organic: Green background | Fresh: Yellow background | Limited: Orange background
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Layout Section -->
    <section id="layout" class="py-20 bg-gradient-to-br from-green-50 via-yellow-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-black text-gray-900 mb-4">Layout System</h2>
          <p class="text-lg text-gray-600">Responsive grid system and spacing guidelines</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-2xl font-black text-gray-900 mb-8">Grid System</h3>
            <div class="space-y-6">
              <div class="bg-gray-50 rounded-2xl p-6">
                <h4 class="font-bold text-gray-800 mb-4">Desktop Layout (1280px+)</h4>
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-3 bg-green-100 rounded-lg h-16 flex items-center justify-center text-sm font-bold">Sidebar</div>
                  <div class="col-span-9 bg-yellow-100 rounded-lg h-16 flex items-center justify-center text-sm font-bold">Content</div>
                </div>
              </div>
              <div class="bg-gray-50 rounded-2xl p-6">
                <h4 class="font-bold text-gray-800 mb-4">Tablet Layout (768px-1279px)</h4>
                <div class="grid grid-cols-8 gap-3">
                  <div class="col-span-8 bg-green-100 rounded-lg h-16 flex items-center justify-center text-sm font-bold">Full Width Content</div>
                </div>
              </div>
              <div class="bg-gray-50 rounded-2xl p-6">
                <h4 class="font-bold text-gray-800 mb-4">Mobile Layout (767px-)</h4>
                <div class="grid grid-cols-4 gap-2">
                  <div class="col-span-4 bg-green-100 rounded-lg h-16 flex items-center justify-center text-sm font-bold">Mobile Content</div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-3xl p-8 border border-gray-100">
            <h3 class="text-2xl font-black text-gray-900 mb-8">Spacing Guidelines</h3>
            <div class="space-y-6">
              <div class="bg-green-50 p-6 rounded-2xl">
                <h4 class="font-bold text-green-800 mb-3">Large Spacing</h4>
                <div class="space-y-2 text-sm">
                  <div>Section Padding: 4rem (64px)</div>
                  <div>Container Margin: 2rem (32px)</div>
                  <div>Hero Section: 6rem (96px)</div>
                </div>
              </div>
              <div class="bg-yellow-50 p-6 rounded-2xl">
                <h4 class="font-bold text-yellow-800 mb-3">Medium Spacing</h4>
                <div class="space-y-2 text-sm">
                  <div>Card Padding: 2rem (32px)</div>
                  <div>Component Gap: 1.5rem (24px)</div>
                  <div>Button Padding: 1rem (16px)</div>
                </div>
              </div>
              <div class="bg-gray-50 p-6 rounded-2xl">
                <h4 class="font-bold text-gray-800 mb-3">Small Spacing</h4>
                <div class="space-y-2 text-sm">
                  <div>Text Margin: 0.5rem (8px)</div>
                  <div>Icon Spacing: 0.25rem (4px)</div>
                  <div>Input Padding: 0.75rem (12px)</div>
                </div>
              </div>
            </div>
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
                <p class="text-xs text-gray-500">Design System v1.0</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              A comprehensive design system that combines modern digital experiences 
              with the rich heritage of Philippine agriculture.
            </p>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Colors</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#colors" class="hover:text-green-700 transition">Primary Palette</a></li>
              <li><a href="#colors" class="hover:text-green-700 transition">Secondary Colors</a></li>
              <li><a href="#colors" class="hover:text-green-700 transition">Neutral Tones</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Typography</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#typography" class="hover:text-green-700 transition">Font Hierarchy</a></li>
              <li><a href="#typography" class="hover:text-green-700 transition">Text Styles</a></li>
              <li><a href="#typography" class="hover:text-green-700 transition">Accessibility</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Components</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#components" class="hover:text-green-700 transition">UI Elements</a></li>
              <li><a href="#layout" class="hover:text-green-700 transition">Layout System</a></li>
              <li><a href="#layout" class="hover:text-green-700 transition">Spacing</a></li>
            </ul>
          </div>
        </div>

        <div class="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
          <p>© 2026 Bulawang Ani Philippines. All rights reserved.</p>
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
import { ref } from 'vue';

const copyColor = (color) => {
  navigator.clipboard.writeText(color);
  // You could add a toast notification here
  console.log(`Copied ${color} to clipboard`);
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

/* Animation for color swatches */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.group:hover .animate-pulse {
  animation: pulse 1s infinite;
}
</style>