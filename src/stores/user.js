import { defineStore } from 'pinia'
import { ref } from 'vue'
import instance from '@/plugins/axios'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const userRole = ref(null)
  const roleId = ref(null)

  // ✅ Método para establecer usuario después del login
  const setUser = (userData) => {
    user.value = userData
    isAuthenticated.value = true
    userRole.value = userData.role || null
    roleId.value = parseInt(userData.roleId) || null // ✅ Asegurar que sea número
    
    console.log('✅ Usuario establecido en store:', {
      nombre: userData.nombre,
      role: userData.role,
      roleId: parseInt(userData.roleId),
      isAdmin: parseInt(userData.roleId) === 1
    })
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('userRole', userData.role || '')
    localStorage.setItem('roleId', userData.roleId || '')
  }

  // ✅ Método para cerrar sesión
  const logout = async () => {
    try {
      await instance.post('/auth/logout', {}, { 
        withCredentials: true 
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      // Limpiar estado local
      user.value = null
      isAuthenticated.value = false
      userRole.value = null
      roleId.value = null
      
      // Limpiar localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      localStorage.removeItem('roleId')
    }
  }

  // ✅ Inicializar store (verificar si hay usuario guardado)
  const initializeStore = async () => {
    // Primero verificar localStorage
    const savedUser = localStorage.getItem('user')
    const savedRole = localStorage.getItem('userRole')
    const savedRoleId = localStorage.getItem('roleId')
    
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
        isAuthenticated.value = true
        userRole.value = savedRole
        roleId.value = parseInt(savedRoleId) || null
        
        console.log('🔄 Usuario restaurado del localStorage:', {
          role: savedRole,
          roleId: parseInt(savedRoleId),
          isAdmin: parseInt(savedRoleId) === 1
        })
      } catch (error) {
        localStorage.removeItem('user')
        localStorage.removeItem('userRole')
        localStorage.removeItem('roleId')
      }
    }

    // Luego verificar con el servidor
    await checkAuth()
  }

  // ✅ Método para verificar estado de autenticación
  const checkAuth = async () => {
    try {
      const response = await instance.get('/auth/status', { 
        withCredentials: true 
      })
      
      if (response.data.isAuthenticated && response.data.user) {
        setUser(response.data.user)
        return true
      } else {
        logout()
        return false
      }
    } catch (error) {
      console.log('📡 No se pudo verificar estado con servidor (normal en desarrollo)')
      return isAuthenticated.value // Usar estado local si el servidor no responde
    }
  }

  // ✅ NUEVAS: Funciones para verificar roles (usando roleId específico)
  const isAdmin = () => {
    const result = roleId.value === 1
    console.log('🔍 isAdmin():', {
      roleId: roleId.value,
      userRole: userRole.value,
      isAdmin: result
    })
    return result
  }

  const isModerator = () => {
    return roleId.value === 3
  }

  const isCoach = () => {
    return roleId.value === 4
  }

  const isUser = () => {
    return roleId.value === 2
  }

  const hasAdminAccess = () => {
    return roleId.value === 1 || roleId.value === 3 // Admin o Moderador
  }

  return {
    user,
    isAuthenticated,
    userRole,
    roleId,
    setUser,
    logout,
    initializeStore,
    checkAuth,
    isAdmin,
    isModerator,
    isCoach,
    isUser,
    hasAdminAccess
  }
})
