import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:1337/api',
  timeout: 10000
})

request.interceptors.request.use(config => {
  return config
}, error => {
  Promise.reject(error)
})

request.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error)
})

export default request