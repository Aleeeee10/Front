import api from '../plugins/axios'   // tu instancia global

export const getPreferences  = () => api.get('/preferences')
export const savePreferences = (data) => api.put('/preferences', data)