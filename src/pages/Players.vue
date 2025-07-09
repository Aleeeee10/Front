<template>
  <div class="players-container px-6 py-10 bg-[url(/img/fondo.jpg)] bg-cover bg-center min-h-screen">
    <h1 class="text-3xl font-bold text-center mb-10 text-lime-600">⚽ Jugadores</h1>

    <div v-if="loading" class="text-center text-zinc-500 text-lg">Cargando jugadores...</div>

    <div
      v-else
      class="flex flex-wrap justify-center gap-8 transition-all duration-500"
      :class="{ 'opacity-20 pointer-events-none': selectedPlayer }"
    >
      <div
        v-for="player in players"
        :key="player.id"
        class="p-[3px] rounded-2xl bg-gradient-to-br from-sky-400 via-fuchsia-500 to-yellow-400 hover:from-yellow-400 hover:to-purple-600 transition-all duration-300"
        

      >
      <div class="relative w-72 h-96 bg-gradient-to-t from-slate-900 to-blue-800 hover:from-slate-800 hover:to-sky-700 text-white rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden flex border-2 border-white">
        <!-- Izquierda: Imagen ocupa toda la mitad -->
        <div class="w-1/2 h-full overflow-hidden rounded-l-2xl">
          <img
            :src="player.photo_url || defaultPhoto"
            alt="foto jugador"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Derecha: Info y stats -->
        <div class="w-1/2 p-4 flex flex-col justify-between">
          <div>
            <h3 class="text-2xl font-bold truncate">{{ player.name }}</h3>
            <p class="text-lime-300 text-sm mb-2">{{ player.team?.name || 'Sin equipo' }}</p>
            <img
              v-if="player.team?.logo_url"
              :src="player.team.logo_url"
              alt="logo equipo"
              class="w-12 h-12 object-contain mb-2 rounded-full">
            <p><strong>Número:</strong> {{ player.number }}</p>
            <p><strong>Posición:</strong> {{ player.position }}</p>
          </div>

          <div class="mt-4 text-sm">
            <p class="font-semibold mb-1">Estadísticas</p>
            <div class="flex gap-6">
              <span>G {{ player.goals }}</span>
              <span>🟨 {{ player.yellow_cards }}</span>
              <span>🟥 {{ player.red_cards }}</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import instance from '@/plugins/axios'

const players = ref([])
const loading = ref(true)
const defaultPhoto = '/default-avatar.png'
const csrfToken = ref('')
const selectedPlayer = ref(null)
const selectPlayer = (player) => {
  selectedPlayer.value = player
}

onMounted(async () => {
  try {
    // 1. Obtener CSRF token
    const res = await instance.get('/api/csrf-token', { withCredentials: true })
    csrfToken.value = res.data.csrfToken
    instance.defaults.headers['X-CSRF-Token'] = csrfToken.value

    // 2. Cargar jugadores
    const playersRes = await instance.get('/players', {
      headers: {
        'X-CSRF-Token': csrfToken.value
      },
      withCredentials: true
    })
    players.value = playersRes.data
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar los jugadores o el token CSRF', 'error')
  } finally {
    loading.value = false
  }
})
</script>
