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

      <input v-model="form.date" type="date" required />
      <input v-model="form.hour" type="time" required />
      <input v-model="form.location" placeholder="Ubicación" required />

      <select v-model="form.refereeId">
        <option disabled value="">Árbitro</option>
        <option v-for="referee in referees" :key="referee.id" :value="referee.id">
          {{ referee.name }}
        </option>
      </select>

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
          <th>Ubicación</th>
          <th>Árbitro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in matches" :key="match.id">
          <td>{{ match.id }}</td>
          <td>{{ match.team1?.name }} vs {{ match.team2?.name }}</td>
          <td>{{ match.date }}</td>
          <td>{{ match.hour }}</td>
          <td>{{ match.location }}</td>
          <td>{{ match.referee?.name }}</td>
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
import Swal from 'sweetalert2'
import instance from '@/plugins/axios'

const matches = ref([])
const teams = ref([])
const referees = ref([])
const editing = ref(false)
const csrfToken = ref('')

const form = ref({
  id: null,
  team1Id: '',
  team2Id: '',
  date: '',
  hour: '',
  location: '',
  refereeId: ''
})

const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token', { withCredentials: true })
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}

const fetchTeams = async () => {
  try {
    const res = await instance.get('/teams', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    teams.value = res.data
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar los equipos', 'error')
  }
}

const fetchReferees = async () => {
  try {
    const res = await instance.get('/referees', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    referees.value = res.data
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar los árbitros', 'error')
  }
}

const fetchMatches = async () => {
  try {
    const res = await instance.get('/matches', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    matches.value = res.data
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar los partidos', 'error')
  }
}

const handleSubmit = async () => {
  const payload = {
    date: form.value.date,
    hour: form.value.hour,
    location: form.value.location,
    team1: { id: form.value.team1Id },
    team2: { id: form.value.team2Id },
    referee: form.value.refereeId ? { id: form.value.refereeId } : null
  }

  try {
    if (editing.value) {
      await instance.put(`/matches/${form.value.id}`, payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Actualizado', 'Partido actualizado correctamente', 'success')
    } else {
      await instance.post('/matches', payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Creado', 'Partido creado correctamente', 'success')
    }
    resetForm()
    fetchMatches()
  } catch (err) {
    Swal.fire('Error', 'No se pudo guardar el partido', 'error')
  }
}

const editMatch = (match) => {
  form.value = {
    id: match.id,
    team1Id: match.team1?.id || '',
    team2Id: match.team2?.id || '',
    date: match.date,
    hour: match.hour,
    location: match.location,
    refereeId: match.referee?.id || ''
  }
  editing.value = true
}

const cancelEdit = () => resetForm()

const deleteMatch = async (id) => {
  if (confirm('¿Eliminar este partido?')) {
    try {
      await instance.delete(`/matches/${id}`, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      fetchMatches()
      Swal.fire('Eliminado', 'Partido eliminado correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el partido', 'error')
    }
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    team1Id: '',
    team2Id: '',
    date: '',
    hour: '',
    location: '',
    refereeId: ''
  }
  editing.value = false
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchTeams()
  await fetchReferees()
  await fetchMatches()
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
