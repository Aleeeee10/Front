<template>
  <div class="profile-container">
    <h2 class="section-title">Configuración de Perfil</h2>
    <div class="card">
      <form @submit.prevent="saveProfile">
        <h3>Datos personales</h3>
        <label>
          Email
          <input v-model="userForm.email" type="email" placeholder="Correo electrónico" required />
        </label>
        <label>
          Contraseña (dejar vacío si no cambia)
          <input v-model="userForm.password" type="password" placeholder="Nueva contraseña" />
        </label>
        <label>
          Rol
          <input v-model="userForm.role" type="text" placeholder="Rol" required />
        </label>
        <label>
          Nombre
          <input v-model="userForm.name" type="text" placeholder="Tu nombre" required />
        </label>
        <div class="buttons">
          <button type="submit" class="btn-primary">Guardar perfil</button>
        </div>
      </form>
    </div>

    <div class="card" style="margin-top:2rem;">
      <form @submit.prevent="savePrefs">
        <h3>Preferencias de apariencia</h3>
        <label>
          Tema:
          <select v-model="prefs.theme">
            <option value="Claro">Claro</option>
            <option value="Oscuro">Oscuro</option>
          </select>
        </label>
        <label>
          Fuente:
          <input v-model="prefs.font" placeholder="Fuente" />
        </label>
        <label>
          Color principal:
          <input v-model="prefs.mainColor" type="color" class="color-input" />
        </label>
        <div class="buttons">
          <button type="submit" class="btn-primary">Guardar apariencia</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import instance from '@/plugins/axios'

const user = ref(null)
const userForm = ref({
  email: '',
  password: '',
  role: '',
  name: ''
})
const prefs = ref({ theme: 'Claro', font: 'Arial', mainColor: '#00ffc1' })
const csrfToken = ref('')

const fetchProfile = async () => {
  const res = await instance.get('/auth/profile', { withCredentials: true })
  user.value = res.data.user
  userForm.value.email = user.value.email
  userForm.value.role = user.value.role
  userForm.value.name = user.value.name
  userForm.value.password = ''
}
const fetchPrefs = async () => {
  const res = await instance.get('/auth/preferences', {
    headers: { 'X-CSRF-Token': csrfToken.value },
    withCredentials: true
  })
  if (res.data.preferences) prefs.value = res.data.preferences
}
const fetchCsrfToken = async () => {
  const res = await instance.get('/api/csrf-token', { withCredentials: true })
  csrfToken.value = res.data.csrfToken
  instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
}
const savePrefs = async () => {
  try {
    await instance.post('/auth/preferences', prefs.value, {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    Swal.fire('Guardado', 'Preferencias actualizadas', 'success')
  } catch {
    Swal.fire('Error', 'No se pudieron guardar las preferencias', 'error')
  }
}

// Este método requiere que tengas un endpoint para actualizar usuario (ej: /auth/profile o /auth/update)
const saveProfile = async () => {
  try {
    await instance.post('/auth/profile', userForm.value, {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    Swal.fire('Guardado', 'Perfil actualizado', 'success')
    await fetchProfile()
  } catch {
    Swal.fire('Error', 'No se pudo guardar el perfil', 'error')
  }
}

onMounted(async () => {
  await fetchCsrfToken()
  await fetchProfile()
  await fetchPrefs()
})
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 4rem auto;
  padding: 0 1rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--main-color);
}

.card {
  background: #222;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  color: #eee;
}

.card h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--main-color);
  border-bottom: 1px solid #444;
  padding-bottom: 0.5rem;
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
  font-size: 0.95rem;
}

input,
select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 2px solid transparent;
  background: #333;
  color: #fff;
  margin-top: 0.3rem;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--main-color);
  box-shadow: 0 0 0 2px rgba(0, 255, 193, 0.2);
}

.color-input {
  height: 48px;
  padding: 0;
  cursor: pointer;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: space-between;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-primary {
  background-color: var(--main-color, #00ffc1);
  color: #000;
  border: none;
}

.btn-primary:hover {
  filter: brightness(0.9);
}

.btn-secondary {
  background-color: transparent;
  color: var(--main-color);
  border: 2px solid var(--main-color);
}

.btn-secondary:hover {
  background-color: var(--main-color);
  color: #000;
}

/* 🧱 Diseño responsivo */
@media (max-width: 500px) {
  .card {
    padding: 1.5rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    flex: 100%;
  }

  .buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>

<style>
:root {
  --main-color: #00ffc1;
  --main-font: Arial, sans-serif;
}

[data-theme='dark'] {
  color-scheme: dark;
  background-color: #111;
}

[data-theme='light'] {
  background-color: #f5f5f5;
  color: #111;
}

[data-theme='blue'] {
  background-color: #001f3f;
  color: #eee;
}

[data-theme='green'] {
  background-color: #0a3d2f;
  color: #e0ffe0;
}

[data-theme='pink'] {
  background-color: #fff0f5;
  color: #222;
}

body {
  font-family: var(--main-font), sans-serif;
  margin: 0;
}
</style>