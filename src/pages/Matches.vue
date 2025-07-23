<template>
  <div class="max-w-7xl mx-auto px-6 py-12">
    <!-- ENCABEZADO -->
    <header class="mb-12 text-center">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight select-none">
        Partidos ⚽
      </h1>
      <p class="text-white text-base select-none">
        Consulta los últimos resultados y próximos encuentros.
      </p>
    </header>

    <!-- BUSCADOR -->
    <div class="flex justify-center mb-12">
      <div class="relative w-full max-w-md">
        <span class="absolute inset-y-0 left-4 flex items-center text-gray-400 select-none">🔍</span>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por equipo o liga..."
          class="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-none focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition"
        />
      </div>
    </div>

    <!-- CARGANDO -->
    <div v-if="loading" class="text-center text-lg font-semibold text-gray-700 select-none">
      ⏳ Cargando partidos...
    </div>

    <!-- LISTA -->
    <div v-else>
      <div v-if="filteredMatches.length === 0" class="text-center text-gray-400 italic text-lg select-none">
        No se encontraron partidos.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div
  v-for="match in filteredMatches"
  :key="match.id"
  class="w-[32em] match-card relative overflow-hidden h-[16rem] rounded-3xl transition-transform transform hover:scale-105 cursor-pointer border border-[#1e3799] shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
  style="background: linear-gradient(to top, #0f172a, #1e40af);"
  @mouseenter="e => e.currentTarget.style.background = 'linear-gradient(to top, #1e293b, #0ea5e9)'"
  @mouseleave="e => e.currentTarget.style.background = 'linear-gradient(to top, #0f172a, #1e40af)'"
>
          <!-- Contenido -->
          <div
            class="absolute inset-0 z-20 flex p-8 rounded-3xl transition-opacity duration-400 text-white"
          >
            <!-- Izquierda: liga y equipos -->
            <div class="flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto">
              <h3 class="text-xl font-bold mb-2 uppercase tracking-wide">
                {{ match.league }}
              </h3>
              <p class="text-lg font-semibold flex items-center justify-center gap-3">
                {{ match.team1.name }}
                <span class="mx-2 font-light text-xl">vs</span>
                {{ match.team2.name }}
              </p>
              <p class="text-sm mt-2 flex items-center justify-center gap-2 font-medium text-white/80">
                <span class="text-base">📅</span> {{ formatDate(match.date) }}
                <span class="text-lg">·</span>
                <span class="text-base">⏰</span> {{ match.hour }}
              </p>

<<<<<<< HEAD

            <div class="flex flex-col text-white gap-6 w-full max-w-xs mx-auto">
              <div class="flex justify-between w-full mx-auto gap-12 items-center">
                <!-- Equipo 1 -->
                <div class="team flex flex-col items-center gap-3 flex-1">
                  <img
                    :src="match.team1?.logo_url"
                    alt="logo equipo 1"
                    class="w-24 h-24 rounded-full object-cover border-4 border-white bg-gray-200 shadow-lg"
                  />
                  <span class="text-lg font-bold text-white text-center mt-2 break-words max-w-[110px]">{{ match.team1?.name }}</span>
                </div>
                <!-- Marcador grande y centrado -->
                <div class="flex flex-col items-center justify-center flex-shrink-0">
                  <span class="text-5xl font-extrabold text-white drop-shadow-lg">{{ match.score_team1 }} - {{ match.score_team2 }}</span>
                </div>
                <!-- Equipo 2 -->
                <div class="team flex flex-col items-center gap-3 flex-1">
                  <img
                    :src="match.team2?.logo_url"
                    alt="logo equipo 2"
                    class="w-24 h-24 rounded-full object-cover border-4 border-white bg-gray-200 shadow-lg"
                  />
                  <span class="text-lg font-bold text-white text-center mt-2 break-words max-w-[110px]">{{ match.team2?.name }}</span>
                </div>
              </div>
              <!-- Árbitro -->
              <div v-if="match.referee" class="flex flex-col items-center mt-4">
                <img
                  :src="match.referee.photo_url"
                  alt="foto árbitro"
                  class="w-10 h-10 rounded-full object-cover border-2 border-blue-400 bg-gray-200 mb-1"
                />
                <span class="text-sm font-medium text-gray-200">{{ match.referee.name }}</span>
