<template>
  <div>
    <Navbar /> <!-- Muestra el navbar en todas las vistas -->
    <router-view /> <!-- Aquí se cargan las páginas según la ruta -->
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>
