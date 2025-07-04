<template>
  <div class="standings-container">
    <h1 class="title">Tabla de Posiciones</h1>

    <div v-if="loading" class="loading">Cargando posiciones...</div>

    <table v-else class="standings-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Equipo</th>
          <th>PJ</th>
          <th>PG</th>
          <th>PE</th>
          <th>PP</th>
          <th>GF</th>
          <th>GC</th>
          <th>Dif</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(team, index) in standings"
          :key="team.id"
          :style="{ '--i': index }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ team.team?.name || 'Sin equipo' }}</td>
          <td>{{ team.played }}</td>
          <td>{{ team.wins }}</td>
          <td>{{ team.draws }}</td>
          <td>{{ team.losses }}</td>
          <td>{{ team.goals_for }}</td>
          <td>{{ team.goals_against }}</td>
          <td>{{ team.goal_diff }}</td>
          <td>{{ team.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const standings = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/standings')
    standings.value = res.data
  } catch (err) {
    alert('Error al cargar la tabla')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.standings-container {
  padding: 2rem;
  max-width: 950px;
  margin: auto;
}

.title {
  font-size: 2rem;
  color: #3d0066;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
  text-shadow: 0 2px 8px #e0c3fc;
}

.loading {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin-top: 2rem;
}

.standings-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 12px rgba(61,0,102,0.08);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  border: 3px solid #ffd600;
}

.standings-table th,
.standings-table td {
  padding: 0.7rem 0.5rem;
  text-align: center;
  border-bottom: 2px solid #ffd600;
  font-size: 1.08rem;
}

.standings-table th {
  background-color: #4b006e;
  color: #ffd600;
  font-weight: 700;
  border-bottom: 4px solid #ffd600;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.standings-table tbody tr:nth-child(even) {
  background-color: #f9f6ff;
}

.standings-table tbody tr:nth-child(odd) {
  background-color: #fff;
}

.standings-table tbody tr {
  transition: transform 0.18s cubic-bezier(.4,2.3,.3,1), box-shadow 0.18s;
  cursor: pointer;
  opacity: 0;
  transform: translateY(30px) scale(0.98);
  animation: fadeInParticle 0.7s cubic-bezier(.4,2.3,.3,1) forwards;
  animation-delay: calc(var(--i) * 0.08s);
}

.standings-table tbody tr:hover {
  background-color: #ffe066;
  transform: scale(1.04);
  box-shadow: 0 4px 18px #ffd60055;
  z-index: 2;
}

@keyframes fadeInParticle {
  to {
    opacity: 1;
    transform: translateY(0) scale(1.04);
  }
}

.standings-table td:first-child,
.standings-table th:first-child {
  color: #4b006e;
  font-weight: bold;
}

.standings-table td {
  color: #3d0066;
  font-weight: 500;
}

.standings-table td:nth-child(2) {
  text-align: left;
  padding-left: 1rem;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.standings-table td:last-child,
.standings-table th:last-child {
  font-weight: bold;
}

@media (max-width: 700px) {
  .standings-container {
    padding: 0.5rem;
  }
  .standings-table th, .standings-table td {
    padding: 0.4rem 0.2rem;
    font-size: 0.95rem;
  }
}
</style>
