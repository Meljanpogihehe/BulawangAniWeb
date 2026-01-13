// resources/js/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  const isAuthenticated = computed(() => {
    return !!user.value && !!token.value
  })

  const login = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    saveToLocalStorage()
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('auth_user', JSON.stringify(user.value))
    localStorage.setItem('auth_token', token.value)
  }

  const loadFromLocalStorage = () => {
    const storedUser = localStorage.getItem('auth_user')
    const storedToken = localStorage.getItem('auth_token')
    
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser)
      token.value = storedToken
    }
  }

  // Load auth data on store initialization
  loadFromLocalStorage()

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
})