// src/plugins/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // o tu base de API
  withCredentials: true // Importante para cookies y CSRF
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
