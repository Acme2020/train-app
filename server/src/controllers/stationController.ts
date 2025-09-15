import { Request, Response } from "express";
import { createClient } from "db-vendo-client";
import { profile } from "db-vendo-client/p/db/index.js";
const dbClient = createClient(profile, "train-app/1.0.0");

// Handler for /api/stations/autocomplete
export const autocompleteStations = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter q" });
  }
  try {
    const stations = await dbClient.locations(query, {
      results: limit,
      fuzzy: true,
      poi: false,
      addresses: false,
    });
    const mapped = stations
      .filter((s: any) => s.type === "station")
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        latitude: s.location?.latitude,
        longitude: s.location?.longitude,
      }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stations", details: err });
  }
};

// Handler for /api/stations/:stationId/board
export const getStationBoard = async (req: Request, res: Response) => {
  const stationId = req.params.stationId;
  const minutes = req.query.minutes ? Number(req.query.minutes) : 10;
  if (!stationId) {
    return res.status(400).json({ error: "Missing stationId" });
  }
  try {
    const departures = await dbClient.departures(stationId, {
      duration: minutes,
      products: {
        nationalExpress: true,
        national: true,
        regionalExpress: true,
        regional: true,
        suburban: false,
        subway: false,
        bus: false,
        taxi: false,
        tram: false,
        ferry: false,
      },
    });
    const arrivals = await dbClient.arrivals(stationId, {
      duration: minutes,
      products: {
        nationalExpress: true,
        national: true,
        regionalExpress: true,
        regional: true,
        suburban: false,
        subway: false,
        bus: false,
        taxi: false,
        tram: false,
        ferry: false,
      },
    });
    console.log("Raw departures:", departures);
    console.log("Raw arrivals:", arrivals);
    const departuresArray = Array.isArray(departures.departures)
      ? departures.departures
      : [];
    const arrivalsArray = Array.isArray(arrivals.arrivals)
      ? arrivals.arrivals
      : [];
    res.json({
      departures: departuresArray.map((d: any) => ({
        tripId: d.tripId,
        when: d.when,
        plannedWhen: d.plannedWhen,
        delay: d.delay,
        platform: d.platform,
        direction: d.direction,
        line: d.line
          ? { name: d.line.name, productName: d.line.productName }
          : undefined,
        stop: d.stop
          ? {
              id: d.stop.id,
              name: d.stop.name,
              latitude: d.stop.location?.latitude,
              longitude: d.stop.location?.longitude,
            }
          : undefined,
      })),
      arrivals: arrivalsArray.map((a: any) => ({
        tripId: a.tripId,
        when: a.when,
        plannedWhen: a.plannedWhen,
        delay: a.delay,
        platform: a.platform,
        direction: a.direction,
        line: a.line
          ? { name: a.line.name, productName: a.line.productName }
          : undefined,
        stop: a.stop
          ? {
              id: a.stop.id,
              name: a.stop.name,
              latitude: a.stop.location?.latitude,
              longitude: a.stop.location?.longitude,
            }
          : undefined,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch board", details: err });
  }
};
