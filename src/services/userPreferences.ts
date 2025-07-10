import api from '../plugins/axios'   // tu instancia global

export const getPreferences  = () => api.get('/auth/preferences')
export const savePreferences = (data) => api.post('/auth/preferences', data)