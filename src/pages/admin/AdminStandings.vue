<template>
  <div class="admin-standings-container">
    <h2 class="title">📊 Administrar Tabla de Posiciones</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <select v-model="form.teamId" required>
        <option disabled value="">Seleccionar equipo</option>
        <option v-for="team in teams" :key="team.id" :value="team.id">
          {{ team.name }}
        </option>
      </select>

      <input v-model.number="form.played" type="number" placeholder="PJ" />
      <input v-model.number="form.wins" type="number" placeholder="PG" />
      <input v-model.number="form.draws" type="number" placeholder="PE" />
      <input v-model.number="form.losses" type="number" placeholder="PP" />
      <input v-model.number="form.goals_for" type="number" placeholder="GF" />
      <input v-model.number="form.goals_against" type="number" placeholder="GC" />
      <input v-model.number="form.points" type="number" placeholder="Puntos" />

      <div class="form-buttons">
        <button type="submit" class="btn btn-submit">
          {{ editing ? 'Actualizar' : 'Crear' }}
        </button>
        <button v-if="editing" @click.prevent="cancelEdit" class="btn btn-cancel">
          Cancelar
        </button>
      </div>
    </form>

    <div class="table-wrapper">
      <table class="standings-table">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>Dif</th>
            <th>Pts</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in standings" :key="row.id">
            <td>{{ row.team?.name }}</td>
            <td>{{ row.played }}</td>
            <td>{{ row.wins }}</td>
            <td>{{ row.draws }}</td>
            <td>{{ row.losses }}</td>
            <td>{{ row.goals_for }}</td>
            <td>{{ row.goals_against }}</td>
            <td>{{ row.goal_diff }}</td>
            <td>{{ row.points }}</td>
            <td>
              <button @click="editStanding(row)" class="btn-icon">✏️</button>
              <button @click="deleteStanding(row.id)" class="btn-icon">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const teams = ref([])
const standings = ref([])
const editing = ref(false)

const form = ref({
  id: null,
  teamId: '',
  played: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goals_for: 0,
  goals_against: 0,
  points: 0
})

const fetchTeams = async () => {
  const res = await axios.get('http://localhost:3000/teams')
  teams.value = res.data
}

const fetchStandings = async () => {
  const res = await axios.get('http://localhost:3000/standings')
  standings.value = res.data
}

const handleSubmit = async () => {
  const payload = {
    team: { id: form.value.teamId },
    played: form.value.played,
    wins: form.value.wins,
    draws: form.value.draws,
    losses: form.value.losses,
    goals_for: form.value.goals_for,
    goals_against: form.value.goals_against,
    goal_diff: form.value.goals_for - form.value.goals_against,
    points: form.value.points
  }

  if (editing.value) {
    await axios.put(`http://localhost:3000/standings/${form.value.id}`, payload)
  } else {
    await axios.post('http://localhost:3000/standings', payload)
  }

  resetForm()
  fetchStandings()
}

const editStanding = (row) => {
  form.value = {
    id: row.id,
    teamId: row.team?.id,
    played: row.played,
    wins: row.wins,
    draws: row.draws,
    losses: row.losses,
    goals_for: row.goals_for,
    goals_against: row.goals_against,
    points: row.points
  }
  editing.value = true
}

const deleteStanding = async (id) => {
  if (confirm('¿Eliminar este registro?')) {
    await axios.delete(`http://localhost:3000/standings/${id}`)
    fetchStandings()
  }
}

const cancelEdit = () => resetForm()

const resetForm = () => {
  form.value = {
    id: null,
    teamId: '',
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goals_for: 0,
    goals_against: 0,
    points: 0
  }
  editing.value = false
}

onMounted(() => {
  fetchTeams()
  fetchStandings()
})
</script>

<style scoped>
.admin-standings-container {
  max-width: 1000px;
  margin: auto;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2d3748;
}

.form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.form input,
.form select {
  flex: 1 1 120px;
  padding: 0.6rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  font-size: 1rem;
  min-width: 100px;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  flex-basis: 100%;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-submit {
  background-color: #3182ce;
  color: white;
}
.btn-submit:hover {
  background-color: #2b6cb0;
}

.btn-cancel {
  background-color: #e53e3e;
  color: white;
}
.btn-cancel:hover {
  background-color: #c53030;
}

.table-wrapper {
  overflow-x: auto;
}

.standings-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.standings-table th,
.standings-table td {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  text-align: center;
  font-size: 0.95rem;
}

.standings-table th {
  background-color: #edf2f7;
  color: #2d3748;
  font-weight: 600;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
