// src/main.js
import './assets/tailwind.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import { usePreferencesStore } from '@/stores/preferences'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// ✅ Inicializar stores y aplicación
;(async () => {
  const userStore = useUserStore()
  const prefStore = usePreferencesStore()
  
  try {
    // Inicializar autenticación
    await userStore.initializeStore()
    
    // Inicializar preferencias
    await prefStore.fetch()
  } catch (error) {
    console.error('Error inicializando aplicación:', error)
  } finally {
    prefStore.applyTheme()
    app.mount('#app')
  }
})()
