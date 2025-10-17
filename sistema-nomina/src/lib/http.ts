import axios from 'axios'

export const api = axios.create({
  baseURL: '/api', // el proxy envía a https://localhost:7187/api
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
