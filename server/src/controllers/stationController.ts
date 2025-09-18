import { Request, Response } from "express";
import { stationService } from "../services/stationService";
import { StationServiceError } from "../services/errors/stationServiceErrors";

// Handler for /api/stations/autocomplete
export const autocompleteStations = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const limit = Number(req.query.limit) || 25;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter q" });
  }

  try {
    const stations = await stationService.searchStations(query, limit);
    res.json(stations);
  } catch (err) {
    console.error("Failed to fetch stations:", err);

    if (err instanceof StationServiceError) {
      return res.status(err.statusCode).json({
        error: err.message,
        code: err.code,
      });
    }

    res.status(500).json({ error: "Failed to fetch stations", details: err });
  }
};

// Handler for /api/stations/:stationId/board
export const getStationBoard = async (req: Request, res: Response) => {
  const stationId = req.params.stationId;
  const duration = req.query.duration ? Number(req.query.duration) : 10;

  if (!stationId) {
    return res.status(400).json({ error: "Missing stationId" });
  }

  try {
    const board = await stationService.getStationBoard(stationId, duration);
    res.json(board);
  } catch (err) {
    console.error("Failed to fetch board:", err);

    if (err instanceof StationServiceError) {
      return res.status(err.statusCode).json({
        error: err.message,
        code: err.code,
      });
    }

    res.status(500).json({ error: "Failed to fetch board", details: err });
  }
};
