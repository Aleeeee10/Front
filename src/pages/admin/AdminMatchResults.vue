<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">🎯 Detalle de Resultados por Jugador</h2>

    <form @submit.prevent="handleSubmit" class="bg-gray-100 rounded-lg p-6 flex flex-wrap gap-4 mb-10">
      <select v-model="form.matchId" required class="flex-1 min-w-[200px] p-3 border rounded">
        <option disabled value="">Seleccionar Partido</option>
        <option v-for="match in matches" :key="match.id" :value="match.id">
          {{ match.team1?.name }} vs {{ match.team2?.name }} ({{ match.date }})
        </option>
      </select>

      <select v-model="form.playerId" required class="flex-1 min-w-[200px] p-3 border rounded">
        <option disabled value="">Seleccionar Jugador</option>
        <option v-for="player in players" :key="player.id" :value="player.id">
          {{ player.name }}
        </option>
      </select>

      <input v-model.number="form.goals" type="number" placeholder="Goles" class="flex-1 p-3 border rounded" />
      <input v-model.number="form.assists" type="number" placeholder="Asistencias" class="flex-1 p-3 border rounded" />
      <input v-model.number="form.yellow_cards" type="number" placeholder="🟨" class="flex-1 p-3 border rounded" />
      <input v-model.number="form.red_cards" type="number" placeholder="🟥" class="flex-1 p-3 border rounded" />

      <div class="w-full flex gap-4 mt-2">
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {{ editing ? 'Actualizar' : 'Crear' }}
        </button>
        <button v-if="editing" @click.prevent="cancelEdit" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
          Cancelar
        </button>
      </div>
    </form>

    <div class="overflow-x-auto">
      <table class="w-full text-sm text-center bg-white border border-gray-200 rounded-lg shadow-md">
        <thead class="bg-gray-200 text-gray-800 font-semibold">
          <tr>
            <th class="p-3 border">ID</th>
            <th class="p-3 border">Partido</th>
            <th class="p-3 border">Jugador</th>
            <th class="p-3 border">Goles</th>
            <th class="p-3 border">Asistencias</th>
            <th class="p-3 border">🟨</th>
            <th class="p-3 border">🟥</th>
            <th class="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in matchResults" :key="item.id" class="border-t hover:bg-gray-50">
            <td class="p-3">{{ item.id }}</td>
            <td class="p-3">
              {{ item.match?.team1?.name }} vs {{ item.match?.team2?.name }}
            </td>
            <td class="p-3">{{ item.player?.name }}</td>
            <td class="p-3">{{ item.goals }}</td>
            <td class="p-3">{{ item.assists }}</td>
            <td class="p-3">{{ item.yellow_cards }}</td>
            <td class="p-3">{{ item.red_cards }}</td>
            <td class="p-3 space-x-2">
              <button @click="editMatchResult(item)" class="text-blue-600 hover:text-blue-800 text-lg">✏️</button>
              <button @click="deleteMatchResult(item.id)" class="text-red-600 hover:text-red-800 text-lg">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import instance from '@/plugins/axios'

const matchResults = ref([])
const matches = ref([])
const players = ref([])
const csrfToken = ref('')
const editing = ref(false)

const form = ref({
  id: null,
  matchId: '',
  playerId: '',
  goals: 0,
  assists: 0,
  yellow_cards: 0,
  red_cards: 0
})

const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token', { withCredentials: true })
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}

const fetchMatchResults = async () => {
  try {
    const res = await instance.get('/detalle-resultados', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    matchResults.value = res.data
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar los datos', 'error')
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

const fetchPlayers = async () => {
  try {
    const res = await instance.get('/players', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    players.value = res.data
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar los jugadores', 'error')
  }
}

const handleSubmit = async () => {
  const payload = { ...form.value }

  try {
    if (editing.value) {
      await instance.put(`/detalle-resultados/${form.value.id}`, payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Actualizado', 'Detalle actualizado correctamente', 'success')
    } else {
      await instance.post('/detalle-resultados', payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Creado', 'Detalle creado correctamente', 'success')
    }
    resetForm()
    fetchMatchResults()
  } catch (err) {
    Swal.fire('Error', 'No se pudo guardar el detalle', 'error')
  }
}

const editMatchResult = (item) => {
  form.value = {
    id: item.id,
    matchId: item.matchId,
    playerId: item.playerId,
    goals: item.goals,
    assists: item.assists,
    yellow_cards: item.yellow_cards,
    red_cards: item.red_cards
  }
  editing.value = true
}

const deleteMatchResult = async (id) => {
  if (confirm('¿Eliminar este detalle?')) {
    try {
      await instance.delete(`/detalle-resultados/${id}`, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      fetchMatchResults()
      Swal.fire('Eliminado', 'Detalle eliminado correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el detalle', 'error')
    }
  }
}

const cancelEdit = () => resetForm()

const resetForm = () => {
  form.value = {
    id: null,
    matchId: '',
    playerId: '',
    goals: 0,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0
  }
  editing.value = false
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchMatches()
  await fetchPlayers()
  await fetchMatchResults()
})
</script>
