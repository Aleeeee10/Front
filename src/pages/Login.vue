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

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const csrfToken = ref('')

const userStore = useUserStore()
const router = useRouter()

const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'El correo es obligatorio.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Introduce un correo válido.'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'La contraseña es obligatoria.'
  } else if (password.value.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres.'
  } else {
    passwordError.value = ''
  }
}

const formValid = computed(() => {
  return email.value && password.value && !emailError.value && !passwordError.value
})

const handleLogin = async () => {
  validateEmail()
  validatePassword()
  if (!formValid.value) return

  try {
    const response = await instance.post('/auth/login', {
      email: email.value,
      password: password.value
    }, {
      headers: {
        'X-CSRF-Token': csrfToken.value
      }
    })

    // Guarda el usuario en el store
    userStore.setUser(response.data.user)

    if (response.data.user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/') // Home.vue está en la ruta raíz
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Login inválido')
  }
}

onMounted(async () => {
  try {
    const res = await instance.get('/api/csrf-token')
    csrfToken.value = res.data.csrfToken
    instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
  } catch (error) {
    // Maneja el error si no se puede obtener el token
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
}

.title {
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 2.2rem;
  letter-spacing: 1.5px;
  color: #00ffc1;
  text-shadow: 0 0 8px #00ffc1;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.login-form input {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.3s ease, background 0.3s ease;
  background: #2a2a3e;
  color: #eee;
  box-shadow: inset 0 0 5px #111;
}

.login-form input::placeholder {
  color: #999;
}

.login-form input:focus {
  box-shadow: 0 0 8px #00ffc1;
  background: #1f1f2e;
}

.login-form input.invalid {
  box-shadow: 0 0 8px #ff4d6d;
  background: #3b2f3a;
  color: #ff7f8f;
}

.error-msg {
  margin: -1rem 0 1rem;
  font-size: 0.9rem;
  color: #ff4d6d;
  font-weight: 600;
  text-align: left;
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form button {
  padding: 0.85rem 0;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #00ffc1, #00e0b8);
  color: #0a0a0a;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 14px #00ffc1aa;
}

.login-form button:hover:enabled {
  background: linear-gradient(90deg, #00e0b8, #00ffc1);
  transform: scale(1.05);
}

.login-form button:active:enabled {
  transform: scale(0.98);
}

.login-form button:disabled {
  background: #555759;
  cursor: not-allowed;
  box-shadow: none;
  color: #b2b2b2;
  transform: none;
}

.register-text {
  margin-top: 1.6rem;
  font-size: 1rem;
  color: #bbb;
}

.register-link {
  color: #00ffc1;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link:hover,
.register-link:focus {
  color: #00e0b8;
  outline: none;
  text-decoration: underline;
}

/* Ocultar labels pero accesibles */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}
</style>
