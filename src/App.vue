<template>
  <div>
    <Navbar v-if="!$route.meta.hideNavbar" /> <!-- Solo muestra si la ruta no lo oculta -->
    <router-view />
  </div>
</template>


<script setup>
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const $route = useRoute()
</script>
