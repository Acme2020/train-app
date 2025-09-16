# Train App

A monorepo for a train station board web application.  
Built with TypeScript, Vue 3, Vuetify, and a Node.js backend.

## Requirements

- **Node.js 22.x** (required)
- **Yarn** (v1 or v3 recommended)

## Project Structure

- `client/` – Vue 3 + Vuetify SPA (frontend)
- `server/` – TypeScript Node.js REST API (backend)
- `shared/` – Common TypeScript types (accessed via path aliases)
- Root – Workspace management, shared scripts

## Setup & Development

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Acme2020/train-app
   cd train-app
   ```

2. **Install dependencies (from root):**

   ```sh
   yarn install
   ```

3. **Start both servers (from root):**

   ```sh
   yarn start
   ```

   - Backend: http://localhost:3000
   - Frontend: http://localhost:5173

   (Runs both client and server concurrently.)

## API Endpoints

- `GET /api/stations/autocomplete?q=...`  
  Autocomplete station names (query param: `q`)
- `GET /api/stations/{stationId}/board?duration=...`  
  Get arrivals and departures for a station
- For API documentation, refer to the [OpenAPI specification](server/openapi/openapi.yaml).

## Scripts

- `yarn start` – Starts the application locally by running both client and server in development mode.
- `yarn start:server` – Start the server locally in development mode
- `yarn start:client` – Start the client locally in development mode
- `yarn test` – Run all tests in the repository
- `yarn workspace client <script>` – Run client-specific scripts
- `yarn workspace server <script>` – Run server-specific scripts

## Notes

- All development and build commands require **Node.js 22.x**.
- For backend type generation, use:

  ```sh
  yarn workspace server generate:server
  ```

## Features

- **Station search with autocomplete** - Find stations easily as you type
- **Arrival and departure boards** - View upcoming trains at selected stations
- **Duration filtering** - Control how far in the future to show schedules
- **Train type filtering** - Focus on ICE, EC, IR, and regional trains

### Running the Server on a Different Port

If you need to run the server on a different port:

1. Set the PORT environment variable when starting the server:

   ```
   PORT=3001 yarn dev:server
   ```

2. Update the API baseURL in `client/src/api/index.ts` to match your new port:

   ```typescript
   const api = axios.create({
     baseURL: "http://localhost:3001/api",
   });
   ```

3. Restart both client and server for changes to take effect.

## Troubleshooting

- **404 Error on frontend**: Try running the client directly from its folder with `cd client && yarn dev`
- **Connection issues**: Make sure both server and client are running (ports 3000 and 5173)
- **Port conflicts**:
  - For server: Set `PORT=3001 yarn dev:server` to use port 3001 (server doesn't auto-detect available ports)
  - For client: Vite automatically finds an available port if 5173 is in use
  - Remember to update the API baseURL in `client/src/api/index.ts` if you change the server port
- **Type errors**: Run `yarn workspace client type-check` to verify TypeScript types
- **Missing dependencies**: Ensure you're using Node.js 22.x and have run `yarn install`
