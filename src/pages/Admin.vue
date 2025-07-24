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
      <AdminResults v-if="view === 'results'" />
      <AdminMatchResults v-if="view === 'matchResults'" />
      <AdminNews v-if="view === 'news'" />
      <AdminStandings v-if="view === 'standings'" />
      <AdminStats v-if="view === 'stats'" />
      <AdminFields v-if="view === 'fields'" />
      <AdminDivisions v-if="view === 'divisions'" />
      <AdminUsers v-if="view === 'users'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

import Dashboard from '../pages/admin/Dashboard.vue'
import AdminTeams from '../pages/admin/AdminTeams.vue'
import AdminPlayers from '../pages/admin/AdminPlayers.vue'
import AdminReferees from '../pages/admin/AdminReferees.vue'
import AdminMatches from '../pages/admin/AdminMatches.vue'
import AdminResults from '../pages/admin/AdminResults.vue'
import AdminMatchResults from '../pages/admin/AdminMatchResults.vue'
import AdminNews from '../pages/admin/AdminNews.vue'
import AdminStandings from '../pages/admin/AdminStandings.vue'
import AdminStats from '../pages/admin/AdminStats.vue'
import AdminFields from '../pages/admin/AdminFields.vue'
import AdminDivisions from '../pages/admin/AdminDivisions.vue'
import AdminUsers from '../pages/admin/AdminUsers.vue'
import instance from '@/plugins/axios'

const view = ref('dashboard')

const sections = [
  { label: 'Dashboard', view: 'dashboard' },
  { label: 'Equipos', view: 'teams' },
  { label: 'Jugadores', view: 'players' },
  { label: 'Árbitros', view: 'referees' },
  { label: 'Partidos', view: 'matches' },
  { label: 'Resultados', view: 'results' },
  { label: 'Resultados de Partidos', view: 'matchResults' },
  { label: 'Noticias', view: 'news' },
  { label: 'Posiciones', view: 'standings' },
  { label: 'Estadísticas', view: 'stats' },
  { label: 'Campos', view: 'fields' },
  { label: 'Divisiones', view: 'divisions' },
  { label: 'Usuarios', view: 'users' }
]
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2d3748;
}

.admin-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.admin-nav button {
  padding: 0.5rem 1rem;
  border: none;
  background: #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-nav button:hover,
.admin-nav button.active {
  background: #3182ce;
  color: white;
}

.admin-section {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
