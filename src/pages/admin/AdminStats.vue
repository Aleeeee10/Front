<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">📈 Administrar Estadísticas</h2>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="bg-gray-100 rounded-lg p-6 flex flex-wrap gap-4 mb-10">
      <input
        v-model="form.nombre"
        type="text"
        placeholder="Nombre de la estadística"
        required
        class="flex-1 min-w-[200px] p-3 border rounded"
      />
      <input
        v-model="form.descripcion"
        type="text"
        placeholder="Descripción"
        class="flex-1 min-w-[200px] p-3 border rounded"
      />

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
            <th class="p-3 border">Nombre</th>
            <th class="p-3 border">Descripción</th>
            <th class="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stats" :key="item.id" class="border-t hover:bg-gray-50">
            <td class="p-3">{{ item.id }}</td>
            <td class="p-3">{{ item.nombre }}</td>
            <td class="p-3">{{ item.descripcion }}</td>
            <td class="p-3 space-x-2">
              <button @click="editStat(item)" class="text-blue-600 hover:text-blue-800 text-lg">✏️</button>
              <button @click="deleteStat(item.id)" class="text-red-600 hover:text-red-800 text-lg">🗑️</button>
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

const stats = ref([])
const csrfToken = ref('')
const editing = ref(false)

const form = ref({
  id: null,
  nombre: '',
  descripcion: ''
})

const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token', { withCredentials: true })
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}

const fetchStats = async () => {
  try {
    const res = await instance.get('/estadisticas', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    stats.value = res.data
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar las estadísticas', 'error')
  }
}

const handleSubmit = async () => {
  const payload = {
    nombre: form.value.nombre,
    descripcion: form.value.descripcion
  }

  try {
    if (editing.value) {
      await instance.put(`/estadisticas/${form.value.id}`, payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Actualizado', 'Estadística actualizada correctamente', 'success')
    } else {
      await instance.post('/estadisticas', payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Creada', 'Estadística creada correctamente', 'success')
    }
    resetForm()
    fetchStats()
  } catch (err) {
    Swal.fire('Error', 'No se pudo guardar la estadística', 'error')
  }
}

const editStat = (item) => {
  form.value = {
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion
  }
  editing.value = true
}

const deleteStat = async (id) => {
  if (confirm('¿Eliminar esta estadística?')) {
    try {
      await instance.delete(`/estadisticas/${id}`, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      fetchStats()
      Swal.fire('Eliminada', 'Estadística eliminada correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar la estadística', 'error')
    }
  }
}

const cancelEdit = () => resetForm()

const resetForm = () => {
  form.value = {
    id: null,
    nombre: '',
    descripcion: ''
  }
  editing.value = false
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchStats()
})
</script>
