# Train App

A simple web application to search for train stations and view upcoming departures and arrivals, built with TypeScript, Vue.js, Vuetify, and a Node.js server.

## Features

- Station search with suggestions
- View departures and arrivals for a selected station
- Filter for ICE, EC, IR, and regional trains
- Modern, responsive UI (Vue + Vuetify)

## Project Structure

- `server/` – TypeScript Node.js REST API
- `client/` – Vue 3 + Vuetify SPA

## Getting Started

1. Install dependencies:
   ```sh
   yarn install
   ```
2. Start development servers (concurrently):
   ```sh
   yarn dev
   ```
   - Server: http://localhost:3000
   - Client: http://localhost:5173

## Endpoints

- `GET /api/stations?query=...` – Station search
- `GET /api/station/:id/departures-arrivals?minutes=...` – Departures & arrivals

## Requirements

- Node.js 18+
- Yarn (v1 or v3)

---

For more details, see the `task.md` file.
