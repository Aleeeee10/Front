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
      <AdminUsers v-if="view === 'users'" />
      <AdminStats v-if="view === 'stats'" />
      <AdminResults v-if="view === 'results'" />
      <AdminPlayerDetails v-if="view === 'playerDetails'" />
      <AdminMatchResults v-if="view === 'matchResults'" />
      <AdminFields v-if="view === 'fields'" />
      <AdminDivisions v-if="view === 'divisions'" />


      <!-- Perfil y preferencias aquí -->
      <div v-if="view === 'profile'">
        <h2>Mi Perfil</h2>
        <div v-if="user">
          <p><b>Nombre:</b> {{ user.name }}</p>
          <p><b>Email:</b> {{ user.email }}</p>
          <p><b>Rol:</b> {{ user.role }}</p>
        </div>
        <form @submit.prevent="savePrefs" class="prefs-form">
          <h3>Preferencias</h3>
          <label>
            Tema:
            <select v-model="prefs.theme">
              <option value="Claro">Claro</option>
              <option value="Oscuro">Oscuro</option>
            </select>
          </label>
          <label>
            Fuente:
            <input v-model="prefs.font" placeholder="Fuente" />
          </label>
          <label>
            Color principal:
            <input v-model="prefs.mainColor" type="color" />
          </label>
          <button type="submit">Guardar preferencias</button>
        </form>
      </div>
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

=======
import AdminUsers from '../pages/admin/AdminUsers.vue'
import AdminStats from '../pages/admin/AdminStats.vue'
import AdminResults from '../pages/admin/AdminResults.vue'
import AdminPlayerDetails from '../pages/admin/AdminPlayerDetails.vue'
import AdminMatchResults from '../pages/admin/AdminMatchResults.vue'
import AdminFields from '../pages/admin/AdminFields.vue'
import AdminDivisions from '../pages/admin/AdminDivisions.vue'
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
  { label: 'Usuarios', view: 'users' },
  { label: 'Perfil', view: 'profile' }
=======
  { label: 'Perfil', view: 'profile' },
  { label: 'Usuarios', view: 'users' },
  { label: 'Estadísticas', view: 'stats' },
  { label: 'Resultados', view: 'results' },
  { label: 'Detalles Jugador', view: 'playerDetails' },
  { label: 'Resultados Partidos', view: 'matchResults' },
  { label: 'Campos', view: 'fields' },
  { label: 'Divisiones', view: 'divisions' }
]

// Perfil y preferencias
const user = ref(null)
const prefs = ref({ theme: 'Claro', font: 'Arial', mainColor: '#00ffc1' })
const csrfToken = ref('')

const fetchProfile = async () => {
  try {
    const res = await instance.get('/auth/profile')
    user.value = res.data.user
  } catch {
    Swal.fire('Error', 'No se pudo obtener el perfil', 'error')
  }
}
const fetchPrefs = async () => {
  try {
    const res = await instance.get('/auth/preferences')
    if (res.data && res.data.preferences) prefs.value = res.data.preferences
  } catch {
    Swal.fire('Error', 'No se pudieron obtener las preferencias', 'error')
  }
}
const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token', { withCredentials: true })
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}
const savePrefs = async () => {
  try {
    await instance.post('/auth/preferences', prefs.value, {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    Swal.fire('Guardado', 'Preferencias actualizadas', 'success')
  } catch {
    Swal.fire('Error', 'No se pudieron guardar las preferencias', 'error')
  }
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchProfile()
  await fetchPrefs()
})
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

.prefs-form {
  margin-top: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.prefs-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.prefs-form select,
.prefs-form input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.prefs-form button {
  padding: 0.5rem 1rem;
  background: #2d3748;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.prefs-form button:hover {
  background: #4a5568;
}
</style>
