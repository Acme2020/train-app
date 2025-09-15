import express from "express";
import stationRoutes from "./routes/stationRoutes";
import cors from "cors";

const api = express();

api.use(cors());
api.use(express.json());
api.use("/api", stationRoutes);

const PORT = process.env.PORT || 3000;

api.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
