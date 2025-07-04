<template>
  <div class="dashboard">
    <section class="highlights flex flex-col gap-8 pb-20">
      <!-- Carrusel Primera División -->
      <span class="text-lg font-bold text-white">Primera División</span>
      <div class="carousel-container">
        <swiper
          :modules="modules"
          :slides-per-view="4"
          :space-between="10"
          :loop="true"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          class="first-division-carousel p-4"
          :breakpoints="swiperBreakpoints2"
        >
          <swiper-slide v-for="(item, index) in primeraDivisionItems" :key="index">
            <router-link :to="item.link" class="image-card relative dark:bg-bg-cards-dark rounded-lg shadow-md overflow-hidden toggle-card">
              <img :src="item.image" :alt="item.name" class="w-full h-auto rounded-md" />
              <div class="overlay absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300 ">
                <span class="text-white text-center text-lg font-bold">{{ item.name }}</span>
              </div>
            </router-link>
          </swiper-slide>
        </swiper>
      </div>

      <!-- Carrusel Segunda División -->
      <span class="text-lg font-bold text-white">Segunda División</span>
      <div class="carousel-container">
        <swiper
          :modules="modules"
          :slides-per-view="4"
          :space-between="10"
          :loop="true"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :direction="'horizontal'"
          dir="rtl"
          class="second-division-carousel p-4"
          :breakpoints="swiperBreakpoints2"

        >
          <swiper-slide v-for="(item, index) in segundaDivisionItems" :key="index">
            <router-link :to="item.link" class="image-card  drop-shadow-2xl relative dark:bg-bg-cards-dark rounded-lg shadow-md overflow-hidden toggle-card">
              <img :src="item.image" :alt="item.name" class="w-full h-auto rounded-md" />
              <div class="overlay absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300">
                <span class="text-white text-center text-lg font-bold">{{ item.name }}</span>
              </div>
            </router-link>
          </swiper-slide>
        </swiper>
      </div>

      <!-- Resultados Recientes (Carrusel) -->
      <span class="text-lg font-bold text-white">Resultados Recientes</span>
      <div class="carousel-container">
        <div class="wave-background">
          <swiper
            :modules="modules"
            :slides-per-view="3"
            :space-between="20"
            :loop="true"
            :autoplay="{ delay: 300, disableOnInteraction: false }"
            :breakpoints="swiperBreakpoints"
            @swiper="onSwiperInitRecent"
            class="recent-results-carousel p-4"
          >
            <swiper-slide v-for="result in recentResults" :key="result.date + result.team1.name + result.team2.name">
              <ResultCard :match="result" :isInicio="true" class="toggle-card" />
            </swiper-slide>
          </swiper>
        </div>
      </div>

      <!-- Partidos Próximos (Carrusel) -->
      <span class="text-lg font-bold text-white">Partidos Próximos</span>
      <div class="carousel-container">
        <div class="wave-background">
          <swiper
            :modules="modules"
            :slides-per-view="3"
            :space-between="20"
            :loop="true"
            :autoplay="{ delay: 300, disableOnInteraction: false }"
            :breakpoints="swiperBreakpoints"
            :direction="'horizontal'"
            dir="rtl"
            @swiper="onSwiperInitUpcoming"
            class="upcoming-matches-carousel p-4"
          >
            <swiper-slide v-for="match in upcomingMatches" :key="match.date + match.team1.name + match.team2.name">
              <MatchCard :match="match" :isInicio="true" class="toggle-card" />
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css'; // Estilos principales de Swiper
import MatchCard from '../components/Cards/MatchCard.vue';
import ResultCard from '../components/Cards/ResultCard.vue';
import resumenData from '@/data/resumen.json';


const userName = ref('JUAN FERNANDO');
const selectedTeam = ref('');
const selectedCompetition = ref('');
const teams = ref(['FC Barcelona', 'Real Madrid', 'Juventus', 'Paris Saint-Germain']);
const competitions = ref(['LaLiga', 'Serie A', 'Ligue 1', 'Champions League']);
const highlightedPlayers = ref(resumenData.highlightedPlayers);
const highlightedTeams = ref(resumenData.highlightedTeams);
const upcomingMatches = ref(resumenData.upcomingMatches);
const recentResults = ref(resumenData.recentResults);

// Módulos de Swiper
const modules = [Navigation, Pagination, Autoplay];

// Configuración responsive para los carruseles
const swiperBreakpoints = {
  320: { slidesPerView: 1 }, // Para pantallas pequeñas (móviles)
  640: { slidesPerView: 2 }, // Para tablets
  1024: { slidesPerView: 3 }, // Para pantallas medianas (escritorio)
};
// Configuración responsive para los carruseles
const swiperBreakpoints2 = {
  320: { slidesPerView: 1 }, // Para pantallas pequeñas (móviles)
  640: { slidesPerView: 2 }, // Para tablets
  1024: { slidesPerView: 4 }, // Para pantallas medianas (escritorio)
};

// Datos para el carrusel de Primera División
const primeraDivisionItems = ref([
  { image: '/assets/menu/equipo.jpg', name: 'Equipos', link: '/teams' },
  { image: '/assets/menu/resultado.jpg', name: 'Resultados', link: '/results' },
  { image: '/assets/menu/jugadores.jpg', name: 'Jugadores', link: '/players' },
  { image: '/assets/menu/partidos.jpg', name: 'Partidos', link: '/matches' },
  { image: '/assets/menu/arbitros.jpg', name: 'Arbitros', link: '/standings' },
]);

// Datos para el carrusel de Segunda División
const segundaDivisionItems = ref([
  { image: '/assets/menu/resultado.jpg', name: 'Resultados', link: '/results' },
  { image: '/assets/menu/equipo.jpg', name: 'Equipos', link: '/teams' },
  { image: '/assets/menu/partidos.jpg', name: 'Partidos', link: '/matches' },
  { image: '/assets/menu/jugadores.jpg', name: 'Jugadores', link: '/players' },
  { image: '/assets/menu/arbitros.jpg', name: 'Arbitros', link: '/standings' },
]);

// Variables para almacenar las instancias de los carruseles
let upcomingSwiperInstance = null;
let recentSwiperInstance = null;

// Función para manejar la inicialización del carrusel de Partidos Próximos
const onSwiperInitUpcoming = (swiper) => {
  upcomingSwiperInstance = swiper; // Guardamos la instancia del carrusel
  setTimeout(() => {
    if (upcomingSwiperInstance) {
      upcomingSwiperInstance.params.autoplay.delay = 3000; // Nueva velocidad (3 segundos)
      upcomingSwiperInstance.autoplay.start(); // Reiniciamos el autoplay con la nueva velocidad
    }
  }, 1000); // Esperamos 1 segundo antes de cambiar la velocidad
};

// Función para manejar la inicialización del carrusel de Resultados Recientes
const onSwiperInitRecent = (swiper) => {
  recentSwiperInstance = swiper; // Guardamos la instancia del carrusel
  setTimeout(() => {
    if (recentSwiperInstance) {
      recentSwiperInstance.params.autoplay.delay = 3000; // Nueva velocidad (3 segundos)
      recentSwiperInstance.autoplay.start(); // Reiniciamos el autoplay con la nueva velocidad
    }
  }, 1000); // Esperamos 1 segundo antes de cambiar la velocidad
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.carousel-container {
  width: 100%;
  margin: 1 auto;
}
.image-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* Altura fija para las tarjetas */
  position: relative;
}
.image-card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.overlay {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.image-card:hover .overlay {
  opacity: 1;
}
.swiper-slide {
  direction: ltr;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
