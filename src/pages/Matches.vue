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
        <span class="absolute inset-y-0 left-4 flex items-center text-gray-400 dark:text-gray-500 select-none">🔍</span>
        <input v-model="search" type="text" placeholder="Buscar por equipo o liga..."
          class="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-none focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition" />
      </div>
    </div>

    <!-- CARGANDO -->
    <div v-if="loading" class="text-center text-lg font-semibold text-gray-700 dark:text-gray-300 select-none">
      ⏳ Cargando partidos...
    </div>

    <!-- LISTA -->
    <div v-else>
      <div v-if="filteredMatches.length === 0"
        class="text-center text-gray-500 dark:text-gray-400 italic text-lg select-none">
        No se encontraron partidos.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        <div v-for="match in filteredMatches" :key="match.id" :class="[
          'match-card relative overflow-hidden h-72 rounded-3xl transition-transform transform hover:scale-105 cursor-pointer border bg-gray-50 dark:bg-gray-900',
          statusClass(match.status)
        ]">
          <!-- Fondo gris suave fijo -->
          <div class="absolute inset-0 z-0 rounded-3xl bg-gray-50 dark:bg-gray-900"></div>

          <!-- Overlay info -->
          <div
            class="info-layer absolute inset-0 z-10 bg-black bg-opacity-80 flex flex-col justify-center items-center opacity-0 transition-opacity duration-400 px-10 text-center rounded-3xl match-card:hover:opacity-100">
            <span class="text-xs uppercase tracking-wider text-gray-300 mb-5 font-semibold">{{ match.league }}</span>

            <div class="flex flex-col text-white gap-6 w-full max-w-xs mx-auto">
              <div class="team-section flex items-center justify-between">
                <div class="team flex items-center gap-4">
                  <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 border-4 border-white">
                  </div>
                  <span class="text-base font-semibold truncate">{{ match.team1.name }}</span>
                </div>
                <span class="text-3xl font-extrabold">{{ match.score_team1 }}</span>
              </div>

              <div class="team-section flex items-center justify-between">
                <div class="team flex items-center gap-4">
                  <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-red-500 to-red-700 border-4 border-white">
                  </div>
                  <span class="text-base font-semibold truncate">{{ match.team2.name }}</span>
                </div>
                <span class="text-3xl font-extrabold">{{ match.score_team2 }}</span>
              </div>
            </div>

            <span class="text-sm mt-6 text-gray-300 font-medium tracking-wide">{{ formatDate(match.date) }} · {{
              match.time }}</span>
            <span class="mt-5 text-sm font-semibold px-7 py-2 rounded-full text-white select-none tracking-wide"
              :class="statusBadgeGradient(match.status)">
              {{ match.status }}
            </span>
          </div>

          <!-- Contenido visible por defecto -->
          <div
            class="default-content absolute inset-0 z-20 flex flex-col items-center justify-center p-10 rounded-3xl transition-opacity duration-400 match-card:hover:opacity-0 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-center shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
            <h3 class="text-2xl font-extrabold mb-3 truncate select-none">
              {{ match.league }}
            </h3>
            <p class="text-xl font-semibold truncate select-none flex items-center justify-center gap-3">
              {{ match.team1.name }}
              <span class="mx-3 text-gray-500 dark:text-gray-400 text-2xl select-none">vs</span>
              {{ match.team2.name }}
            </p>
            <p
              class="text-base mt-4 flex items-center justify-center gap-3 select-none font-medium text-gray-600 dark:text-gray-300">
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
    // 1. Obtener CSRF token
    const res = await instance.get('/api/csrf-token', { withCredentials: true })
    csrfToken.value = res.data.csrfToken
    instance.defaults.headers['X-CSRF-Token'] = csrfToken.value

    // 2. Cargar partidos
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

const statusClass = (status) => {
  if (status === 'En Vivo')
    return 'border-red-500 dark:border-red-400'
  if (status === 'Finalizado')
    return 'border-green-500 dark:border-green-400'
  return 'border-yellow-400 dark:border-yellow-600'
}

const statusBadgeGradient = (status) => {
  if (status === 'En Vivo')
    return 'bg-gradient-to-r from-red-700 to-red-900'
  if (status === 'Finalizado')
    return 'bg-gradient-to-r from-green-700 to-green-900'
  return 'bg-gradient-to-r from-yellow-600 to-yellow-800'
}
</script>

<style scoped>
.info-layer {
  pointer-events: none;
}

.match-card:hover .info-layer {
  opacity: 1 !important;
  pointer-events: auto;
}

.default-content {
  transition: opacity 0.4s ease;
}

.match-card:hover .default-content {
  opacity: 0 !important;
}
</style>
