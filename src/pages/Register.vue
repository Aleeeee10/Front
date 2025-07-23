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

      <!-- ✅ NUEVO: Selección de Rol -->
      <div class="form-group">
        <label for="rol">¿Cuál es tu rol en el fútbol?</label>
        <select v-model="selectedRole" id="rol" :class="{ invalid: roleError }">
          <option value="">Selecciona tu rol</option>
          <option v-for="role in availableRoles" :key="role.idRoles" :value="role.idRoles">
            {{ role.nombre }} - {{ role.descripcion }}
          </option>
        </select>
        <p v-if="roleError" class="error-msg">{{ roleError }}</p>
      </div>

      <!-- Avatar (opcional) -->
      <div class="form-group">
        <label for="avatar" class="sr-only">Avatar URL</label>
        <input
          v-model="avatar"
          type="url"
          id="avatar"
          placeholder="URL del avatar (opcional)"
        />
      </div>

      <!-- Preferencias -->
      <div class="form-group">
        <label for="tema">Tema preferido:</label>
        <select v-model="tema" id="tema">
          <option value="claro">Claro</option>
          <option value="oscuro">Oscuro</option>
        </select>
      </div>

      <div class="form-group">
        <label for="idioma">Idioma:</label>
        <select v-model="idioma" id="idioma">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      <div class="form-group checkbox-group">
        <input 
          v-model="notificacionesEnabled" 
          type="checkbox" 
          id="notifications"
        />
        <label for="notifications">Recibir notificaciones</label>
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

// ✅ Variables existentes
const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const avatar = ref('')
const tema = ref('claro')
const idioma = ref('es')
const notificacionesEnabled = ref(true)

// ✅ NUEVAS Variables para roles
const selectedRole = ref('')
const availableRoles = ref([])
const roleError = ref('')

const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmError = ref('')
const csrfToken = ref('')

// ✅ NUEVA: Validación de rol
const validateRole = () => {
  roleError.value = selectedRole.value ? '' : 'Debes seleccionar un rol.'
}

// Validaciones existentes
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

// ✅ ACTUALIZAR: FormValid incluye validación de rol
const formValid = computed(() =>
  name.value &&
  email.value &&
  password.value &&
  confirm.value &&
  selectedRole.value &&  // ✅ Agregar validación de rol
  !nameError.value &&
  !emailError.value &&
  !passwordError.value &&
  !confirmError.value &&
  !roleError.value  // ✅ Agregar validación de rol
)

// ✅ NUEVA: Función para cargar roles disponibles
const loadAvailableRoles = async () => {
  try {
    // ✅ Usar la ruta correcta
    const response = await instance.get('/roles/disponibles')
    
    availableRoles.value = response.data
    
    console.log('Roles disponibles:', availableRoles.value)
  } catch (error) {
    console.error('Error al cargar roles:', error)
    Swal.fire('Error', 'No se pudieron cargar los roles disponibles', 'error')
    
    // Roles por defecto si falla la carga
    availableRoles.value = [
      { idRoles: 1, nombre: 'Administrador', descripcion: 'Administrador del sistema' },
      { idRoles: 2, nombre: 'Usuario', descripcion: 'Usuario regular' },
      { idRoles: 3, nombre: 'Moderador', descripcion: 'Moderador de contenido' },
      { idRoles: 4, nombre: 'Entrenador', descripcion: 'Entrenador de equipos' },
      { idRoles: 5, nombre: 'Jugador', descripcion: 'Jugador de fútbol' }
    ]
  }
}

// Obtener CSRF token y cargar roles al montar el componente
onMounted(async () => {
  try {
    // Cargar token CSRF
    const res = await instance.get('/api/csrf-token', { withCredentials: true })
    csrfToken.value = res.data.csrfToken
    instance.defaults.headers['X-CSRF-Token'] = csrfToken.value
    
    // Cargar roles disponibles
    await loadAvailableRoles()
    
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
    const response = await instance.post('/auth/register', {
      nombre: name.value,
      email: email.value,
      contraseña: password.value,
      avatar: avatar.value || null,
      tema: tema.value,
      idioma: idioma.value,
      notificacionesEnabled: notificacionesEnabled.value,
      idRole: parseInt(selectedRole.value)
    }, {
      headers: {
        'X-CSRF-Token': csrfToken.value,
      },
      withCredentials: true
    })

    if (response.data.success) {
      const selectedRoleName = availableRoles.value.find(r => r.idRoles === parseInt(selectedRole.value))?.nombre || 'Usuario'
      
      Swal.fire({
        title: '¡Registro exitoso!',
        text: `Te has registrado como ${selectedRoleName}. ${response.data.message}`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })
      
      // ✅ NUEVO: Redirigir según el rol registrado
      setTimeout(() => {
        if (selectedRoleName === 'Administrador') {
          // Si se registró como admin, ir al login para que inicie sesión
          router.push('/login?message=Ahora inicia sesión como administrador')
        } else {
          // Otros roles van al login normal
          router.push('/login')
        }
      }, 2500)
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al registrar usuario'
    Swal.fire('Error', errorMessage, 'error')
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
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

input, select {
  padding: 0.875rem 1rem;
  border: 2px solid #2a2d47;
  border-radius: 10px;
  background: #1a1d35;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #00ffc1;
  box-shadow: 0 0 0 3px rgba(0, 255, 193, 0.1);
}

input.invalid, select.invalid {
  border-color: #ff6b6b;
  animation: shake 0.3s ease-in-out;
}

.error-msg {
  color: #ff6b6b;
  font-size: 0.875rem;
  font-weight: 500;
}

label {
  color: #a0a0a0;
  font-size: 0.95rem;
  font-weight: 600;
}

button {
  padding: 0.875rem;
  background: linear-gradient(135deg, #00ffc1, #00d4aa);
  color: #141926;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 255, 193, 0.4);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.login-text {
  text-align: center;
  margin-top: 1.5rem;
  color: #888;
  font-size: 0.95rem;
}

.login-link {
  color: #00ffc1;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}

/* ✅ NUEVOS: Estilos específicos para el selector de rol */
.form-group select {
  cursor: pointer;
}

.form-group select option {
  background: #1a1d35;
  color: #ffffff;
  padding: 0.5rem;
}

.form-group label:not(.sr-only) {
  margin-bottom: 0.5rem;
  display: block;
}

/* Resaltar el selector de rol */
#rol {
  border-color: #00ffc1;
  background: linear-gradient(135deg, #1a1d35, #1e2142);
}

#rol:focus {
  border-color: #00ffc1;
  box-shadow: 0 0 0 3px rgba(0, 255, 193, 0.2);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
