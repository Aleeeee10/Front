<template>
  <div class="admin-container">
    <h2 class="title">⚽ Administrar Partidos</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <select v-model="form.team1Id" required>
        <option disabled value="">Equipo 1</option>
        <option v-for="team in teams" :key="team.id" :value="team.id">
          {{ team.name }}
        </option>
      </select>

      <select v-model="form.team2Id" required>
        <option disabled value="">Equipo 2</option>
        <option v-for="team in teams" :key="team.id" :value="team.id">
          {{ team.name }}
        </option>
      </select>

      <input v-model="form.league" placeholder="Liga / División" required />
      <input v-model="form.date" type="date" required />
      <input v-model="form.time" type="time" required />

      <select v-model="form.status">
        <option>Programado</option>
        <option>En Vivo</option>
        <option>Finalizado</option>
      </select>

      <input v-model.number="form.score_team1" type="number" placeholder="Goles equipo 1" min="0" />
      <input v-model.number="form.score_team2" type="number" placeholder="Goles equipo 2" min="0" />

      <div class="form-buttons">
        <button type="submit" class="btn btn-submit">
          {{ editing ? 'Actualizar Partido' : 'Crear Partido' }}
        </button>
        <button v-if="editing" @click.prevent="cancelEdit" class="btn btn-cancel">
          Cancelar
        </button>
      </div>
    </form>

    <table class="matches-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Equipos</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Liga</th>
          <th>Estado</th>
          <th>Resultado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in matches" :key="match.id">
          <td>{{ match.id }}</td>
          <td>{{ match.team1?.name }} vs {{ match.team2?.name }}</td>
          <td>{{ match.date }}</td>
          <td>{{ match.time }}</td>
          <td>{{ match.league }}</td>
          <td>{{ match.status }}</td>
          <td>{{ match.score_team1 }} - {{ match.score_team2 }}</td>
          <td>
            <button @click="editMatch(match)" class="btn-icon">✏️</button>
            <button @click="deleteMatch(match.id)" class="btn-icon">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const matches = ref([])
const teams = ref([])
const editing = ref(false)

const form = ref({
  id: null,
  team1Id: '',
  team2Id: '',
  league: '',
  date: '',
  time: '',
  status: 'Programado',
  score_team1: 0,
  score_team2: 0
})

const fetchTeams = async () => {
  const res = await axios.get('http://localhost:3000/teams')
  teams.value = res.data
}

const fetchMatches = async () => {
  const res = await axios.get('http://localhost:3000/matches')
  matches.value = res.data
}

const handleSubmit = async () => {
  const payload = {
    team1: { id: form.value.team1Id },
    team2: { id: form.value.team2Id },
    league: form.value.league,
    date: form.value.date,
    time: form.value.time,
    status: form.value.status,
    score_team1: form.value.score_team1,
    score_team2: form.value.score_team2
  }

  if (editing.value) {
    await axios.put(`http://localhost:3000/matches/${form.value.id}`, payload)
  } else {
    await axios.post('http://localhost:3000/matches', payload)
  }

  resetForm()
  fetchMatches()
}

const editMatch = (match) => {
  form.value = {
    id: match.id,
    team1Id: match.team1?.id,
    team2Id: match.team2?.id,
    league: match.league,
    date: match.date,
    time: match.time,
    status: match.status,
    score_team1: match.score_team1,
    score_team2: match.score_team2
  }
  editing.value = true
}

const cancelEdit = () => {
  resetForm()
}

const deleteMatch = async (id) => {
  if (confirm('¿Eliminar este partido?')) {
    await axios.delete(`http://localhost:3000/matches/${id}`)
    fetchMatches()
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    team1Id: '',
    team2Id: '',
    league: '',
    date: '',
    time: '',
    status: 'Programado',
    score_team1: 0,
    score_team2: 0
  }
  editing.value = false
}

onMounted(() => {
  fetchTeams()
  fetchMatches()
})
</script>

<style scoped>
.admin-container {
  max-width: 1000px;
  margin: auto;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #2d3748;
}

.form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
}

.form input,
.form select {
  flex: 1 1 200px;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  font-size: 0.95rem;
}

.form-buttons {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-submit {
  background-color: #2b6cb0;
  color: white;
}
.btn-submit:hover {
  background-color: #2c5282;
}

.btn-cancel {
  background-color: #e53e3e;
  color: white;
}
.btn-cancel:hover {
  background-color: #c53030;
}

.matches-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
}

.matches-table th,
.matches-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
}

.matches-table th {
  background-color: #edf2f7;
  color: #4a5568;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}
</style>
