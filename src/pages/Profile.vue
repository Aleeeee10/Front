<template>
  <div class="profile-container">
    <h2 class="section-title">👤 Configuración de perfil</h2>

    <div class="card">
      <form @submit.prevent="updateProfile">
        <h3>Datos personales</h3>

        <label>Email</label>
        <input v-model="email" type="email" placeholder="Correo electrónico" />

        <label>Contraseña (dejar vacío si no cambia)</label>
        <input v-model="password" type="password" placeholder="Nueva contraseña" />

        <label>Rol</label>
        <input type="text" :value="user.role" disabled />

        <label>Nombre</label>
        <input v-model="name" type="text" placeholder="Tu nombre" />
      </form>

      <form @submit.prevent="savePreferences" class="preferences-form">
        <h3>Preferencias de apariencia</h3>

        <label>Tema</label>
        <select v-model="theme">
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
          <option value="blue">Azul profundo</option>
          <option value="green">Verde selva</option>
          <option value="pink">Rosa suave</option>
        </select>

        <label>Fuente</label>
        <select v-model="font">
          <option>Arial</option>
          <option>Roboto</option>
          <option>Poppins</option>
          <option>Open Sans</option>
          <option>Lato</option>
          <option>Montserrat</option>
        </select>

        <label>Color principal</label>
        <input type="color" v-model="color" class="color-input" />

        <!-- Botones al final -->
        <div class="buttons">
          <button @click.prevent="updateProfile" class="btn-primary">Guardar perfil</button>
          <button type="submit" class="btn-secondary">Guardar apariencia</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const token = localStorage.getItem('token') || ''
const authHeader = { Authorization: `Bearer ${token}` }

const user = ref({})
const name = ref('')
const email = ref('')
const password = ref('')

const theme = ref('light')
const font = ref('Arial')
const color = ref('#00ffc1')

const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

const fetchProfile = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/users/me', {
      headers: authHeader,
    })
    user.value = data
    name.value = data.name || ''
    email.value = data.email || ''
  } catch (err) {
    alert('Error al obtener perfil')
  }
}

const updateProfile = async () => {
  try {
    const updateData = {
      name: name.value,
      email: email.value,
    }
    if (password.value) updateData.password = password.value

    const oldEmail = user.value.email

    await axios.put('http://localhost:3000/users/me', updateData, {
      headers: authHeader,
    })

    alert('Perfil actualizado')

    if (email.value !== oldEmail || password.value) {
      alert('Por seguridad, debes volver a iniciar sesión')
      logout()
    } else {
      password.value = ''
      await fetchProfile()
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Error al actualizar perfil')
  }
}

const fetchPreferences = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/preferences', {
      headers: authHeader,
    })
    if (data) {
      theme.value = data.theme
      font.value = data.font
      color.value = data.color
      applyTheme()
    }
  } catch (err) {
    console.warn('Sin preferencias grabadas todavía')
  }
}

const savePreferences = async () => {
  try {
    await axios.put(
      'http://localhost:3000/preferences',
      { theme: theme.value, font: font.value, color: color.value },
      { headers: authHeader }
    )
    applyTheme()
    alert('Preferencias guardadas')
  } catch (err) {
    alert('Error al guardar preferencias')
  }
}

const applyTheme = () => {
  const root = document.documentElement
  root.dataset.theme = theme.value
  root.style.setProperty('--main-color', color.value)
  root.style.setProperty('--main-font', font.value)
}

watch([theme, font, color], applyTheme)

onMounted(async () => {
  await Promise.all([fetchProfile(), fetchPreferences()])
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
