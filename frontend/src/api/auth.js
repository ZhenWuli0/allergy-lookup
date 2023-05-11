import http from '../utils/http'

const auth = {
  heartbeat() {
    return http.get(`/heartbeat`)
  },

  login(requestBody) {
    return http.post(`/login`, requestBody)
  },

  register(requestBody) {
    return http.post(`/register`, requestBody)
  },

  logout() {
    return http.get(`/logout`)
  },
}

export default auth
