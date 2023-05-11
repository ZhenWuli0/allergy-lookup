import http from '../utils/http'

const food = {
  getFood() {
    return http.get(`/getFood`)
  },
}

export default food
