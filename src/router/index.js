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

const routes = [
  {
    path: '/',
    component: () => import('@/components/Home.vue') // asegúrate que existe
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
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
    next('/login')
  } else if (allowedRole && store.user?.role !== allowedRole) {
    next('/teams')
  } else {
    next()
  }
})

export default router
