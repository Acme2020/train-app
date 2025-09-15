import { Router } from "express";
import { autocompleteStations, getStationBoard, } from "../controllers/stationController";
const router = Router();
router.get("/stations/autocomplete", autocompleteStations);
router.get("/stations/:stationId/board", getStationBoard);
export default router;
