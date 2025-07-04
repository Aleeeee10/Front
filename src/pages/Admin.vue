<template>
  <div class="admin-container">
    <h1 class="admin-title">Panel Administrativo</h1>

    <nav class="admin-nav">
      <button 
        v-for="item in sections" 
        :key="item.view" 
        :class="{ active: view === item.view }"
        @click="view = item.view"
      >
        {{ item.label }}
      </button>
    </nav>

    <div class="admin-section">
      <Dashboard v-if="view === 'dashboard'" />
      <AdminTeams v-if="view === 'teams'" />
      <AdminPlayers v-if="view === 'players'" />
      <AdminReferees v-if="view === 'referees'" />
      <AdminMatches v-if="view === 'matches'" />
      <AdminNews v-if="view === 'news'" />
      <AdminStandings v-if="view === 'standings'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import Dashboard from '../pages/admin/Dashboard.vue' // Ruta corregida, comentario JS válido
import AdminTeams from '../pages/admin/AdminTeams.vue'
import AdminPlayers from '../pages/admin/AdminPlayers.vue'
import AdminReferees from '../pages/admin/AdminReferees.vue'
import AdminMatches from '../pages/admin/AdminMatches.vue'
import AdminNews from '../pages/admin/AdminNews.vue'
import AdminStandings from '../pages/admin/AdminStandings.vue'

const view = ref('dashboard')

const sections = [
  { label: 'Dashboard', view: 'dashboard' },
  { label: 'Equipos', view: 'teams' },
  { label: 'Jugadores', view: 'players' },
  { label: 'Árbitros', view: 'referees' },
  { label: 'Partidos', view: 'matches' },
  { label: 'Noticias', view: 'news' },
  { label: 'Posiciones', view: 'standings' }
]
</script>

<style scoped>
.admin-container {
  padding: 2rem;
}

.admin-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.admin-nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.admin-nav button {
  padding: 0.5rem 1rem;
  background: #2d3748;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.admin-nav button:hover {
  background: #4a5568;
}

.admin-nav button.active {
  background: #63b3ed;
  color: #1a202c;
  font-weight: bold;
}

.admin-section {
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