=======
              <!-- Recuadro para ubicación -->
              <div class="mt-4 bg-white text-[#152861] font-medium text-sm px-4 py-2 rounded-full shadow-md">
                📍 {{ match.location }}
>>>>>>> be3c5c2e12ad95fe75c500b25578722ec8fe9ebf
              </div>
            </div>

            <!-- Línea vertical separadora -->
            <div class="border-l border-white/30 mx-6"></div>

<<<<<<< HEAD
          <!-- Contenido visible por defecto -->
          <div
            class="default-content absolute inset-0 z-20 flex flex-col items-center justify-center p-10 rounded-3xl transition-opacity duration-400 match-card:hover:opacity-0 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-center shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
            <h3 class="text-2xl font-extrabold mb-3 truncate select-none">
              {{ match.league }}
            </h3>
            <div class="flex items-center justify-center gap-4 w-full mb-2">
              <span
                class="team-name px-3 py-1 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-bold text-lg shadow max-w-[120px] text-ellipsis overflow-hidden whitespace-normal text-center"
                :title="match.team1.name"
                style="min-width:80px;"
              >
                {{ match.team1.name }}
              </span>
              <span class="mx-2 text-gray-500 dark:text-gray-400 text-2xl select-none font-bold">vs</span>
              <span
                class="team-name px-3 py-1 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-bold text-lg shadow max-w-[120px] text-ellipsis overflow-hidden whitespace-normal text-center"
                :title="match.team2.name"
                style="min-width:80px;"
              >
                {{ match.team2.name }}
              </span>
            </div>
            <p class="text-base mt-4 flex items-center justify-center gap-3 select-none font-medium text-gray-600 dark:text-gray-300">
              <span class="text-xl">📅</span> {{ formatDate(match.date) }}
              <span class="text-lg">·</span>
              <span class="text-xl">⏰</span> {{ match.time }}
            </p>
            <div class="text-4xl font-extrabold mt-6 select-none">
              <template v-if="match.status !== 'Programado'">
                {{ match.score_team1 }} - {{ match.score_team2 }}
              </template>
              <template v-else>
                <span class="text-base italic text-gray-500 dark:text-gray-400">Resultado pendiente</span>
              </template>
            </div>

            <!-- Información del árbitro -->
            <div v-if="match.referee" class="flex flex-col items-center mt-4">
=======
            <!-- Info árbitro -->
            <div v-if="match.referee" class="flex flex-col items-center justify-center min-w-[110px]">
              <h2 class="text-sm font-semibold mb-1">Árbitro</h2>
>>>>>>> be3c5c2e12ad95fe75c500b25578722ec8fe9ebf
              <img
                :src="match.referee.photo_url"
                alt="foto árbitro"
                class="w-16 h-16 rounded-full object-cover border-2 border-white bg-gray-200 mb-2"
              />
              <span class="text-xs font-medium text-center">{{ match.referee.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import instance from '@/plugins/axios'

const matches = ref([])
const loading = ref(true)
const search = ref('')
const csrfToken = ref('')

onMounted(async () => {
  try {
    const res = await instance.get('/api/csrf-token', { withCredentials: true })
    csrfToken.value = res.data.csrfToken
    instance.defaults.headers['X-CSRF-Token'] = csrfToken.value

    const matchesRes = await instance.get('/matches', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    matches.value = matchesRes.data
  } catch (err) {
    Swal.fire('Error', 'No se pudo cargar la lista de partidos o el token CSRF', 'error')
  } finally {
    loading.value = false
  }
})

const filteredMatches = computed(() => {
  const term = search.value.toLowerCase()
  return matches.value.filter(
    m =>
      m.league?.toLowerCase().includes(term) ||
      (m.team1?.name?.toLowerCase() || '').includes(term) ||
      (m.team2?.name?.toLowerCase() || '').includes(term)
  )
})

const formatDate = (dateStr) => {
  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
  return new Date(dateStr).toLocaleDateString('es-ES', options)
}
</script>

<style scoped>
.match-card {
  transition: box-shadow 0.3s ease;
}
.match-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

.team-name {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  letter-spacing: 0.5px;
  word-break: break-word;
}

.team img {
  transition: transform 0.3s;
}
.team img:hover {
  transform: scale(1.08) rotate(-2deg);
}
</style>
