import * as AuthServices from '@/apis/authServices'
import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoggedIn: false,
  }),
  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
    getUser: (state) => state.user,
    getUserPermissions: (state) => state.user?.Permission || [],
    isShipper: (state) => state.user?.Permission?.includes('Deliver'),
  },
  actions: {
    async login(credentials) {
      try {
        const response = await AuthServices.loginAPI(credentials)
        this.accessToken = response.data.accessToken
        this.refreshToken = response.data.refreshToken
        this.user = jwtDecode(this.accessToken)
        this.isLoggedIn = true
        localStorage.setItem('accessToken', this.accessToken)
        localStorage.setItem('refreshToken', this.refreshToken)
        return response
      } catch (error) {
        throw error
      }
    },
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.isLoggedIn = false

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    autoLogin() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        this.accessToken = token
        try {
          this.user = jwtDecode(this.accessToken)
          this.isLoggedIn = true
        } catch (error) {
          this.logout()
        }
      }
    },
  },
})
