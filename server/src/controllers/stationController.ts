import { Request, Response } from "express";
import { createClient } from "db-vendo-client";
import { profile } from "db-vendo-client/p/db/index.js";
import { filterByDuration } from "../utils/filterByDuration";
import { BoardResponse } from "@shared/types";

const dbClient = createClient(profile, "train-app/1.0.0");

// Handler for /api/stations/autocomplete
export const autocompleteStations = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const limit = 25;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter q" });
  }

  try {
    const locations = await dbClient.locations(query, {
      results: limit,
      fuzzy: true,
      poi: false,
      addresses: false,
      stops: true,
    });

    /**
     * Note: The db profile does not allow filtering by products.
     * As only stations that serve trains are relevant, we filter them here.
     * This is a workaround and not ideal, but it ensures correct data for now.
     */
    const servesTrains = (p: any) =>
      !!(
        p?.nationalExpress ||
        p?.national ||
        p?.regionalExpress ||
        p?.regional
      );
    // Only return stations, map to Station type and filter to only those that serve trains
    const filtered = locations
      .filter((l: any) => l.type === "station" && servesTrains(l.products))
      .map((l: any) => ({ id: l.id, name: l.name }));
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stations", details: err });
  }
};

// Handler for /api/stations/:stationId/board
export const getStationBoard = async (req: Request, res: Response) => {
  const stationId = req.params.stationId;
  //Duration in minutes for arrivals and depatures from now, default to 10 if not provided
  const duration = req.query.duration ? Number(req.query.duration) : 10;
  //Only enable certain products for the board as per requirements
  const products = {
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
  };
  if (!stationId) {
    return res.status(400).json({ error: "Missing stationId" });
  }
  try {
    const departures = await dbClient.departures(stationId, {
      products,
    });
    const arrivals = await dbClient.arrivals(stationId, {
      products,
    });
    /**
     * Note: The db profile always returns results for a fixed duration of 60 minutes.
     * To support custom durations from the client, we filter the results here.
     * This is a workaround and not ideal, but it ensures correct data for now.
     */
    const filteredDepartures = filterByDuration(
      departures.departures,
      duration
    );
    const filteredArrivals = filterByDuration(arrivals.arrivals, duration);

    // Map to BoardEntry format
    const response: BoardResponse = {
      departures: filteredDepartures.map((d: any) => ({
        tripId: d.tripId,
        when: d.when,
        plannedWhen: d.plannedWhen,
        delay: d.delay,
        platform: d.platform,
        direction: d.direction,
        line: d.line?.name ?? "",
        stop: d.stop?.name ?? "",
      })),
      arrivals: filteredArrivals.map((a: any) => ({
        tripId: a.tripId,
        when: a.when,
        plannedWhen: a.plannedWhen,
        delay: a.delay,
        platform: a.platform,
        direction: a.direction,
        line: a.line?.name ?? "",
        stop: a.stop?.name ?? "",
      })),
    };
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch board", details: err });
  }
};
