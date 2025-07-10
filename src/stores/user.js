import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {
    async login(email, password) {
      const res = await api.post('/auth/login', { email, password })
      this.user = res.data.user
      this.token = null
      localStorage.removeItem('token')
    },

    setUser(user) {
      this.user = user
    },

    async fetchMe() {
      const res = await api.get('/auth/profile')
      this.user = res.data.user
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
