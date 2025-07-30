<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">⚽ Administrar Equipos</h2>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="bg-gray-100 rounded-lg p-6 flex flex-wrap gap-4 mb-10">
      <input
        v-model="form.name"
        type="text"
        placeholder="Nombre del equipo"
        required
        class="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        v-model="form.logo_url"
        type="text"
        placeholder="Logo URL"
        class="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        v-model="form.division"
        required
        class="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option disabled value="">Entrenador</option>
        <option>Pep Guardiola</option>
        <option>Jürgen Klopp</option>
        <option>Carlo Ancelotti</option>
        <option>Diego Simeone</option>
        <option>Xavi Hernández</option>
      </select>

      <!-- Botones -->
      <div class="w-full flex gap-4 mt-2">
        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {{ editing ? 'Actualizar' : 'Crear' }}
        </button>
        <button
          v-if="editing"
          @click.prevent="cancelEdit"
          class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
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
            <th class="p-3 border">Logo</th>
            <th class="p-3 border">Nombre</th>
            <th class="p-3 border">Entrenador</th>
            <th class="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in teams" :key="team.id" class="border-t hover:bg-gray-50">
            <td class="p-3">{{ team.id }}</td>
            <td class="p-3">
              <img
                :src="team.logo || 'https://via.placeholder.com/40'"
                alt="logo"
                class="w-10 h-10 object-contain mx-auto"
                @error="$event.target.src='https://via.placeholder.com/40'"
              />
            </td>
            <td class="p-3">{{ team.nombre }}</td>
            <td class="p-3">{{ team.entrenador || 'Sin entrenador' }}</td>
            <td class="p-3 space-x-2">
              <button @click="editTeam(team)" class="text-blue-600 hover:text-blue-800 text-lg">✏️</button>
              <button @click="deleteTeam(team.id)" class="text-red-600 hover:text-red-800 text-lg">🗑️</button>
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

const teams = ref([])
const editing = ref(false)
const csrfToken = ref('')

const form = ref({
  id: null,
  name: '',
  logo_url: '',
  division: ''
})

const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token')
  csrfToken.value = res.data.csrfToken
  // Opcional: setea por defecto para todas las requests
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}

const fetchTeams = async () => {
  try {
    console.log('🔍 Obteniendo equipos...')
    const res = await instance.get('/teams/all', {
      headers: {
        'X-CSRF-Token': csrfToken.value
      }
    })
    console.log('✅ Equipos obtenidos:', res.data)
    teams.value = res.data
  } catch (err) {
    console.error('❌ Error al obtener equipos:', err)
    Swal.fire('Error', 'No se pudieron cargar los equipos', 'error')
  }
}

const handleSubmit = async () => {
  try {
    console.log('🚀 Enviando datos del equipo:', form.value)
    
    if (editing.value) {
      console.log('✏️ Actualizando equipo ID:', form.value.id)
      await instance.put(`/teams/update/${form.value.id}`, {
        nombre: form.value.name,
        logo: form.value.logo_url,
        entrenador: form.value.division // Temporalmente usando division como entrenador
      }, {
        headers: {
          'X-CSRF-Token': csrfToken.value
        }
      })
      Swal.fire('Actualizado', 'Equipo actualizado correctamente', 'success')
    } else {
      console.log('➕ Creando nuevo equipo')
      await instance.post('/teams/create', {
        nombre: form.value.name,
        logo: form.value.logo_url,
        entrenador: form.value.division // Temporalmente usando division como entrenador
      }, {
        headers: {
          'X-CSRF-Token': csrfToken.value
        }
      })
      Swal.fire('Creado', 'Equipo creado correctamente', 'success')
    }
    resetForm()
    fetchTeams()
  } catch (err) {
    console.error('❌ Error al guardar equipo:', err)
    Swal.fire('Error', 'No se pudo guardar el equipo', 'error')
  }
}

const editTeam = (team) => {
  console.log('✏️ Editando equipo:', team)
  form.value = {
    id: team.id,
    name: team.nombre,
    logo_url: team.logo,
    division: team.entrenador || ''
  }
  editing.value = true
}

const deleteTeam = async (id) => {
  if (confirm('¿Estás seguro de eliminar este equipo?')) {
    try {
      console.log('🗑️ Eliminando equipo ID:', id)
      await instance.delete(`/teams/delete/${id}`, {
        headers: {
          'X-CSRF-Token': csrfToken.value
        }
      })
      fetchTeams()
      Swal.fire('Eliminado', 'Equipo eliminado correctamente', 'success')
    } catch (err) {
      console.error('❌ Error al eliminar equipo:', err)
      Swal.fire('Error', 'No se pudo eliminar el equipo', 'error')
    }
  }
}

const cancelEdit = () => resetForm()

const resetForm = () => {
  form.value = { id: null, name: '', logo_url: '', division: '' }
  editing.value = false
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchTeams()
})
</script>
