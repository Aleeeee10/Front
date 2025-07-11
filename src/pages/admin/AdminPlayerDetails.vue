<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">📋 Detalles de Jugadores</h2>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="bg-gray-100 rounded-lg p-6 flex flex-wrap gap-4 mb-10">
      <select v-model="form.playerId" required class="flex-1 min-w-[200px] p-3 border rounded">
        <option disabled value="">Seleccionar Jugador</option>
        <option v-for="player in players" :key="player.id" :value="player.id">
          {{ player.name }}
        </option>
      </select>

      <input v-model.number="form.edad" type="number" placeholder="Edad" class="flex-1 p-3 border rounded" required />
      <input v-model.number="form.estatura" type="number" placeholder="Estatura (cm)" class="flex-1 p-3 border rounded" required />
      <input v-model.number="form.peso" type="number" placeholder="Peso (kg)" class="flex-1 p-3 border rounded" required />
      <input v-model="form.categoria" type="text" placeholder="Categoría" class="flex-1 p-3 border rounded" required />

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
            <th class="p-3 border">Jugador</th>
            <th class="p-3 border">Edad</th>
            <th class="p-3 border">Estatura</th>
            <th class="p-3 border">Peso</th>
            <th class="p-3 border">Categoría</th>
            <th class="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in details" :key="item.id" class="border-t hover:bg-gray-50">
            <td class="p-3">{{ item.id }}</td>
            <td class="p-3">{{ item.player?.name }}</td>
            <td class="p-3">{{ item.edad }}</td>
            <td class="p-3">{{ item.estatura }} cm</td>
            <td class="p-3">{{ item.peso }} kg</td>
            <td class="p-3">{{ item.categoria }}</td>
            <td class="p-3 space-x-2">
              <button @click="editDetail(item)" class="text-blue-600 hover:text-blue-800 text-lg">✏️</button>
              <button @click="deleteDetail(item.id)" class="text-red-600 hover:text-red-800 text-lg">🗑️</button>
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

const details = ref([])
const players = ref([])
const csrfToken = ref('')
const editing = ref(false)

const form = ref({
  id: null,
  playerId: '',
  edad: 0,
  estatura: 0,
  peso: 0,
  categoria: ''
})

const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token', { withCredentials: true })
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}

const fetchDetails = async () => {
  try {
    const res = await instance.get('/detalle-jugadores', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    details.value = res.data
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar los detalles', 'error')
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
      await instance.put(`/detalle-jugadores/${form.value.id}`, payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Actualizado', 'Detalle actualizado correctamente', 'success')
    } else {
      await instance.post('/detalle-jugadores', payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Creado', 'Detalle creado correctamente', 'success')
    }
    resetForm()
    fetchDetails()
  } catch (err) {
    Swal.fire('Error', 'No se pudo guardar el detalle', 'error')
  }
}

const editDetail = (item) => {
  form.value = {
    id: item.id,
    playerId: item.playerId,
    edad: item.edad,
    estatura: item.estatura,
    peso: item.peso,
    categoria: item.categoria
  }
  editing.value = true
}

const deleteDetail = async (id) => {
  if (confirm('¿Eliminar este detalle?')) {
    try {
      await instance.delete(`/detalle-jugadores/${id}`, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      fetchDetails()
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
    playerId: '',
    edad: 0,
    estatura: 0,
    peso: 0,
    categoria: ''
  }
  editing.value = false
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchPlayers()
  await fetchDetails()
})
</script>
