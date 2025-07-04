<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/teams" class="logo">⚽ FútbolApp</router-link>
    </div>
    <div class="navbar-right">
      <router-link to="/profile">Mi perfil</router-link>
      <router-link to="/teams">Equipos</router-link>
      <router-link to="/players">Jugadores</router-link>
      <router-link to="/matches">Partidos</router-link>
      <router-link to="/news">Noticias</router-link>
      <router-link to="/refeeres">Arbitros</router-link>
      <router-link to="/standings">Posiciones</router-link>
      <router-link v-if="user?.role === 'admin'" to="/admin">Admin</router-link>

      <button @click="logout" class="logout-button">Cerrar sesión</button>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const user = userStore.user

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1a202c;
  /* más oscuro */
  color: white;
  padding: 1rem 2rem;
  flex-wrap: wrap;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #63b3ed;
  text-decoration: none;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.navbar a {
  color: white;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.navbar a:hover {
  color: #63b3ed;
}

.logout-button {
  background-color: transparent;
  border: 1px solid #3e46e5;
  color: #3e46e5;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background-color: #3ed7e5;
  color: white;
}
</style>
