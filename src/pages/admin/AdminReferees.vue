<template>
  <div class="admin-referees-container">
    <h2 class="title">👨‍⚖️ Administrar Árbitros</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <input v-model="form.name" placeholder="Nombre" required />
      <input v-model="form.photo_url" placeholder="URL de foto" />
      <input v-model="form.nationality" placeholder="Nacionalidad" required />
      <input v-model.number="form.age" type="number" placeholder="Edad" />

      <div class="form-buttons">
        <button type="submit" class="btn btn-submit">
          {{ editing ? 'Actualizar Árbitro' : 'Crear Árbitro' }}
        </button>
        <button v-if="editing" @click.prevent="cancelEdit" class="btn btn-cancel">
          Cancelar
        </button>
      </div>
    </form>

    <div class="table-wrapper">
      <table class="referees-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Nacionalidad</th>
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ref in referees" :key="ref.id">
            <td>{{ ref.id }}</td>
            <td>{{ ref.name }}</td>
            <td>{{ ref.nationality }}</td>
            <td>{{ ref.age }}</td>
            <td>
              <button @click="editReferee(ref)" class="btn-icon">✏️</button>
              <button @click="deleteReferee(ref.id)" class="btn-icon">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import instance from '@/plugins/axios'

const referees = ref([])
const editing = ref(false)
const csrfToken = ref('')

const form = ref({
  id: null,
  name: '',
  photo_url: '',
  nationality: '',
  age: 0
})

const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token', { withCredentials: true })
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
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

const handleSubmit = async () => {
  const payload = {
    name: form.value.name,
    photo_url: form.value.photo_url,
    nationality: form.value.nationality,
    age: form.value.age
  }

  try {
    if (editing.value) {
      await instance.put(`/referees/${form.value.id}`, payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Actualizado', 'Árbitro actualizado correctamente', 'success')
    } else {
      await instance.post('/referees', payload, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      Swal.fire('Creado', 'Árbitro creado correctamente', 'success')
    }
    resetForm()
    fetchReferees()
  } catch (err) {
    Swal.fire('Error', 'No se pudo guardar el árbitro', 'error')
  }
}

const editReferee = (referee) => {
  form.value = {
    id: referee.id,
    name: referee.name,
    photo_url: referee.photo_url,
    nationality: referee.nationality,
    age: referee.age
  }
  editing.value = true
}

const cancelEdit = () => resetForm()

const deleteReferee = async (id) => {
  if (confirm('¿Eliminar este árbitro?')) {
    try {
      await instance.delete(`/referees/${id}`, {
        headers: { 'X-CSRF-Token': csrfToken.value },
        withCredentials: true
      })
      fetchReferees()
      Swal.fire('Eliminado', 'Árbitro eliminado correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el árbitro', 'error')
    }
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    photo_url: '',
    nationality: '',
    age: 0
  }
  editing.value = false
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchReferees()
})
</script>

<style scoped>
.admin-referees-container {
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

.referees-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.referees-table th,
.referees-table td {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  text-align: center;
  font-size: 0.95rem;
}

.referees-table th {
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
