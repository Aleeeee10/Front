import { useUserStore } from '@/stores/user'

export const requireAuth = (to, from, next) => {
  const userStore = useUserStore()
  
  if (!userStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
}

export const requireAdmin = (to, from, next) => {
  const userStore = useUserStore()
  
  console.log('🔍 Verificando acceso admin:', {
    isAuthenticated: userStore.isAuthenticated,
    roleId: userStore.roleId,
    userRole: userStore.userRole
  })
  
  if (!userStore.isAuthenticated) {
    console.log('❌ No autenticado, redirigiendo a login')
    next('/login')
  } else if (userStore.roleId !== 1) {
    console.log('❌ No es administrador (roleId:', userStore.roleId, '), redirigiendo a inicio')
    next('/')
  } else {
    console.log('✅ Acceso permitido para administrador')
    next()
  }
}

export const requireAdminOrModerator = (to, from, next) => {
  const userStore = useUserStore()
  
  if (!userStore.isAuthenticated) {
    next('/login')
  } else if (userStore.roleId !== 1 && userStore.roleId !== 3) {
    next('/')
  } else {
    next()
  }
}