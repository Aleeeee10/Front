<template>
  <nav class="navbar">
    <div class="navbar-left flex items-center gap-3">
      <img
        src="https://voit.vtexassets.com/arquivos/ids/165716-800-800?v=538539012583330000&width=800&height=800&aspect=true"
        alt="Balón FIFA"
        class="logo-ball"
        draggable="false"
      />
      <router-link to="/" class="logo glow-fucsia">SOCIAL SOCCER</router-link>
    </div>
    <div class="navbar-right">
      <!-- ✅ Mostrar links según autenticación -->
      <template v-if="userStore.isAuthenticated">
        
        <!-- 🌐 ENLACES PÚBLICOS (para todos los usuarios autenticados) -->
        <router-link to="/profile" class="nav-link">Mi perfil</router-link>
        <router-link to="/teams" class="nav-link">Equipos</router-link>
        <router-link to="/players" class="nav-link">Jugadores</router-link>
        <router-link to="/matches" class="nav-link">Partidos</router-link>
        <router-link to="/news" class="nav-link">Noticias</router-link>
        <router-link to="/refeeres" class="nav-link">Arbitros</router-link>
        <router-link to="/standings" class="nav-link">Posiciones</router-link>
        
        <!-- 🔐 SECCIÓN ADMINISTRATIVA (SOLO para administradores) -->
        <!-- DEBUG: Mostrar información del usuario -->
        <div v-if="userStore.isAuthenticated" class="debug-info" style="font-size: 0.8rem; color: #ffd700; margin-right: 1rem;">
          Rol: {{ userStore.roleId }} | Admin: {{ isUserAdmin ? 'SÍ' : 'NO' }}
        </div>
        
        <div v-if="isUserAdmin" class="admin-section">
          <div class="admin-dropdown">
            <button class="admin-button" @click="toggleAdminMenu">
              🛠️ Administración
              <span class="dropdown-icon" :class="{ 'rotated': showAdminMenu }">▼</span>
            </button>
            
            <div v-if="showAdminMenu" class="admin-menu">
              <div class="admin-menu-header">
                <span class="admin-title">🔐 Panel Administrativo</span>
              </div>
              
              <!-- CRUDs Principales -->
              <div class="admin-section-group">
                <span class="admin-group-title">👥 Gestión de Usuarios</span>
                <router-link to="/admin/users" class="admin-menu-item" @click="closeAdminMenu">
                  <span>👤 Usuarios</span>
                </router-link>
                <router-link to="/admin/dashboard" class="admin-menu-item" @click="closeAdminMenu">
                  <span>📊 Dashboard</span>
                </router-link>
              </div>

              <div class="admin-section-group">
                <span class="admin-group-title">⚽ Gestión Deportiva</span>
                <router-link to="/admin/teams" class="admin-menu-item" @click="closeAdminMenu">
                  <span>🏆 Equipos</span>
                </router-link>
                <router-link to="/admin/players" class="admin-menu-item" @click="closeAdminMenu">
                  <span>👨‍💼 Jugadores</span>
                </router-link>
                <router-link to="/admin/matches" class="admin-menu-item" @click="closeAdminMenu">
                  <span>⚽ Partidos</span>
                </router-link>
                <router-link to="/admin/referees" class="admin-menu-item" @click="closeAdminMenu">
                  <span>👨‍⚖️ Árbitros</span>
                </router-link>
              </div>

              <div class="admin-section-group">
                <span class="admin-group-title">📊 Resultados y Estadísticas</span>
                <router-link to="/admin/results" class="admin-menu-item" @click="closeAdminMenu">
                  <span>� Resultados</span>
                </router-link>
                <router-link to="/admin/standings" class="admin-menu-item" @click="closeAdminMenu">
                  <span>🏅 Posiciones</span>
                </router-link>
                <router-link to="/admin/stats" class="admin-menu-item" @click="closeAdminMenu">
                  <span>📈 Estadísticas</span>
                </router-link>
              </div>

              <div class="admin-section-group">
                <span class="admin-group-title">🏟️ Infraestructura</span>
                <router-link to="/admin/fields" class="admin-menu-item" @click="closeAdminMenu">
                  <span>🏟️ Canchas</span>
                </router-link>
                <router-link to="/admin/divisions" class="admin-menu-item" @click="closeAdminMenu">
                  <span>🏆 Divisiones</span>
                </router-link>
              </div>

              <div class="admin-section-group">
                <span class="admin-group-title">📰 Contenido</span>
                <router-link to="/admin/news" class="admin-menu-item" @click="closeAdminMenu">
                  <span>📰 Noticias</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 🚨 ENLACE DIRECTO DE EMERGENCIA AL DASHBOARD (temporal para debug) -->
        <router-link 
          v-if="isUserAdmin" 
          to="/admin/dashboard" 
          class="nav-link admin-emergency"
          style="background: #ff6b6b; color: white; padding: 0.5rem 1rem; border-radius: 5px; font-weight: bold;"
        >
          📊 ADMIN DASHBOARD
        </router-link>
        
        <!-- 🛠️ ENLACES DIRECTOS A CRUDs PRINCIPALES (para acceso rápido) -->
        <div v-if="isUserAdmin" class="admin-quick-links" style="display: flex; gap: 0.5rem;">
          <router-link to="/admin/users" class="nav-link admin-quick" style="background: #4facfe; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem;">
            👥 Usuarios
          </router-link>
          <router-link to="/admin/teams" class="nav-link admin-quick" style="background: #667eea; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem;">
            🏆 Equipos
          </router-link>
          <router-link to="/admin/matches" class="nav-link admin-quick" style="background: #f093fb; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem;">
            ⚽ Partidos
          </router-link>
        </div>
        
        <!-- ✅ Mostrar rol del usuario con distintivo -->
        <span class="user-role" :class="getRoleClass()">
          <span class="role-icon">{{ getRoleIcon() }}</span>
          {{ userStore.userRole }}
        </span>
        
        <button @click="logout" class="logout-button">Cerrar sesión</button>
      </template>
      
      <!-- ✅ Links para usuarios no autenticados -->
      <template v-else>
        <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
        <router-link to="/register" class="nav-link">Registrarse</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// Estado para el menú administrativo
