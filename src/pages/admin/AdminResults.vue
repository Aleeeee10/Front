<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">🎯 Administrar Resultados</h2>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="bg-gray-100 rounded-lg p-6 flex flex-wrap gap-4 mb-10">
      <select v-model="form.matchId" required class="flex-1 min-w-[200px] p-3 border rounded">
        <option disabled value="">Seleccionar Partido</option>
        <option v-for="match in matches" :key="match.id" :value="match.id">
          {{ match.team1?.name }} vs {{ match.team2?.name }} ({{ match.date }})
        </option>
      </select>

      <input v-model.number="form.team1_goals" type="number" placeholder="Goles Equipo 1" class="flex-1 p-3 border rounded" required />
      <input v-model.number="form.team2_goals" type="number" placeholder="Goles Equipo 2" class="flex-1 p-3 border rounded" required />

      <select v-model="form.winner" class="flex-1 min-w-[150px] p-3 border rounded" required>
        <option disabled value="">Ganador</option>
        <option value="team1">Equipo 1</option>
        <option value="team2">Equipo 2</option>
        <option value="draw">Empate</option>
      </select>

      <div class="w-full flex gap-4 mt-2">
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {{ editing ? 'Actualizar' : 'Crear' }}
        </button>
        <button v-if="editing" @click.prevent="cancelEdit" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
          Cancelar
        </button>
      </div>
    </form>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-center bg-white border border-gray-200 rounded-lg shadow-md">
        <thead class="bg-gray-200 text-gray-800 font-semibold">
          <tr>
            <th class="p-3 border">ID</th>
            <th class="p-3 border">Partido</th>
            <th class="p-3 border">Resultado</th>
            <th class="p-3 border">Ganador</th>
            <th class="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in results" :key="res.id" class="border-t hover:bg-gray-50">
            <td class="p-3">{{ res.id }}</td>
            <td class="p-3">
              {{ res.match?.team1?.name }} vs {{ res.match?.team2?.name }}
            </td>
            <td class="p-3">{{ res.team1_goals }} - {{ res.team2_goals }}</td>
            <td class="p-3">
              {{ res.winner === 'draw' ? 'Empate' : (res.winner === 'team1' ? res.match?.team1?.name : res.match?.team2?.name) }}
            </td>
            <td class="p-3 space-x-2">
              <button @click="editResult(res)" class="text-blue-600 hover:text-blue-800 text-lg">✏️</button>
              <button @click="deleteResult(res.id)" class="text-red-600 hover:text-red-800 text-lg">🗑️</button>
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

const results = ref([])
const matches = ref([])
const editing = ref(false)
const csrfToken = ref('')

const form = ref({
  id: null,
  matchId: '',
  team1_goals: 0,
  team2_goals: 0,
  winner: ''
})

const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token', { withCredentials: true })
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}

const fetchResults = async () => {
  try {
    const res = await instance.get('/resultados', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    results.value = res.data
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar los resultados', 'error')
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
    matchId: form.value.matchId,
    team1_goals: form.value.team1_goals,
    team2_goals: form.value.team2_goals,
    winner: form.value.winner
  }

  try {
    if (editing.value) {
      await instance.put(`/resultados/${form.value.id}`, payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Actualizado', 'Resultado actualizado correctamente', 'success')
    } else {
      await instance.post('/resultados', payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Creado', 'Resultado creado correctamente', 'success')
    }
    resetForm()
    fetchResults()
  } catch (err) {
    Swal.fire('Error', 'No se pudo guardar el resultado', 'error')
  }
}

const editResult = (item) => {
  form.value = {
    id: item.id,
    matchId: item.matchId,
    team1_goals: item.team1_goals,
    team2_goals: item.team2_goals,
    winner: item.winner
  }
  editing.value = true
}

const deleteResult = async (id) => {
  if (confirm('¿Eliminar este resultado?')) {
    try {
      await instance.delete(`/resultados/${id}`, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      fetchResults()
      Swal.fire('Eliminado', 'Resultado eliminado correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el resultado', 'error')
    }
  }
}

const cancelEdit = () => resetForm()

const resetForm = () => {
  form.value = {
    id: null,
    matchId: '',
    team1_goals: 0,
    team2_goals: 0,
    winner: ''
  }
  editing.value = false
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchMatches()
  await fetchResults()
})
</script>
