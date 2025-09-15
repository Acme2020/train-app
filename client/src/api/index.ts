import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

export const fetchStationSuggestions = (query: string) =>
  api.get('/stations/autocomplete', { params: { q: query } })
