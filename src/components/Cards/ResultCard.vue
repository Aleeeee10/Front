<template>
  <div 
    :class="['match-card', isInicio ? 'w-full lg:w-11/12' : 'w-full lg:w-1/3 2xl:w-[30%]']" 
    class="dark:bg-bg-cards-dark text-black dark:text-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105"
  >
    <!-- Liga del partido -->
    <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2">
      <a href="/resultadosequip" class="league font-bold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        {{ match.league }}
      </a>
    </div>

    <!-- Detalles del partido -->
    <div class="md:grid flex flex-col grid-cols-[60%_30%] md:gap-4 px-4 md:pl-12 py-4">
      <div class="border-r border-gray-300 pr-4 w-full">
        <!-- Información del equipo 1 -->
        <div class="team-section flex items-center justify-between py-2">
          <div class="team flex items-center gap-3">
            <img :src="match.team1.logo" :alt="match.team1.name" class="team-logo w-10 h-10 rounded-full shadow-md">
            <span class="team-name text-lg font-semibold">{{ match.team1.name }}</span>
          </div>
          <span class="score hidden md:block text-xl font-bold">{{ match.team1.score }}</span>
        </div>

        <!-- Marcador en pantallas pequeñas -->
        <div class="block md:hidden text-center text-xl font-bold py-2">
          <span>{{ match.team1.score }}</span>
          <span class="mx-2">-</span>
          <span>{{ match.team2.score }}</span>
        </div>

        <!-- Información del equipo 2 -->
        <div class="team-section flex items-center justify-between py-2">
          <div class="team flex items-center gap-3">
            <img :src="match.team2.logo" :alt="match.team2.name" class="team-logo w-10 h-10 rounded-full shadow-md">
            <span class="team-name text-lg font-semibold">{{ match.team2.name }}</span>
          </div>
          <span class="score hidden md:block text-xl font-bold">{{ match.team2.score }}</span>
        </div>
      </div>

      <!-- Fecha del partido -->
      <div class="flex items-center justify-center w-full">
        <span class="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">
          📅 {{ match.date }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    match: {
      type: Object,
      required: true
    },
    isInicio: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
/* Efecto de elevación al pasar el mouse */
.match-card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.match-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
}

/* Imagen del equipo con mejor diseño */
.team-logo {
  transition: transform 0.3s ease-in-out;
}

.team-logo:hover {
  transform: scale(1.1);
}
</style>

