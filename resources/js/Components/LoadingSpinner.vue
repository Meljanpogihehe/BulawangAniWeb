<template>
  <div class="fixed inset-0 bg-slate-50 flex items-center justify-center z-50">
    <div class="text-center">
      <!-- Logo Animation -->

      <div class="flex justify-center mb-6">
        <div class="relative">
          <!-- Outer ring -->
          <div class="w-16 h-16 border-4 border-green-200 rounded-full"></div>
          <!-- Spinning inner ring -->
          <div class="absolute top-0 left-0 w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
          <!-- Center dot -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-600 rounded-full"></div>
        </div>
      </div>

      <!-- Loading Text -->
      <p class="text-gray-600 font-medium">Loading fresh products...</p>
      <p class="text-xs text-gray-400 mt-2">Connecting to our farmers</p>
    </div>
  </div>
</template>

<script setup>
// No script needed for this simple component
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 0.5s linear infinite;
}

.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>