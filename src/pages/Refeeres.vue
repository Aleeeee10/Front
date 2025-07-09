<template>
    <div class="w-[80%] mx-auto 2xl:p-6 min-h-screen mt-8 mb-8">
        <!-- Encabezado -->
        <div
            class="flex flex-col 2xl:flex-row gap-8 bg-white/100 dark:bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div v-if="selectedReferee" class="flex flex-col md:flex-row items-center gap-20 w-full relative">
                <img :src="selectedReferee.photo_url || defaultPhoto" alt="Foto Árbitro"
                    class="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 w-[60%] max-h-[300px] min-h-[300px] object-cover" />
                <div class="text-center md:text-left space-y-3 flex-1 relative">
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">{{ selectedReferee.name }}</h1>
                    <p class="text-gray-600 dark:text-gray-400 text-lg italic">Árbitro Profesional</p>
                    <p class="text-gray-600 dark:text-gray-400 text-lg">Nacionalidad: {{ selectedReferee.nationality
                    }}</p>
                    <p class="text-gray-600 dark:text-gray-400 text-lg">Edad: {{ selectedReferee.age }}</p>
                </div>
            </div>
            <div v-else class="flex items-center gap-6 md:flex-row w-full">
                <img :src="defaultPhoto" alt="Foto Árbitro"
                    class="rounded-xl shadow-lg w-full max-h-[200px] min-h-[200px] object-cover" />
                <div class="text-center md:text-left space-y-2">
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Seleccione un árbitro</h1>
                    <p class="text-gray-600 dark:text-gray-400">Seleccione un árbitro de la lista para ver su
                        información detallada.</p>
                </div>
            </div>
        </div>

        <!-- Lista de árbitros -->
        <h2 class="text-2xl font-bold text-white mb-6">📋 Lista de Árbitros</h2>

        <!-- Buscador -->
        <div class="relative mb-8">
            <input type="text" v-model="searchQuery" placeholder="Buscar árbitro..."
                class="w-full p-3 pl-11 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
            <span class="absolute left-4 top-3.5 text-gray-500 dark:text-gray-300 text-lg">🔍</span>
        </div>

        <!-- Tarjetas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="referee in filteredReferees" :key="referee.id"
                class="referee-card relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 p-5 cursor-pointer"
                @click="selectReferee(referee)">
                <img :src="referee.photo_url || defaultPhoto" alt="Foto Árbitro"
                    class="referee-photo w-full rounded-lg mb-4 object-cover" />
                <div class="flex items-center justify-between mb-1">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">
                        {{ referee.name }}
                    </h3>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span class="font-medium">🌎 Nacionalidad:</span> {{ referee.nationality }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span class="font-medium">🎂 Edad:</span> {{ referee.age }}
                </p>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import instance from '@/plugins/axios'

const referees = ref([])
const selectedReferee = ref(null)
const searchQuery = ref('')
const defaultPhoto = '/src/assets/referee.jpg'
const csrfToken = ref('')

const filteredReferees = computed(() =>
  referees.value.filter(r =>
    r.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

function selectReferee(referee) {
  selectedReferee.value = referee
}

onMounted(async () => {
  try {
    // 1. Obtener CSRF token
    const res = await instance.get('/api/csrf-token', { withCredentials: true })
    csrfToken.value = res.data.csrfToken
    instance.defaults.headers['X-CSRF-Token'] = csrfToken.value

    // 2. Cargar árbitros
    const refsRes = await instance.get('/referees', {
      headers: { 'X-CSRF-Token': csrfToken.value },
      withCredentials: true
    })
    referees.value = refsRes.data
  } catch (error) {
    Swal.fire('Error', 'No se pudo cargar la lista de árbitros o el token CSRF', 'error')
  }
})
</script>

<style scoped>
.referee-photo {
    height: 200px;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.referee-card {
    transition: transform 0.3s ease-in-out;
}

.referee-card:hover {
    transform: translateY(-6px);
}
</style>
