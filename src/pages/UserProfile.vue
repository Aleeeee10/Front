<template>
  <div class="max-w-md mx-auto px-4 py-10">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">👤 Mi Perfil</h2>

    <form @submit.prevent="updateProfile" class="bg-gray-100 p-6 rounded-lg space-y-4">
      <div>
        <label class="block font-semibold mb-1">Correo electrónico</label>
        <input type="email" :value="user.email" disabled class="w-full p-3 border rounded bg-gray-200" />
      </div>

      <div>
        <label class="block font-semibold mb-1">Rol</label>
        <input type="text" :value="user.role" disabled class="w-full p-3 border rounded bg-gray-200" />
      </div>

      <div>
        <label class="block font-semibold mb-1">Nombre</label>
        <input v-model="name" type="text" class="w-full p-3 border rounded" required />
      </div>

      <div>
        <label class="block font-semibold mb-1">Contraseña</label>
        <input v-model="password" type="password" class="w-full p-3 border rounded" placeholder="Nueva contraseña" />
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Actualizar Perfil
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import instance from '@/plugins/axios'

const user = ref({})
const name = ref('')
const password = ref('')
const csrfToken = ref('')

const fetchProfile = async () => {
  try {
    const res = await instance.get('/api/profile', { withCredentials: true })
    user.value = res.data
    name.value = res.data.name
  } catch (err) {
    Swal.fire('Error', 'No se pudo cargar el perfil', 'error')
  }
}

const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token', { withCredentials: true })
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}

const updateProfile = async () => {
  try {
    const payload = { name: name.value }
    if (password.value.trim()) {
      payload.password = password.value
    }

    await instance.put('/api/profile', payload, {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })

    Swal.fire('Actualizado', 'Perfil actualizado correctamente', 'success')
    password.value = ''
  } catch (err) {
    Swal.fire('Error', 'No se pudo actualizar el perfil', 'error')
  }
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchProfile()
})
</script>
