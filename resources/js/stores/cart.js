// resources/js/stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Initialize as empty array, not undefined
  const items = ref([])

  // NEW: Add promo and fee states
  const promoApplied = ref(false)
  const deliveryFee = ref(50)
  const serviceFee = ref(20)

  const addItem = (product, quantity = 1) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        ...product,
        quantity
      })
    }
    saveToLocalStorage()
  }

  const removeItem = (productId) => {
    items.value = items.value.filter(item => item.id !== productId)
    saveToLocalStorage()
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = quantity
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        saveToLocalStorage()
      }
    }
  }

  const clearCart = () => {
    items.value = []
    promoApplied.value = false // NEW: Reset promo when clearing cart
    saveToLocalStorage()
  }

  // NEW: Add function to clear corrupted cart data
  const clearCorruptedCart = () => {
    localStorage.removeItem('cart')
    localStorage.removeItem('promoApplied')
    items.value = []
    promoApplied.value = false
    console.log('Corrupted cart data cleared from localStorage')
  }

  const cartTotal = computed(() => {
    try {
      return items.value.reduce((total, item) => {
        if (!item || !item.price || !item.quantity) return total
        const price = parseFloat(item.price.replace(',', ''))
        return total + (price * item.quantity)
      }, 0)
    } catch (error) {
      console.error('Error calculating cart total:', error)
      return 0
    }
  })

  const cartCount = computed(() => {
    try {
      return items.value.reduce((count, item) => {
        if (!item || !item.quantity) return count
        return count + item.quantity
      }, 0)
    } catch (error) {
      console.error('Error calculating cart count:', error)
      return 0
    }
  })

  // NEW: Add aliases for Cart.vue compatibility
  const totalItems = computed(() => cartCount.value)
  const subtotal = computed(() => cartTotal.value)

  // NEW: Add discount calculation
  const discount = computed(() => {
    return promoApplied.value ? subtotal.value * 0.1 : 0
  })

  // NEW: Add total with fees calculation
  const total = computed(() => {
    return subtotal.value + deliveryFee.value + serviceFee.value - discount.value
  })

  // NEW: Add promo code function
  const applyPromoCode = (code) => {
    const validCodes = ['HARVEST10', 'FRESH10', 'FARM10']
    if (validCodes.includes(code.toUpperCase())) {
      promoApplied.value = true
      return true
    }
    return false
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
    localStorage.setItem('promoApplied', JSON.stringify(promoApplied.value)) // NEW: Save promo state
  }

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        const parsedItems = JSON.parse(stored)
        // Validate and clean items
        const validItems = parsedItems.filter(item => {
          return item &&
                 typeof item === 'object' &&
                 item.id &&
                 (item.name || item.id) &&
                 item.price &&
                 item.quantity &&
                 item.quantity > 0
        })
        
        // Add default values for missing properties
        const cleanedItems = validItems.map(item => ({
          id: item.id,
          name: item.name || `Product ${item.id}`,
          price: item.price || '0',
          img: item.img || '/images/default-product.jpg',
          unit: item.unit || 'Unit',
          origin: item.origin || 'Philippines',
          quantity: item.quantity || 1
        }))
        
        items.value = cleanedItems
        console.log('Cart loaded from localStorage:', cleanedItems)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        items.value = []
      }
    }
    // NEW: Load promo state
    const storedPromo = localStorage.getItem('promoApplied')
    if (storedPromo) {
      try {
        promoApplied.value = JSON.parse(storedPromo)
      } catch (error) {
        console.error('Error loading promo state:', error)
        promoApplied.value = false
      }
    }
  }

  // Load cart on store initialization
  loadFromLocalStorage()

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    // NEW: Add new exports
    promoApplied,
    deliveryFee,
    serviceFee,
    totalItems,
    subtotal,
    discount,
    total,
    applyPromoCode
  }
})