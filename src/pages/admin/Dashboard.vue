<template>
  <div class="dashboard">
    <h1>📊 Panel de Administración</h1>

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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  totals: { users: 0, players: 0, teams: 0, matches: 0, referees: 0, news: 0 },
  recent: { users: [], matches: [] }
})

const newsList = ref([])

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

async function fetchStats() {
  try {
    const res = await axios.get('http://localhost:3000/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    stats.value = res.data
  } catch (error) {
    console.error('Error al cargar dashboard:', error)
  }
}

async function fetchNews() {
  try {
    const res = await axios.get('http://localhost:3000/news')
    newsList.value = res.data.slice(0, 5) // Solo las 5 últimas noticias
  } catch (error) {
    console.error('Error al cargar noticias:', error)
  }
}

onMounted(() => {
  fetchStats()
  fetchNews()
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
</style>
