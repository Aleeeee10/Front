<template>
  <div class="admin-players-container">
    <h2 class="title">⚽ Administrar Jugadores</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <input v-model="form.name" type="text" placeholder="Nombre" required />
      <input v-model="form.photo_url" type="text" placeholder="Foto URL" />
      <input v-model="form.number" type="number" placeholder="Número" required />
      <input v-model="form.position" type="text" placeholder="Posición" required />

      <select v-model="form.teamId" required>
        <option disabled value="">Seleccione equipo</option>
        <option v-for="team in teams" :key="team.id" :value="team.id">
          {{ team.name }}
        </option>
      </select>

      <div class="form-buttons">
        <button type="submit" class="btn btn-submit">
          {{ editing ? 'Actualizar Jugador' : 'Crear Jugador' }}
        </button>
        <button v-if="editing" @click.prevent="cancelEdit" class="btn btn-cancel">
          Cancelar
        </button>
      </div>
    </form>

    <div class="table-wrapper">
      <table class="player-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Foto</th>          
            <th>Número</th>
            <th>Posición</th>
            <th>Equipo</th>
            <th>Goles</th>
            <th>🟨</th>
            <th>🟥</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in players" :key="player.id">
            <td>{{ player.id }}</td>
            <td>{{ player.name }}</td>
            <td class="p-3">
              <img
                :src="player.photo_url"
                alt="logo"
                class="w-10 h-10 object-contain mx-auto"
              />
            </td>
            <td>{{ player.number }}</td>
            <td>{{ player.position }}</td>
            <td>{{ player.team?.name }}</td>
            <td>{{ player.goals }}</td>
            <td>{{ player.yellow_cards }}</td>
            <td>{{ player.red_cards }}</td>
            <td>
              <button @click="editPlayer(player)" class="btn-icon">✏️</button>
              <button @click="deletePlayer(player.id)" class="btn-icon">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const players = ref([])
const teams = ref([])
const editing = ref(false)

const form = ref({
  id: null,
  name: '',
  photo_url: '',
  number: '',
  position: '',
  teamId: ''
})

const fetchPlayers = async () => {
  const res = await axios.get('http://localhost:3000/players')
  players.value = res.data
}

const fetchTeams = async () => {
  const res = await axios.get('http://localhost:3000/teams')
  teams.value = res.data
}

const handleSubmit = async () => {
  const payload = {
    ...form.value,
    team: { id: form.value.teamId }
  }

  if (editing.value) {
    await axios.put(`http://localhost:3000/players/${form.value.id}`, payload)
  } else {
    await axios.post('http://localhost:3000/players', payload)
  }

  resetForm()
  fetchPlayers()
}

const editPlayer = (player) => {
  form.value = {
    id: player.id,
    name: player.name,
    photo_url: player.photo_url,
    number: player.number,
    position: player.position,
    teamId: player.team?.id || ''
  }
  editing.value = true
}

const cancelEdit = () => {
  resetForm()
}

const deletePlayer = async (id) => {
  if (confirm('¿Eliminar jugador permanentemente?')) {
    await axios.delete(`http://localhost:3000/players/${id}`)
    fetchPlayers()
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    photo_url: '',
    number: '',
    position: '',
    teamId: ''
  }
  editing.value = false
}

onMounted(() => {
  fetchPlayers()
  fetchTeams()
})
</script>

<style scoped>
.admin-players-container {
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
  flex: 1 1 200px;
  padding: 0.6rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  font-size: 1rem;
  min-width: 180px;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-basis: 100%;
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

.table-wrapper {
  overflow-x: auto;
}

.player-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.player-table th,
.player-table td {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  text-align: center;
  font-size: 0.95rem;
}

.player-table th {
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
