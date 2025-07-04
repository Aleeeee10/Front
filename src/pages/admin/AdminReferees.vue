<template>
  <div class="admin-referees-container">
    <h2 class="title">👨‍⚖️ Administrar Árbitros</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <input v-model="form.name" placeholder="Nombre" required />
      <input v-model="form.photo_url" placeholder="URL de foto" />
      <input v-model="form.city" placeholder="Ciudad" required />

      <select v-model="form.gender" required>
        <option disabled value="">Género</option>
        <option>Masculino</option>
        <option>Femenino</option>
      </select>

      <input v-model="form.roles" placeholder="Roles (separados por coma)" />
      <input v-model.number="form.yellow_cards" type="number" placeholder="Tarjetas amarillas" />
      <input v-model.number="form.red_cards" type="number" placeholder="Tarjetas rojas" />

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
            <th>Ciudad</th>
            <th>Género</th>
            <th>Roles</th>
            <th>🟨</th>
            <th>🟥</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ref in referees" :key="ref.id">
            <td>{{ ref.id }}</td>
            <td>{{ ref.name }}</td>
            <td>{{ ref.city }}</td>
            <td>{{ ref.gender }}</td>
            <td>{{ ref.roles?.join(', ') }}</td>
            <td>{{ ref.yellow_cards }}</td>
            <td>{{ ref.red_cards }}</td>
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
import axios from 'axios'

const referees = ref([])
const editing = ref(false)

const form = ref({
  id: null,
  name: '',
  photo_url: '',
  city: '',
  gender: '',
  roles: '',
  yellow_cards: 0,
  red_cards: 0
})

const fetchReferees = async () => {
  const res = await axios.get('http://localhost:3000/referees')
  referees.value = res.data
}

const handleSubmit = async () => {
  const payload = {
    ...form.value,
    roles: form.value.roles.split(',').map(r => r.trim())
  }

  if (editing.value) {
    await axios.put(`http://localhost:3000/referees/${form.value.id}`, payload)
  } else {
    await axios.post('http://localhost:3000/referees', payload)
  }

  resetForm()
  fetchReferees()
}

const editReferee = (referee) => {
  form.value = {
    id: referee.id,
    name: referee.name,
    photo_url: referee.photo_url,
    city: referee.city,
    gender: referee.gender,
    roles: referee.roles.join(', '),
    yellow_cards: referee.yellow_cards,
    red_cards: referee.red_cards
  }
  editing.value = true
}

const cancelEdit = () => resetForm()

const deleteReferee = async (id) => {
  if (confirm('¿Eliminar este árbitro?')) {
    await axios.delete(`http://localhost:3000/referees/${id}`)
    fetchReferees()
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    photo_url: '',
    city: '',
    gender: '',
    roles: '',
    yellow_cards: 0,
    red_cards: 0
  }
  editing.value = false
}

onMounted(fetchReferees)
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