const showAdminMenu = ref(false)

const logout = async () => {
  await userStore.logout()
  router.push('/login')
}

// Funciones para el menú administrativo
const toggleAdminMenu = () => {
  showAdminMenu.value = !showAdminMenu.value
}

const closeAdminMenu = () => {
  showAdminMenu.value = false
}

// ✅ Función mejorada para verificar si es administrador
const isUserAdmin = computed(() => {
  const isAdmin = userStore.roleId === 1 || userStore.roleId === '1'
  console.log('🔍 Verificando admin:', {
    roleId: userStore.roleId,
    isAdmin: isAdmin,
    userRole: userStore.userRole
  })
  return isAdmin
})

// ✅ Función para mostrar diferentes colores según el rol
const getRoleClass = () => {
  switch (userStore.roleId) {
    case 1: return 'role-admin'      // Administrador
    case 2: return 'role-user'       // Usuario
    case 3: return 'role-moderator'  // Moderador
    case 4: return 'role-coach'      // Entrenador
    default: return 'role-default'
  }
}

// ✅ Función para mostrar íconos según el rol
const getRoleIcon = () => {
  switch (userStore.roleId) {
    case 1: return '👑'    // Administrador - Corona
    case 2: return '👤'    // Usuario - Persona
    case 3: return '🛡️'    // Moderador - Escudo
    case 4: return '⚽'     // Entrenador - Balón
    default: return '❓'   // Desconocido
  }
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event) => {
  if (!event.target.closest('.admin-dropdown')) {
    showAdminMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #1a202c 60%, #232b43 100%);
  color: white;
  padding: 1rem 2rem;
  flex-wrap: wrap;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.18);
  border-radius: 0 0 18px 18px;
  position: sticky;
  top: 0;
  z-index: 50;
  animation: navbarFadeIn 0.8s cubic-bezier(.68,-0.55,.27,1.55);
}

@keyframes navbarFadeIn {
  from { opacity: 0; transform: translateY(-30px);}
  to { opacity: 1; transform: translateY(0);}
}

