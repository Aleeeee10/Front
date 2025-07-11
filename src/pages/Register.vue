<template>
  <div class="register-container">
    <h2 class="title">Registro Futbolero</h2>
    <form @submit.prevent="handleRegister" class="register-form">
      <!-- Nombre -->
      <div class="form-group">
        <label for="name" class="sr-only">Nombre</label>
        <input
          v-model="name"
          type="text"
          id="name"
          placeholder="Nombre completo"
          :class="{ invalid: nameError }"
          @blur="validateName"
        />
        <p v-if="nameError" class="error-msg">{{ nameError }}</p>
      </div>

      <!-- Correo -->
      <div class="form-group">
        <label for="email" class="sr-only">Correo</label>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="Correo electrónico"
          :class="{ invalid: emailError }"
          @blur="validateEmail"
        />
        <p v-if="emailError" class="error-msg">{{ emailError }}</p>
      </div>

      <!-- Contraseña -->
      <div class="form-group">
        <label for="password" class="sr-only">Contraseña</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="Contraseña"
          :class="{ invalid: passwordError }"
          @blur="validatePassword"
        />
        <p v-if="passwordError" class="error-msg">{{ passwordError }}</p>
      </div>

      <!-- Confirmar contraseña -->
      <div class="form-group">
        <label for="confirm" class="sr-only">Confirmar Contraseña</label>
        <input
          v-model="confirm"
          type="password"
          id="confirm"
          placeholder="Confirmar contraseña"
          :class="{ invalid: confirmError }"
          @blur="validateConfirm"
        />
        <p v-if="confirmError" class="error-msg">{{ confirmError }}</p>
      </div>

      <!-- Rol -->
      <div class="form-group">
        <label for="role" class="sr-only">Rol</label>
        <select
          v-model="role"
          id="role"
          :class="{ invalid: roleError }"
          @blur="validateRole"
        >
          <option value="">Selecciona un rol</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
        </select>
        <p v-if="roleError" class="error-msg">{{ roleError }}</p>
      </div>

      <!-- Botón -->
      <button type="submit" :disabled="!formValid">Registrarse</button>

      <!-- Link a login -->
      <p class="login-text">
        ¿Ya tienes cuenta?
        <router-link to="/" class="login-link">Inicia sesión</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import instance from '@/plugins/axios'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const role = ref('')

const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmError = ref('')
const roleError = ref('')

const csrfToken = ref('')

// Validaciones
const validateName = () => {
  nameError.value = name.value.trim() ? '' : 'El nombre es obligatorio.'
}
const validateEmail = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = 'El correo es obligatorio.'
  } else if (!regex.test(email.value)) {
    emailError.value = 'Correo inválido.'
  } else {
    emailError.value = ''
  }
}
const validatePassword = () => {
  passwordError.value =
    password.value.length < 6 ? 'La contraseña debe tener al menos 6 caracteres.' : ''
}
const validateConfirm = () => {
  confirmError.value =
    confirm.value !== password.value ? 'Las contraseñas no coinciden.' : ''
}
const validateRole = () => {
  roleError.value = role.value ? '' : 'Selecciona un rol.'
}

const formValid = computed(() =>
  name.value &&
  email.value &&
  password.value &&
  confirm.value &&
  role.value &&
  !nameError.value &&
  !emailError.value &&
  !passwordError.value &&
  !confirmError.value &&
  !roleError.value
)

// Obtener CSRF token al montar el componente
onMounted(async () => {
  try {
    const res = await instance.get('/api/csrf-token')
    csrfToken.value = res.data.csrfToken
    // Configura el token CSRF en Axios por defecto
    instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
  } catch (error) {
    Swal.fire('Error', 'No se pudo obtener el token CSRF', 'error')
  }
})

const handleRegister = async () => {
  validateName()
  validateEmail()
  validatePassword()
  validateConfirm()
  validateRole()

  if (!formValid.value) return

  try {
    await instance.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    }, {
      headers: {
        'X-CSRF-Token': csrfToken.value,
      }
    })
    Swal.fire('¡Registro exitoso!', 'Ahora puedes iniciar sesión.', 'success')
    router.push('/login')
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Error al registrar usuario', 'error')
  }
}
</script>

<style scoped>
.register-container {
  max-width: 480px;
  margin: 4rem auto;
  padding: 2.5rem 3rem;
  background: #141926;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.6);
  color: #ffffff;
  font-family: 'Segoe UI', sans-serif;
}

.title {
  margin-bottom: 2.5rem;
  font-weight: 800;
  font-size: 2.4rem;
  letter-spacing: 1px;
  text-align: center;
  color: #00ffc1;
  text-shadow: 0 0 12px #00ffc1aa;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.register-form input,
.register-form select {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  background: #252d40;
  color: #e0e0e0;
  box-shadow: inset 0 0 6px #111;
  transition: all 0.3s ease;
}

.register-form input::placeholder {
  color: #aaa;
}

.register-form input:focus,
.register-form select:focus {
  box-shadow: 0 0 8px #00ffc1;
  background: #1b2231;
}

.invalid {
  background: #3d2f3a;
  box-shadow: 0 0 8px #ff4d6d;
  color: #ff9ca7;
}

.error-msg {
  font-size: 0.85rem;
  color: #ff4d6d;
  font-weight: 600;
  margin-top: -1rem;
}

button {
  padding: 1rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #00ffc1, #00bfa6);
  color: #101010;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 6px 20px #00ffc1aa;
  transition: transform 0.2s ease, background 0.3s ease;
}

button:hover:enabled {
  background: linear-gradient(90deg, #00bfa6, #00ffc1);
  transform: scale(1.04);
}

button:disabled {
  background: #555759;
  color: #bcbcbc;
  cursor: not-allowed;
  box-shadow: none;
}

.login-text {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
  color: #ccc;
}

.login-link {
  color: #00ffc1;
  font-weight: 700;
  margin-left: 0.4rem;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
  color: #00e0b8;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Select dropdown icon */
.register-form select {
  background-image: url("data:image/svg+xml,%3Csvg fill='none' stroke='%23999' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.2rem;
  padding-right: 2.5rem;
}
</style>
