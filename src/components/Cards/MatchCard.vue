<template>
    <div 
      :class="[
        'match-card relative overflow-hidden h-64 rounded-xl shadow-lg transition-transform transform hover:scale-105',
        isInicio ? 'w-full lg:w-11/12' : 'w-full lg:w-1/3 2xl:w-[30%]',
        'bg-white dark:bg-bg-cards-dark text-black dark:text-white'
      ]"
      v-if="match && match.team1 && match.team2"
    >
      <!-- Fondo de los equipos -->
      <div class="absolute inset-0 z-0 h-64 flex justify-center items-center opacity-40">
        <div class="grid grid-cols-2 gap-4 w-full">
          <img :src="match.team1.logo" :alt="match.team1.name"
            class="object-contain h-32 md:h-40 mx-auto grayscale opacity-60" />
          <img :src="match.team2.logo" :alt="match.team2.name"
            class="object-contain h-32 md:h-40 mx-auto grayscale opacity-60" />
        </div>
      </div>
  
      <!-- Información del partido (overlay) -->
      <div
        class="info-layer absolute inset-0 z-10 bg-black bg-opacity-70 flex flex-col justify-center items-center opacity-0 transition-opacity duration-300"
      >
        <span class="league text-xs uppercase tracking-wider text-gray-300 mb-3">{{ match.league }}</span>
        
        <div class="flex flex-col text-white gap-3 px-4 w-full">
          <div class="team-section flex items-center justify-between">
            <div class="team flex items-center gap-2">
              <img :src="match.team1.logo" :alt="match.team1.name" class="team-logo w-10 h-10 rounded-full shadow-lg" />
              <span class="team-name text-sm font-medium">{{ match.team1.name }}</span>
            </div>
            <span class="score text-lg font-bold">{{ match.team1.score }}</span>
          </div>
  
          <div class="team-section flex items-center justify-between">
            <div class="team flex items-center gap-2">
              <img :src="match.team2.logo" :alt="match.team2.name" class="team-logo w-10 h-10 rounded-full shadow-lg" />
              <span class="team-name text-sm font-medium">{{ match.team2.name }}</span>
            </div>
            <span class="score text-lg font-bold">{{ match.team2.score }}</span>
          </div>
        </div>
  
        <span class="match-date text-sm mt-3 text-gray-300">{{ match.date }}</span>
      </div>
  
      <!-- Contenido visible por defecto -->
      <div class="default-content absolute inset-0 z-20 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent">
        <span class="league text-xs uppercase text-gray-300">{{ match.league }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    match: {
      type: Object,
      required: true,
    },
    isInicio: {
      type: Boolean,
      default: false,
    },
  });
  </script>
  
  <style scoped>
  /* Efecto de desvanecimiento en el overlay */
  .info-layer {
    opacity: 0;
  }
  
  .match-card:hover .info-layer {
    opacity: 1;
  }
  
  /* Ocultar el contenido por defecto al hacer hover */
  .default-content {
    transition: opacity 0.3s ease-in-out;
  }
  
  .match-card:hover .default-content {
    opacity: 0;
  }
  </style>
  
