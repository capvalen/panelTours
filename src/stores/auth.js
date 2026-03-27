import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)

  const setUser = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const login = async (credentials) => {
    const response = await api.post('/login', {
      user: credentials.user,
      password: credentials.password
    })

    const { access_token, user: userData } = response.data

    setToken(access_token)
    setUser(userData)

    return { success: true }
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    logout,
    login
  }
})