// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { requireAuth, requireAdmin } from '@/middleware/auth'

<<<<<<< HEAD
// Importar componentes
import Home from '@/components/Home.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Profile from '@/pages/Profile.vue'
import Teams from '@/pages/Teams.vue'
import Players from '@/pages/Players.vue'
import Matches from '@/pages/Matches.vue'
import News from '@/pages/News.vue'
import Standings from '@/pages/Standings.vue'
import Refeeres from '@/pages/Refeeres.vue'

// Componentes de admin
import Dashboard from '@/pages/admin/Dashboard.vue'
import Admin from '@/pages/Admin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        // Si ya está logueado, redirigir según rol
        if (userStore.isAdmin()) {
          next('/admin/dashboard')
        } else {
          next('/')
        }
      } else {
        next()
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
=======
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Teams from '../pages/Teams.vue'
import Refeeres from '../pages/Refeeres.vue'
import Players from '../pages/Players.vue'
import Matches from '../pages/Matches.vue'
import News from '../pages/News.vue'
import Standings from '../pages/Standings.vue'
import Profile from '../pages/Profile.vue'
import Admin from '../pages/Admin.vue'
import Home from '../pages/Home.vue'
import UserProfile from '../pages/UserProfile.vue'

const routes = [
  {
    path: '/inicio',
    component: Home // asegúrate que existe
  },
  {
    path: '/',
    component: Login,
    meta:{hideNavbar: true}
  },
  {
    path: '/register',
    component: Register,
    meta:{hideNavbar: true}
>>>>>>> be3c5c2e12ad95fe75c500b25578722ec8fe9ebf
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: requireAuth
  },
  {
    path: '/teams',
    name: 'Teams',
    component: Teams
  },
  {
    path: '/players',
    name: 'Players',
    component: Players
  },
  {
    path: '/matches',
    name: 'Matches',
    component: Matches
  },
  {
    path: '/news',
    name: 'News',
    component: News
  },
  {
    path: '/standings',
    name: 'Standings',
    component: Standings
  },
  {
    path: '/refeeres',
    name: 'Refeeres',
    component: Refeeres
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
<<<<<<< HEAD
    beforeEnter: requireAdmin
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: Dashboard,
    beforeEnter: requireAdmin // ✅ Solo administradores
=======
    meta: { requiresAuth: true, role: 'admin' }
  },

  {
    path:'/userProfile',
    component: UserProfile,
>>>>>>> be3c5c2e12ad95fe75c500b25578722ec8fe9ebf
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Guards de navegación globales
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

<<<<<<< HEAD
  // Inicializar store si no está inicializado
  if (!userStore.isAuthenticated && !userStore.user) {
    await userStore.initializeStore()
=======
  if (requiresAuth && !store.user) {
    next('/')
  } else if (allowedRole && store.user?.role !== allowedRole) {
    next('/teams')
  } else {
    next()
>>>>>>> be3c5c2e12ad95fe75c500b25578722ec8fe9ebf
  }

  next()
})

export default router
