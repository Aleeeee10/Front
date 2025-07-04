// src/stores/preferences.ts
import { defineStore } from 'pinia'
import { getPreferences, savePreferences } from '../services/userPreferences' // usa el alias

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    loaded: false,
    theme: 'light',
    font : 'Arial',
    color: '#00ffc1',
  }),
  actions: {
    /** Carga preferencias del usuario si existen */
    async fetch() {
      if (this.loaded) return
      try {
        const { data } = await getPreferences()   // ← puede lanzar 401
        if (data) Object.assign(this, data)
      } catch (err) {
        console.warn('No hay preferencias o el token es inválido', err)
        // No abortamos la app; simplemente seguimos con valores por defecto
      } finally {
        this.loaded = true
      }
    },

    async update(payload) {
      const { data } = await savePreferences(payload)
      Object.assign(this, data)
      this.applyTheme()
    },

    applyTheme() {
      const root = document.documentElement
      root.dataset.theme = this.theme
      root.style.setProperty('--main-color', this.color)
      root.style.setProperty('--main-font',  this.font)
    },
  },
})