.logo {
  font-family: 'Montserrat', Arial, Helvetica, sans-serif;
  font-size: 2.1rem;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 2px;
  display: inline-block; /* <-- Asegura que esté en línea */
  transition: text-shadow 0.3s, color 0.3s;
  filter: drop-shadow(0 0 10px #fff8);
  position: relative;
  opacity: 0;
  animation: logoFadeInLeft 1s cubic-bezier(.68,-0.55,.27,1.55) 0.2s forwards;
  /* Elimina cualquier width o max-width aquí */
}

@keyframes logoFadeInLeft {
  from { opacity: 0; transform: translateX(-40px);}
  to { opacity: 1; transform: translateX(0);}
}

.logo.glow-fucsia:hover {
  color: #39ff14;
  text-shadow: 0 0 16px #39ff14, 0 0 32px #39ff14;
  filter: drop-shadow(0 0 18px #39ff14);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  padding: 0.2rem 0.5rem;
  transition: 
    color 0.3s,
    transform 0.18s cubic-bezier(.68,-0.55,.27,1.55),
    box-shadow 0.18s cubic-bezier(.68,-0.55,.27,1.55);
  overflow: hidden;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: #3ed7e5;
  transform: scale(1.13) translateY(-3px);
  box-shadow: 0 6px 18px -8px #3ed7e5cc;
  z-index: 2;
}

.nav-link:hover::after,
.nav-link.router-link-exact-active::after {
  width: 100%;
}

.nav-link::after {
  content: "";
  display: block;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, #3ed7e5, #63b3ed);
  transition: width 0.3s cubic-bezier(.68,-0.55,.27,1.55);
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 2px;
}

.logout-button {
  background: linear-gradient(90deg, #3ed7e5 0%, #63b3ed 100%);
  border: none;
  color: #1a202c;
  font-weight: 600;
  padding: 0.45rem 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 #3ed7e555;
  margin-left: 0.5rem;
  transition: background 0.3s, color 0.3s, transform 0.2s;
  outline: none;
  border: 1.5px solid #3ed7e5;
}

.logout-button:hover {
  background: linear-gradient(90deg, #63b3ed 0%, #3ed7e5 100%);
  color: #232b43;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px 0 #3ed7e599;
}

.logo-ball {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 50%;
  background: none;
  box-shadow: 0 0 12px #fff, 0 0 24px #39ff14aa;
  transition: transform 0.3s;
  margin-right: 0.2rem;
  user-select: none;
}

.logo-ball:hover {
  transform: scale(1.12) rotate(-8deg);
  box-shadow: 0 0 24px #39ff14, 0 0 32px #fff;
}

@media (max-width: 700px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }
  .navbar-right {
    width: 100%;
    justify-content: flex-start;
    gap: 0.7rem;
    margin-top: 0.7rem;
  }
  .logo {
    font-size: 1.3rem;
  }
}

/* ✅ NUEVOS: Estilos para admin y rol */
.admin-link {
  background: linear-gradient(135deg, #ff6b6b, #ff8e53) !important;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
}

.admin-dashboard {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  padding: 0.6rem 1.2rem !important;
  border-radius: 8px !important;
  font-weight: 700 !important;
  font-size: 0.95rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

.admin-dashboard:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
  transform: translateY(-3px) scale(1.05) !important;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
}

/* ✅ NUEVO: Estilos para diferentes roles */
.user-role {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.role-admin {
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  box-shadow: 0 3px 10px rgba(255, 107, 107, 0.4);
}

.role-user {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
  box-shadow: 0 3px 10px rgba(78, 205, 196, 0.4);
}

.role-moderator {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  box-shadow: 0 3px 10px rgba(240, 147, 251, 0.4);
}

.role-coach {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  box-shadow: 0 3px 10px rgba(79, 172, 254, 0.4);
}

.role-default {
  background: #718096;
  color: white;
}

/* 🔐 ESTILOS PARA EL MENÚ ADMINISTRATIVO */
.admin-section {
  position: relative;
}

.admin-dropdown {
  position: relative;
}

.admin-button {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
}

.admin-button:hover {
  background: linear-gradient(135deg, #ee5a24, #ff6b6b);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.dropdown-icon {
  transition: transform 0.3s ease;
  font-size: 0.8rem;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.admin-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: #2d3748;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid #4a5568;
  min-width: 280px;
  z-index: 1000;
  animation: dropdownFadeIn 0.3s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.admin-menu-header {
  padding: 1rem 1.2rem 0.5rem;
  border-bottom: 1px solid #4a5568;
}

.admin-title {
  font-weight: 700;
  color: #ff6b6b;
  font-size: 0.9rem;
}

.admin-section-group {
  padding: 0.8rem 0;
  border-bottom: 1px solid #4a5568;
}

.admin-section-group:last-child {
  border-bottom: none;
}

.admin-group-title {
  display: block;
  padding: 0.3rem 1.2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-menu-item {
  display: flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  color: #e2e8f0;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.admin-menu-item:hover {
  background: #4a5568;
  color: #ff6b6b;
  padding-left: 1.5rem;
}

.admin-menu-item span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 👑 ACTUALIZAR ESTILOS PARA LOS ROLES */
.user-role {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1.5px solid;
}

.role-icon {
  font-size: 1rem;
}

.role-admin {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border-color: #ff6b6b;
  box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
}
</style>
