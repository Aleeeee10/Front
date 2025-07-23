<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">🏟️ Administrar Canchas</h2>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="bg-gray-100 rounded-lg p-6 flex flex-wrap gap-4 mb-10">
      <input
        v-model="form.nombre"
        type="text"
        placeholder="Nombre de la cancha"
        required
        class="flex-1 p-3 border rounded"
      />
      <input
        v-model="form.ubicacion"
        type="text"
        placeholder="Ubicación"
        required
        class="flex-1 p-3 border rounded"
      />
      <input
        v-model.number="form.capacidad"
        type="number"
        placeholder="Capacidad"
        required
        class="flex-1 p-3 border rounded"
      />
      <input
        v-model="form.tipo_cesped"
        type="text"
        placeholder="Tipo de césped"
        required
        class="flex-1 p-3 border rounded"
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
            <th class="p-3 border">Ubicación</th>
            <th class="p-3 border">Capacidad</th>
            <th class="p-3 border">Césped</th>
            <th class="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="field in fields" :key="field.id" class="border-t hover:bg-gray-50">
            <td class="p-3">{{ field.id }}</td>
            <td class="p-3">{{ field.nombre }}</td>
            <td class="p-3">{{ field.ubicacion }}</td>
            <td class="p-3">{{ field.capacidad }}</td>
            <td class="p-3">{{ field.tipo_cesped }}</td>
            <td class="p-3 space-x-2">
              <button @click="editField(field)" class="text-blue-600 hover:text-blue-800 text-lg">✏️</button>
              <button @click="deleteField(field.id)" class="text-red-600 hover:text-red-800 text-lg">🗑️</button>
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

const fields = ref([])
const csrfToken = ref('')
const editing = ref(false)

const form = ref({
  id: null,
  nombre: '',
  ubicacion: '',
  capacidad: 0,
  tipo_cesped: ''
})

const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token', { withCredentials: true })
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}

const fetchFields = async () => {
  try {
    const res = await instance.get('/canchas', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    fields.value = res.data
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar las canchas', 'error')
  }
}

const handleSubmit = async () => {
  const payload = { ...form.value }

  try {
    if (editing.value) {
      await instance.put(`/canchas/${form.value.id}`, payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Actualizado', 'Cancha actualizada correctamente', 'success')
    } else {
      await instance.post('/canchas', payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Creada', 'Cancha creada correctamente', 'success')
    }
    resetForm()
    fetchFields()
  } catch (err) {
    Swal.fire('Error', 'No se pudo guardar la cancha', 'error')
  }
}

const editField = (item) => {
  form.value = {
    id: item.id,
    nombre: item.nombre,
    ubicacion: item.ubicacion,
    capacidad: item.capacidad,
    tipo_cesped: item.tipo_cesped
  }
  editing.value = true
}

const deleteField = async (id) => {
  if (confirm('¿Eliminar esta cancha?')) {
    try {
      await instance.delete(`/canchas/${id}`, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      fetchFields()
      Swal.fire('Eliminada', 'Cancha eliminada correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar la cancha', 'error')
    }
  }
}

const cancelEdit = () => resetForm()

const resetForm = () => {
  form.value = {
    id: null,
    nombre: '',
    ubicacion: '',
    capacidad: 0,
    tipo_cesped: ''
  }
  editing.value = false
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchFields()
})
</script>
