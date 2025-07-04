// src/main.js
import './assets/tailwind.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { usePreferencesStore } from '@/stores/preferences'

axios.defaults.baseURL = 'http://localhost:3000'
axios.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

const app   = createApp(App)
const pinia = createPinia()

app.config.globalProperties.$axios = axios
app.use(pinia)
app.use(router)

;(async () => {
  const prefStore = usePreferencesStore(pinia)
  try {
    await prefStore.fetch()
  } finally {
    prefStore.applyTheme()
    app.mount('#app')
  }
})()
