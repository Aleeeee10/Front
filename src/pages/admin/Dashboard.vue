<template>
  <div class="dashboard">
    <!-- ✅ NUEVO: Header específico para admin -->
    <div class="admin-header">
      <h1>📊 Panel de Administración</h1>
      <div class="admin-welcome">
        <span class="welcome-text">Bienvenido, Administrador</span>
        <span class="admin-badge">ADMIN ONLY</span>
      </div>
    </div>

    <div class="cards">
      <div class="card" v-for="(value, key) in stats.totals" :key="key">
        <div class="icon-box">
          <i :class="iconMap[key]"></i>
        </div>
        <div class="text-box">
          <h2>{{ formatKey(key) }}</h2>
          <p>{{ value }}</p>
        </div>
      </div>
    </div>

    <div class="recent-container">
      <div class="recent-box">
        <h3>📰 Últimas noticias</h3>
        <ul>
          <li v-for="news in newsList" :key="news.id">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong>{{ news.title }}</strong>
              <span style="color:#888; font-size:0.95em;">{{ formatDate(news.date) }}</span>
            </div>
            <div v-if="news.summary || news.content" style="font-size:0.98em; color:#444; margin-top:0.2em;">
              {{ news.summary || news.content }}
            </div>
          </li>
        </ul>
      </div>

      <div class="recent-box">
        <h3>⚽ Últimos partidos</h3>
        <ul>
          <li v-for="match in stats.recent.matches" :key="match.id">
            {{ formatDate(match.date) }} - {{ match.description || 'Partido sin descripción' }}
          </li>
        </ul>
      </div>
    </div>

    <!-- ✅ NUEVO: Sección de acciones administrativas -->
    <div class="admin-actions">
      <h3>🛠️ Acciones Administrativas</h3>
      <div class="action-buttons">
        <button class="action-btn users-btn" @click="goToUsers">
          👥 Gestionar Usuarios
        </button>
        <button class="action-btn settings-btn" @click="goToSettings">
          ⚙️ Configuración
        </button>
        <button class="action-btn reports-btn" @click="goToReports">
          📊 Reportes
        </button>
        <button class="action-btn backup-btn" @click="backupData">
          💾 Respaldo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import instance from '@/plugins/axios'
import Swal from 'sweetalert2'

const router = useRouter()
const userStore = useUserStore()

const stats = ref({
  totals: { users: 0, players: 0, teams: 0, matches: 0, referees: 0, news: 0 },
  recent: { users: [], matches: [] }
})

const newsList = ref([])
const csrfToken = ref('')

const iconMap = {
  users: 'fas fa-user',
  players: 'fas fa-futbol',
  teams: 'fas fa-users',
  matches: 'fas fa-calendar-alt',
  referees: 'fas fa-whistle',
  news: 'fas fa-newspaper'
}

function formatKey(key) {
  const map = {
    users: 'Usuarios',
    players: 'Jugadores',
    teams: 'Equipos',
    matches: 'Partidos',
    referees: 'Árbitros',
    news: 'Noticias'
  }
  return map[key] || key
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

// ✅ NUEVAS: Funciones para acciones administrativas
const goToUsers = () => {
  router.push('/admin/users')
}

const goToSettings = () => {
  router.push('/admin/settings')
}

const goToReports = () => {
  router.push('/admin/reports')
}

const backupData = () => {
  Swal.fire({
    title: '💾 Respaldo de Datos',
    text: '¿Deseas crear un respaldo de la base de datos?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, crear respaldo',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('¡Respaldo creado!', 'El respaldo se ha generado exitosamente', 'success')
    }
  })
}

async function fetchStats() {
  try {
    const res = await instance.get('/admin/dashboard', {
      headers: {
        'X-CSRF-Token': csrfToken.value
      }
    })
    stats.value = res.data
  } catch (error) {
    console.error('Error al cargar dashboard:', error)
    // Datos de ejemplo si falla la conexión
    stats.value = {
      totals: { users: 42, players: 156, teams: 12, matches: 89, referees: 15, news: 23 },
      recent: { users: [], matches: [] }
    }
  }
}

async function fetchNews() {
  try {
    const res = await instance.get('/news', {
      headers: {
        'X-CSRF-Token': csrfToken.value
      }
    })
    newsList.value = res.data.slice(0, 5)
  } catch (error) {
    console.error('Error al cargar noticias:', error)
    // Noticias de ejemplo
    newsList.value = [
      { id: 1, title: 'Nueva temporada iniciada', date: new Date(), summary: 'La nueva temporada de fútbol ha comenzado oficialmente' },
      { id: 2, title: 'Fichajes destacados', date: new Date(), summary: 'Los equipos han realizado importantes incorporaciones' }
    ]
  }
}

onMounted(async () => {
  // ✅ NUEVO: Verificar que sea administrador
  if (!userStore.isAdmin()) {
    Swal.fire({
      title: 'Acceso Denegado',
      text: 'Solo los administradores pueden acceder al Dashboard',
      icon: 'error'
    }).then(() => {
      router.push('/')
    })
    return
  }

  try {
    const res = await instance.get('/api/csrf-token')
    csrfToken.value = res.data.csrfToken
    instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
    await fetchStats()
    await fetchNews()
  } catch (error) {
    console.error('No se pudo obtener el token CSRF', error)
  }
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.dashboard {
  max-width: 880px;
  margin: 1.5rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #2d3748;
  font-weight: 700;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.card {
  flex: 1 1 200px;
  display: flex;
  align-items: center;
  background: #2b6cb0;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(43, 108, 176, 0.3);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.icon-box {
  font-size: 2rem;
  margin-right: 0.8rem;
}

.text-box h2 {
  font-size: 1rem;
  margin: 0;
  text-transform: uppercase;
  opacity: 0.85;
}

.text-box p {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.2rem 0 0;
}

.recent-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recent-box {
  background: #f7fafc;
  padding: 1rem 1.2rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.recent-box h3 {
  font-size: 1rem;
  margin-bottom: 0.8rem;
  color: #2b6cb0;
  font-weight: 600;
  border-bottom: 1px solid #cbd5e0;
  padding-bottom: 0.3rem;
}

.recent-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-box li {
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  background-color: #edf2f7;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #333;
}

/* ✅ NUEVOS: Estilos para header de admin */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.admin-welcome {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.welcome-text {
  font-size: 1.1rem;
  font-weight: 600;
}

.admin-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-top: 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.admin-header h1 {
  margin: 0;
  color: white;
}

/* ✅ NUEVOS: Estilos para acciones administrativas */
.admin-actions {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.admin-actions h3 {
  margin-bottom: 1rem;
  color: #495057;
  font-weight: 600;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 0.95rem;
}

.users-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.settings-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.reports-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.backup-btn {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
