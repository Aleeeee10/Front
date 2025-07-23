<template>
  <div class="admin-users-container">
    <h2 class="title">👤 Administrar Usuarios</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <input v-model="form.nameUser" placeholder="Nombre completo" required />
      <input v-model="form.usernameUser" placeholder="Username" />
      <input v-model="form.emailUser" placeholder="Correo electrónico" required />
      <input v-model="form.passwordUser" type="password" placeholder="Contraseña" :required="!editing" />

      <select v-model="form.idRol" required>
        <option disabled value="">Selecciona un rol</option>
        <option v-for="rol in roles" :key="rol.id" :value="rol.id">{{ rol.name }}</option>
      </select>

      <div class="form-buttons">
        <button type="submit" class="btn btn-submit">
          {{ editing ? 'Actualizar Usuario' : 'Crear Usuario' }}
        </button>
        <button v-if="editing" @click.prevent="cancelEdit" class="btn btn-cancel">Cancelar</button>
      </div>
    </form>

    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Username</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.idUsers">
          <td>{{ user.idUsers }}</td>
          <td>{{ user.nameUser }}</td>
          <td>{{ user.usernameUser || '-' }}</td>
          <td>{{ user.emailUser }}</td>
          <td>{{ user.rol?.name || 'Sin rol' }}</td>
          <td>
            <button @click="editUser(user)" class="btn-icon">✏️</button>
            <button @click="deleteUser(user.idUsers)" class="btn-icon">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import instance from '@/plugins/axios'

const users = ref([])
const roles = ref([])
const csrfToken = ref('')
const editing = ref(false)

const form = ref({
  idUsers: null,
  nameUser: '',
  usernameUser: '',
  emailUser: '',
  passwordUser: '',
  idRol: ''
})

const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token')
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}

const fetchUsers = async () => {
  const res = await instance.get('/users')
  users.value = res.data
}

const fetchRoles = async () => {
  const res = await instance.get('/roles')
  roles.value = res.data
}

const handleSubmit = async () => {
  const payload = {
    username: form.value.usernameUser,
    email: form.value.emailUser,
    password: form.value.passwordUser,
    roleId: form.value.idRol,
    nameUser: form.value.nameUser
  }

  try {
    if (editing.value) {
      await instance.put(`/users/${form.value.idUsers}`, payload)
      Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success')
    } else {
      await instance.post('/users', payload)
      Swal.fire('Creado', 'Usuario creado correctamente', 'success')
    }
    resetForm()
    fetchUsers()
  } catch (err) {
    console.error(err)
    Swal.fire('Error', 'No se pudo guardar el usuario', 'error')
  }
}

const editUser = (user) => {
  form.value = {
    idUsers: user.idUsers,
    nameUser: user.nameUser,
    usernameUser: user.usernameUser,
    emailUser: user.emailUser,
    passwordUser: '',
    idRol: user.idRol
  }
  editing.value = true
}

const deleteUser = async (id) => {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    try {
      await instance.delete(`/users/${id}`)
      fetchUsers()
      Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success')
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el usuario', 'error')
    }
  }
}

const cancelEdit = () => resetForm()

const resetForm = () => {
  form.value = {
    idUsers: null,
    nameUser: '',
    usernameUser: '',
    emailUser: '',
    passwordUser: '',
    idRol: ''
  }
  editing.value = false
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchUsers()
  await fetchRoles()
})
</script>

<style scoped>
.admin-users-container {
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
  flex: 1 1 220px;
  padding: 0.6rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  flex-basis: 100%;
  margin-top: 0.5rem;
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

.users-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.users-table th,
.users-table td {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.users-table th {
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
