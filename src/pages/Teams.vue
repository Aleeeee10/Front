<template >
  <div class="relative min-h-screen bg-gray-100 py-10 px-4 bg-[url(/img/fondo.jpg)] bg-cover bg-center ">
    <h1 class="text-center text-3xl font-bold text-white mb-10">Equipos Registrados</h1>

    <!--vista del equipo-->
    <div
      v-if="showTeamDetails && selectedTeam"
      class="fixed inset-0 z-50 bg-[url(/img/fondo.jpg)] bg-cover bg-center bg-opacity-80 flex flex-col items-center justify-center p-8 transition-all duration-500"
    >

      <img
        :src="selectedTeam.logo_url || defaultLogo"
        class="w-64 h-64 object-contain  mb-4 bg-gray-400 rounded-full "
        alt="logo"
      />
      <h2 class="text-5xl font-extrabold mb-2 text-white">{{ selectedTeam.name }}</h2>
      <p class="text-6xl font-extrabold  text-green-400">{{ selectedTeam.division }}</p>
      <button
        @click="closeDetail"
        class=" text-white font-semibold mt-4 px-4 py-2 rounded-lg bg-indigo-400 hover:bg-blue-400 transition-colors duration-300"
      >
        ← Volver
      </button>
    </div>

    <!-- Primera División -->
    <div v-if="primeraDivision.length" class="mb-16">
      <h2 class="text-2xl font-semibold text-lime-500 mb-6 text-center">Primera División</h2>
      <div
        class="flex flex-wrap justify-center gap-6 transition-all duration-500 hover: "
        :class="{ 'opacity-20 pointer-events-none': selectedTeam }"
      >
        <div
          v-for="team in primeraDivision"
          :key="team.id"
          @click="selectTeam(team)"
          :class="[
            'cursor-pointer hover:bg-zinc-600 hover:text-white bg-white rounded-xl shadow-md w-44 p-4 text-center transition-all duration-500 transform hover:-translate-y-1 hover:shadow-lg',
            selectedTeam?.id === team.id ? 'scale-150 z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-zinc-800 text-white' : ''
          ]"
        >
          <img
            :src="team.logo_url || defaultLogo"
            alt="logo"
            class="w-24 h-24 object-contain mb-3 rounded-full bg-gray-100 mx-auto"
          />
          <h2 class="text-lg font-semibold mb-1">{{ team.name }}</h2>
          <p class="text-sm">{{ team.division }}</p>
        </div>
      </div>
    </div>

    <!-- Segunda División -->
    <div v-if="segundaDivision.length">
      <h2 class="text-2xl font-semibold text-lime-500 mb-6 text-center">Segunda División</h2>
      <div
        class="flex flex-wrap justify-center gap-6 transition-all duration-500"
        :class="{ 'opacity-20 pointer-events-none': selectedTeam }"
      >
        <div
          v-for="team in segundaDivision"
          :key="team.id"
          @click="selectTeam(team)"
          :class="[
            'cursor-pointer hover:bg-zinc-600 hover:text-white bg-white rounded-xl shadow-md w-44 p-4 text-center transition-all duration-500 transform hover:-translate-y-1 hover:shadow-lg',
            selectedTeam?.id === team.id ? 'scale-150 z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-zinc-800 text-white' : ''
          ]"
        >
          <img
            :src="team.logo_url || defaultLogo"
            alt="logo"
            class="w-24 h-24 object-contain mb-3 rounded-full bg-gray-100 mx-auto"
          />
          <h2 class="text-lg font-semibold mb-1">{{ team.name }}</h2>
          <p class="text-sm">{{ team.division }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const teams = ref([])
const selectedTeam = ref(null)
const showTeamDetails = ref(false)
const loading = ref(true)

const defaultLogo =
  'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'

// Computed para dividir por divisiones
const primeraDivision = computed(() =>
  teams.value.filter((team) =>
    team.division?.toLowerCase().includes('primera')
  )
)

const segundaDivision = computed(() =>
  teams.value.filter((team) =>
    team.division?.toLowerCase().includes('segunda')
  )
)

const selectTeam = (team) => {
  selectedTeam.value = team
  setTimeout(() => {
    showTeamDetails.value = true
  }, 400)
}

const closeDetail = () => {
  showTeamDetails.value = false
  selectedTeam.value = null
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/teams')
    teams.value = res.data
  } catch (error) {
    alert('Error al cargar los equipos')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
body {
  overflow-x: hidden;
}
</style>
