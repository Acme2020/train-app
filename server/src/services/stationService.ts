import { createClient } from "db-vendo-client";
import { profile } from "db-vendo-client/p/db/index.js";
import { filterByDuration } from "../utils/filterByDuration";
import { BoardResponse, Station, BoardEntry } from "@shared/types";
import {
  IStationService,
  LocationOptions,
  LocationResponse,
  ProductOptions,
} from "../interfaces/stationInterface";
import {
  StationServiceError,
  InvalidStationQueryError,
  ApiConnectionError,
  DataTransformationError,
} from "./errors/stationServiceErrors";

export class StationService implements IStationService {
  private dbClient: any;
  private defaultProducts: ProductOptions = {
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

  constructor() {
    this.dbClient = createClient(profile, "train-app/1.0.0");
  }

  /**
   * Search for stations matching the query
   */
  async searchStations(query: string, limit = 25): Promise<Station[]> {
    // Input validation
    if (!query || query.trim().length < 2) {
      throw new InvalidStationQueryError(query);
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
        .filter((l) => l.type === "station" && this.servesTrains(l.products))
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
      throw new InvalidStationQueryError(stationId);
    }

    try {
      // Fetch data in parallel for better performance
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
        departures: filteredDepartures.map((d: any) => this.mapToBoardEntry(d)),
        arrivals: filteredArrivals.map((a: any) => this.mapToBoardEntry(a)),
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

  // Helper methods
  private servesTrains(products?: LocationResponse["products"]): boolean {
    if (!products) return false;

    return !!(
      products.nationalExpress ||
      products.national ||
      products.regionalExpress ||
      products.regional
    );
  }

  private mapToBoardEntry(entry: any): BoardEntry {
    try {
      return {
        tripId: entry.tripId,
        when: entry.when || entry.plannedWhen,
        plannedWhen: entry.plannedWhen,
        delay: entry.delay || 0,
        platform: entry.platform || "",
        direction: entry.direction || "",
        provenance: entry.provenance || "",
        line: entry.line?.name || "",
        cancelled: entry.cancelled || false,
      };
    } catch (error) {
      throw new DataTransformationError("board entry mapping", error as Error);
    }
  }
}

// Export a singleton instance
export const stationService = new StationService();
