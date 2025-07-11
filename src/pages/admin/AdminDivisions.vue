<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">🏆 Administrar Divisiones</h2>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit" class="bg-gray-100 rounded-lg p-6 flex flex-col gap-4 mb-10">
      <input
        v-model="form.nombre"
        type="text"
        placeholder="Nombre de la división"
        required
        class="p-3 border rounded"
      />
      <textarea
        v-model="form.descripcion"
        placeholder="Descripción"
        rows="3"
        class="p-3 border rounded resize-y"
      ></textarea>

      <div class="flex gap-4">
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
          <tr v-for="item in divisions" :key="item.id" class="border-t hover:bg-gray-50">
            <td class="p-3">{{ item.id }}</td>
            <td class="p-3">{{ item.nombre }}</td>
            <td class="p-3">{{ item.descripcion }}</td>
            <td class="p-3 space-x-2">
              <button @click="editDivision(item)" class="text-blue-600 hover:text-blue-800 text-lg">✏️</button>
              <button @click="deleteDivision(item.id)" class="text-red-600 hover:text-red-800 text-lg">🗑️</button>
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

const divisions = ref([])
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

const fetchDivisions = async () => {
  try {
    const res = await instance.get('/divisiones', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    divisions.value = res.data
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar las divisiones', 'error')
  }
}

const handleSubmit = async () => {
  const payload = { ...form.value }

  try {
    if (editing.value) {
      await instance.put(`/divisiones/${form.value.id}`, payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Actualizado', 'División actualizada correctamente', 'success')
    } else {
      await instance.post('/divisiones', payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Creada', 'División creada correctamente', 'success')
    }
    resetForm()
    fetchDivisions()
  } catch (err) {
    Swal.fire('Error', 'No se pudo guardar la división', 'error')
  }
}

const editDivision = (item) => {
  form.value = {
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion
  }
  editing.value = true
}

const deleteDivision = async (id) => {
  if (confirm('¿Eliminar esta división?')) {
    try {
      await instance.delete(`/divisiones/${id}`, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      fetchDivisions()
      Swal.fire('Eliminada', 'División eliminada correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar la división', 'error')
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
  await fetchDivisions()
})
</script>
