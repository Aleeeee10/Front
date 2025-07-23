<template>
  <div class="login-container" role="main" aria-label="Formulario de inicio de sesión">
    <h1 class="title">Iniciar sesión</h1>
    <form @submit.prevent="handleLogin" class="login-form" novalidate>
      <label for="email" class="sr-only">Correo electrónico</label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        required
        autocomplete="username"
        @blur="validateEmail"
        :class="{ invalid: emailError }"
        aria-describedby="email-error"
        aria-invalid="emailError ? 'true' : 'false'"
      />
      <p v-if="emailError" id="email-error" class="error-msg" role="alert">{{ emailError }}</p>

      <label for="password" class="sr-only">Contraseña</label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Contraseña"
        required
        autocomplete="current-password"
        minlength="6"
        @blur="validatePassword"
        :class="{ invalid: passwordError }"
        aria-describedby="password-error"
        aria-invalid="passwordError ? 'true' : 'false'"
      />
      <p v-if="passwordError" id="password-error" class="error-msg" role="alert">{{ passwordError }}</p>

      <button :disabled="!formValid" type="submit" aria-disabled="!formValid">Entrar</button>
    </form>

    <p class="register-text">
      ¿No tienes cuenta?
      <router-link to="/register" class="register-link">Regístrate aquí</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import instance from '@/plugins/axios'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const csrfToken = ref('')

const userStore = useUserStore()
const router = useRouter()

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
  passwordError.value = password.value.length < 6 ? 'La contraseña debe tener al menos 6 caracteres.' : ''
}

const formValid = computed(() => 
  email.value && 
  password.value && 
  !emailError.value && 
  !passwordError.value
)

const handleLogin = async () => {
  validateEmail()
  validatePassword()
  
  if (!formValid.value) return

  try {
    // ✅ Usar la ruta correcta del backend: /auth/login
    const response = await instance.post('/auth/login', {
      email: email.value,
      contraseña: password.value  // ✅ Backend espera 'contraseña', no 'password'
    }, {
      headers: {
        'X-CSRF-Token': csrfToken.value
      },
      withCredentials: true
    })

    // ✅ Verificar estructura de respuesta del backend
    if (response.data.success) {
      // ✅ NUEVO: Guardar usuario con información completa de rol
      userStore.setUser({
        id: response.data.user.id,
        nombre: response.data.user.nombre,
        email: response.data.user.email,
        avatar: response.data.user.avatar,
        role: response.data.user.role,      // ✅ Rol del usuario
        roleId: response.data.user.roleId,  // ✅ ID del rol
        preferencias: response.data.user.preferencias
      })
      
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Hola ${response.data.user.nombre}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      // ✅ NUEVO: Redirigir según el rol del usuario
      setTimeout(() => {
        console.log('🔍 Usuario logueado:', {
          role: userStore.userRole,
          roleId: userStore.roleId,
          isAdmin: userStore.isAdmin()
        })
        
        if (userStore.isAdmin()) {
          console.log('✅ Redirigiendo a admin dashboard')
          router.push('/admin/dashboard') // Admin → Dashboard
        } else {
          console.log('✅ Redirigiendo a inicio')
          router.push('/') // Otros roles → Inicio
        }
      }, 1500)
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error en el inicio de sesión'
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error'
    })
  }
}

onMounted(async () => {
  try {
    const res = await instance.get('/api/csrf-token', { withCredentials: true })
    csrfToken.value = res.data.csrfToken
    instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
  } catch (error) {
    console.error('Error obteniendo token CSRF:', error)
  }
})
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem 3rem;
  background: #1e1e2f;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  color: #ffffff;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: #00ffc1;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 8px;
  background: #2a2a3e;
  color: #fff;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #00ffc1;
  box-shadow: 0 0 0 2px rgba(0, 255, 193, 0.2);
}

input.invalid {
  border-color: #ff4757;
}

.error-msg {
  color: #ff4757;
  font-size: 0.875rem;
  margin-top: -0.5rem;
}

button {
  padding: 0.75rem;
  background: linear-gradient(135deg, #00ffc1, #00b894);
  color: #1e1e2f;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 255, 193, 0.4);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.register-text {
  text-align: center;
  margin-top: 1.5rem;
  color: #888;
}

.register-link {
  color: #00ffc1;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
