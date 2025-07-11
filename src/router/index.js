// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

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
  },
  {
    path: '/teams',
    component: Teams
  },
  {
    path: '/players',
    component: Players
  },
  {
    path: '/matches',
    component: Matches
  },
  {
    path: '/news',
    component: News
  },
  {
    path: '/refeeres',
    component: Refeeres
  },
  {
    path: '/standings',
    component: Standings
  },
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, role: 'admin' }
  },

  {
    path:'/userProfile',
    component: UserProfile,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useUserStore()
  const requiresAuth = to.meta.requiresAuth
  const allowedRole = to.meta.role

  if (requiresAuth && !store.user) {
    next('/')
  } else if (allowedRole && store.user?.role !== allowedRole) {
    next('/teams')
  } else {
    next()
  }
})

export default router
