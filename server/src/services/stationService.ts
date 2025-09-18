import { createClient } from "db-vendo-client";
import { profile } from "db-vendo-client/p/db/index.js";
import { filterByDuration } from "../helpers/station/filterByDuration";
import { BoardResponse, Station } from "@shared/types";
import {
  StationServiceInterface,
  LocationOptions,
  LocationResponse,
  ProductOptions,
} from "../interfaces/stationInterface";
import {
  StationServiceError,
  InvalidStationQueryError,
  InvalidStationIdError,
  ApiConnectionError,
} from "./errors/stationServiceErrors";
import {
  servesTrains,
  getTrainProductsConfig,
} from "../helpers/station/productFilters";
import { mapToBoardEntry } from "../helpers/station/dataTransformers";

export class StationServiceImpl implements StationServiceInterface {
  private dbClient: any;
  private defaultProducts: ProductOptions;

  constructor() {
    this.dbClient = createClient(profile, "train-app/1.0.0");
    this.defaultProducts = getTrainProductsConfig();
  }

  /**
   * Search for stations matching the query
   */
  async searchStations(query: string, limit = 25): Promise<Station[]> {
    // Input validation
    if (!query) {
      throw new InvalidStationQueryError();
    }

    try {
      const options: LocationOptions = {
        results: limit,
        fuzzy: true,
        poi: false,
        addresses: false,
        stops: true,
      };

      const locations: LocationResponse[] = await this.dbClient.locations(
        query,
        options
      );

      // Filter to only return stations that serve trains
      return locations
        .filter((l) => l.type === "station" && servesTrains(l.products))
        .map((l) => ({
          id: l.id,
          name: l.name,
        }));
    } catch (error) {
      if (error instanceof StationServiceError) {
        throw error;
      }

      // Wrap API errors
      throw new ApiConnectionError("station search", error as Error);
    }
  }

  /**
   * Get departures and arrivals for a station
   */
  async getStationBoard(
    stationId: string,
    duration = 10
  ): Promise<BoardResponse> {
    if (!stationId || !stationId.trim()) {
      throw new InvalidStationIdError();
    }

    try {
      // Fetch data in parallel
      const [departuresData, arrivalsData] = await Promise.all([
        this.dbClient.departures(stationId, { products: this.defaultProducts }),
        this.dbClient.arrivals(stationId, { products: this.defaultProducts }),
      ]);

      // Filter by duration
      const filteredDepartures = filterByDuration(
        departuresData.departures,
        duration
      );
      const filteredArrivals = filterByDuration(
        arrivalsData.arrivals,
        duration
      );

      // Transform to response format
      return {
        departures: filteredDepartures.map((d: any) => mapToBoardEntry(d)),
        arrivals: filteredArrivals.map((a: any) => mapToBoardEntry(a)),
      };
    } catch (error) {
      if (error instanceof StationServiceError) {
        throw error;
      }

      // Check if it's a 404 error (station not found)
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 404
      ) {
        throw new ApiConnectionError(
          `station board for station '${stationId}' (station not found)`,
          error as unknown as Error
        );
      }

      // Wrap API errors
      throw new ApiConnectionError(
        `station board for station '${stationId}'`,
        error as Error
      );
    }
  }
}

// Export a singleton instance
export const stationService = new StationServiceImpl();
