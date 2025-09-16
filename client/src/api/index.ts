import axios from 'axios'

// Use environment variables for configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
})

// Enable logging in development
if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
  api.interceptors.request.use((request) => {
    console.log('API Request:', request)
    return request
  })
  api.interceptors.response.use((response) => {
    console.log('API Response:', response)
    return response
  })
}

// Function to fetch station suggestions for autocomplete
export const fetchStationSuggestions = (query: string) =>
  api.get('/stations/autocomplete', { params: { q: query } })

// Function to fetch station details including arrivals and departures
export const fetchStationDetails = (stationId: string, duration?: number) =>
  api.get(`/stations/${stationId}/board`, { params: { duration: duration?.toString() } })
