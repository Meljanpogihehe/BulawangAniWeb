// resources/js/stores/wishlist.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  // Initialize as empty array, not undefined
  const wishlist = ref([])

  const addItem = (product) => {
    const exists = wishlist.value.some(item => item.id === product.id)
    if (!exists) {
      wishlist.value.push(product)
      saveToLocalStorage()
    }
  }

  const removeItem = (productId) => {
    wishlist.value = wishlist.value.filter(item => item.id !== productId)
    saveToLocalStorage()
  }

  const toggleItem = (product) => {
    const exists = wishlist.value.some(item => item.id === product.id)
    if (exists) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  const clearWishlist = () => {
    wishlist.value = []
    saveToLocalStorage()
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist.value))
  }

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem('wishlist')
    if (stored) {
      wishlist.value = JSON.parse(stored)
    }
  }

  // Load wishlist on store initialization
  loadFromLocalStorage()

  return {
    wishlist,
    addItem,
    removeItem,
    toggleItem,
    clearWishlist
  }
})