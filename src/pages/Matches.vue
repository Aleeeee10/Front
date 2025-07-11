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

              <!-- Recuadro para ubicación -->
              <div class="mt-4 bg-white text-[#152861] font-medium text-sm px-4 py-2 rounded-full shadow-md">
                📍 {{ match.location }}
              </div>
            </div>

            <!-- Línea vertical separadora -->
            <div class="border-l border-white/30 mx-6"></div>

            <!-- Info árbitro -->
            <div v-if="match.referee" class="flex flex-col items-center justify-center min-w-[110px]">
              <h2 class="text-sm font-semibold mb-1">Árbitro</h2>
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
</style>
