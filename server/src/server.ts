import express from "express";
import stationRoutes from "./routes/stationRoutes";
import cors from "cors";

const api = express();
// Enable CORS for all routes
api.use(cors());
// Middleware to parse JSON bodies
api.use(express.json());
// Use station routes for /api prefix
api.use("/api", stationRoutes);
// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

api.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
