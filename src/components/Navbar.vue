<template>
  <nav class="flex justify-between items-center bg-gray-900 text-white px-6 py-4 shadow-md flex-wrap">
    <div>
      <router-link to="/inicio" class="text-blue-400 text-xl font-bold">Social Soccer</router-link>
    </div>
    <div class="flex items-center gap-4 flex-wrap">
      <router-link to="/profile" class="hover:text-blue-400 font-medium">Mi perfil</router-link>
      <router-link to="/teams" class="hover:text-blue-400 font-medium">Equipos</router-link>
      <router-link to="/players" class="hover:text-blue-400 font-medium">Jugadores</router-link>
      <router-link to="/matches" class="hover:text-blue-400 font-medium">Partidos</router-link>
      <router-link to="/news" class="hover:text-blue-400 font-medium">Noticias</router-link>
      <router-link to="/refeeres" class="hover:text-blue-400 font-medium">Árbitros</router-link>
      <router-link to="/standings" class="hover:text-blue-400 font-medium">Posiciones</router-link>
      <router-link v-if="user?.role === 'admin'" to="/admin" class="hover:text-blue-400 font-medium">Admin</router-link>

      <button
        @click="logout"
        class="border border-blue-600 text-blue-500 px-3 py-1 rounded hover:bg-cyan-400 hover:text-white transition"
      >
        Cerrar sesión
      </button>
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

  // Eliminar historial para evitar volver con el botón "atrás"
  router.replace('/') // redirige y reemplaza la ruta actual
}
</script>
