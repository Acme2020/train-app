import { describe, it, expect, vi, beforeEach } from "vitest";
import { StationService } from "../stationService";
import { filterByDuration } from "../../utils/filterByDuration";
import {
  InvalidStationQueryError,
} from "../errors/stationServiceErrors";

// Mock dependencies
vi.mock("db-vendo-client", () => ({
  createClient: vi.fn(() => ({
    locations: vi.fn(),
    departures: vi.fn(),
    arrivals: vi.fn(),
  })),
}));

vi.mock("db-vendo-client/p/db/index.js", () => ({
  profile: {},
}));

vi.mock("../../utils/filterByDuration", () => ({
  filterByDuration: vi.fn(),
}));

describe("StationService", () => {
  let stationService: StationService;
  let mockDbClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    stationService = new StationService();
    mockDbClient = (stationService as any).dbClient;
  });

  describe("searchStations", () => {
    it("should return filtered stations that serve trains", async () => {
      // Arrange
      const mockLocations = [
        {
          id: "8000261",
          name: "München Hbf",
          type: "station",
          products: {
            nationalExpress: true,
            national: true,
            regionalExpress: true,
            regional: true,
          },
        },
        {
          id: "8000001",
          name: "Bus Stop",
          type: "station",
          products: {
            bus: true,
          },
        },
        {
          id: "8000002",
          name: "Berlin Hbf",
          type: "station",
          products: {
            nationalExpress: true,
            national: false,
          },
        },
      ];

      mockDbClient.locations.mockResolvedValue(mockLocations);

      // Act
      const result = await stationService.searchStations("München", 10);

      // Assert
      expect(mockDbClient.locations).toHaveBeenCalledWith("München", {
        results: 10,
        fuzzy: true,
        poi: false,
        addresses: false,
        stops: true,
      });

      expect(result).toEqual([
        { id: "8000261", name: "München Hbf" },
        { id: "8000002", name: "Berlin Hbf" },
      ]);
    });

    it("should use default limit of 25 when not provided", async () => {
      // Arrange
      mockDbClient.locations.mockResolvedValue([]);

      // Act
      await stationService.searchStations("test");

      // Assert
      expect(mockDbClient.locations).toHaveBeenCalledWith("test", {
        results: 25,
        fuzzy: true,
        poi: false,
        addresses: false,
        stops: true,
      });
    });

    it("should filter out non-station locations", async () => {
      // Arrange
      const mockLocations = [
        {
          id: "1",
          name: "Address",
          type: "address",
          products: { nationalExpress: true },
        },
        {
          id: "2",
          name: "Station",
          type: "station",
          products: { nationalExpress: true },
        },
      ];

      mockDbClient.locations.mockResolvedValue(mockLocations);

      // Act
      const result = await stationService.searchStations("test");

      // Assert
      expect(result).toEqual([{ id: "2", name: "Station" }]);
    });

    it("should filter out stations without train products", async () => {
      // Arrange
      const mockLocations = [
        {
          id: "1",
          name: "Bus Station",
          type: "station",
          products: { bus: true },
        },
        {
          id: "2",
          name: "Train Station",
          type: "station",
          products: { nationalExpress: true },
        },
      ];

      mockDbClient.locations.mockResolvedValue(mockLocations);

      // Act
      const result = await stationService.searchStations("test");

      // Assert
      expect(result).toEqual([{ id: "2", name: "Train Station" }]);
    });

    it("should handle empty results", async () => {
      // Arrange
      mockDbClient.locations.mockResolvedValue([]);

      // Act
      const result = await stationService.searchStations("nonexistent");

      // Assert
      expect(result).toEqual([]);
    });

    it("should handle API errors", async () => {
      // Arrange
      mockDbClient.locations.mockRejectedValue(new Error("API Error"));

      // Act & Assert
      await expect(stationService.searchStations("test")).rejects.toThrow(
        "Failed to connect to Deutsche Bahn API for station search"
      );
    });

    it("should throw InvalidStationQueryError for empty query", async () => {
      // Act & Assert
      await expect(stationService.searchStations("")).rejects.toThrow(
        InvalidStationQueryError
      );
    });

    it("should throw InvalidStationQueryError for query less than 2 characters", async () => {
      // Act & Assert
      await expect(stationService.searchStations("a")).rejects.toThrow(
        InvalidStationQueryError
      );
    });
  });

  describe("getStationBoard", () => {
    it("should return board with filtered departures and arrivals", async () => {
      // Arrange
      const mockDepartures = [
        {
          tripId: "dep1",
          when: "2023-10-15T14:35:00+02:00",
          plannedWhen: "2023-10-15T14:30:00+02:00",
          delay: 300,
          platform: "11",
          direction: "Hamburg Hbf",
          provenance: "München Hbf",
          line: { name: "ICE 703" },
          cancelled: false,
        },
      ];

      const mockArrivals = [
        {
          tripId: "arr1",
          plannedWhen: "2023-10-15T15:10:00+02:00",
          delay: 60,
          platform: "7",
          direction: "Berlin Hbf",
          provenance: "Frankfurt(Main) Hbf",
          line: { name: "IC 2046" },
          cancelled: false,
        },
      ];

      const mockDeparturesData = { departures: mockDepartures };
      const mockArrivalsData = { arrivals: mockArrivals };

      mockDbClient.departures.mockResolvedValue(mockDeparturesData);
      mockDbClient.arrivals.mockResolvedValue(mockArrivalsData);
      (filterByDuration as any).mockImplementation((data: any[]) => data);

      // Act
      const result = await stationService.getStationBoard("8000261", 30);

      // Assert
      expect(mockDbClient.departures).toHaveBeenCalledWith("8000261", {
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

      expect(mockDbClient.arrivals).toHaveBeenCalledWith("8000261", {
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

      expect(filterByDuration).toHaveBeenCalledWith(mockDepartures, 30);
      expect(filterByDuration).toHaveBeenCalledWith(mockArrivals, 30);

      expect(result).toEqual({
        departures: [
          {
            tripId: "dep1",
            when: "2023-10-15T14:35:00+02:00",
            plannedWhen: "2023-10-15T14:30:00+02:00",
            delay: 300,
            platform: "11",
            direction: "Hamburg Hbf",
            provenance: "München Hbf",
            line: "ICE 703",
            cancelled: false,
          },
        ],
        arrivals: [
          {
            tripId: "arr1",
            when: "2023-10-15T15:10:00+02:00",
            plannedWhen: "2023-10-15T15:10:00+02:00",
            delay: 60,
            platform: "7",
            direction: "Berlin Hbf",
            provenance: "Frankfurt(Main) Hbf",
            line: "IC 2046",
            cancelled: false,
          },
        ],
      });
    });

    it("should use default duration of 10 when not provided", async () => {
      // Arrange
      mockDbClient.departures.mockResolvedValue({ departures: [] });
      mockDbClient.arrivals.mockResolvedValue({ arrivals: [] });
      (filterByDuration as any).mockReturnValue([]);

      // Act
      await stationService.getStationBoard("8000261");

      // Assert
      expect(filterByDuration).toHaveBeenCalledWith([], 10);
    });

    it("should handle missing optional fields", async () => {
      // Arrange
      const mockDeparture = {
        tripId: "dep1",
        plannedWhen: "2023-10-15T14:30:00+02:00",
        // Missing optional fields: when, delay, platform, direction, provenance, line, cancelled
      };

      mockDbClient.departures.mockResolvedValue({
        departures: [mockDeparture],
      });
      mockDbClient.arrivals.mockResolvedValue({ arrivals: [] });
      (filterByDuration as any).mockImplementation((data: any[]) => data);

      // Act
      const result = await stationService.getStationBoard("8000261");

      // Assert
      expect(result.departures[0]).toEqual({
        tripId: "dep1",
        when: "2023-10-15T14:30:00+02:00", // Should fallback to plannedWhen
        plannedWhen: "2023-10-15T14:30:00+02:00",
        delay: 0, // Should default to 0
        platform: "", // Should default to empty string
        direction: "", // Should default to empty string
        provenance: "", // Should default to empty string
        line: "", // Should default to empty string
        cancelled: false, // Should default to false
      });
    });

    it("should handle API errors for departures", async () => {
      // Arrange
      mockDbClient.departures.mockRejectedValue(
        new Error("Departures API Error")
      );
      mockDbClient.arrivals.mockResolvedValue({ arrivals: [] });

      // Act & Assert
      await expect(stationService.getStationBoard("8000261")).rejects.toThrow(
        "Failed to connect to Deutsche Bahn API for station board for station '8000261'"
      );
    });

    it("should throw InvalidStationQueryError for empty station ID", async () => {
      // Act & Assert
      await expect(stationService.getStationBoard("")).rejects.toThrow(
        InvalidStationQueryError
      );
    });

    it("should handle API errors for arrivals", async () => {
      // Arrange
      mockDbClient.departures.mockResolvedValue({ departures: [] });
      mockDbClient.arrivals.mockRejectedValue(new Error("Arrivals API Error"));

      // Act & Assert
      await expect(stationService.getStationBoard("8000261")).rejects.toThrow(
        "Failed to connect to Deutsche Bahn API for station board for station '8000261'"
      );
    });

    it("should fetch departures and arrivals in parallel", async () => {
      // Arrange
      let departuresResolved = false;
      let arrivalsResolved = false;

      mockDbClient.departures.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            departuresResolved = true;
            resolve({ departures: [] });
          }, 100);
        });
      });

      mockDbClient.arrivals.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            arrivalsResolved = true;
            resolve({ arrivals: [] });
          }, 100);
        });
      });

      (filterByDuration as any).mockReturnValue([]);

      // Act
      const startTime = Date.now();
      await stationService.getStationBoard("8000261");
      const endTime = Date.now();

      // Assert
      // If they were called in parallel, total time should be ~100ms, not ~200ms
      expect(endTime - startTime).toBeLessThan(150);
      expect(departuresResolved).toBe(true);
      expect(arrivalsResolved).toBe(true);
    });
  });

  describe("servesTrains (private method testing via public interface)", () => {
    it("should include stations with nationalExpress", async () => {
      // Arrange
      const mockLocations = [
        {
          id: "1",
          name: "Station",
          type: "station",
          products: { nationalExpress: true },
        },
      ];
      mockDbClient.locations.mockResolvedValue(mockLocations);

      // Act
      const result = await stationService.searchStations("test");

      // Assert
      expect(result).toHaveLength(1);
    });

    it("should include stations with national", async () => {
      // Arrange
      const mockLocations = [
        {
          id: "1",
          name: "Station",
          type: "station",
          products: { national: true },
        },
      ];
      mockDbClient.locations.mockResolvedValue(mockLocations);

      // Act
      const result = await stationService.searchStations("test");

      // Assert
      expect(result).toHaveLength(1);
    });

    it("should include stations with regionalExpress", async () => {
      // Arrange
      const mockLocations = [
        {
          id: "1",
          name: "Station",
          type: "station",
          products: { regionalExpress: true },
        },
      ];
      mockDbClient.locations.mockResolvedValue(mockLocations);

      // Act
      const result = await stationService.searchStations("test");

      // Assert
      expect(result).toHaveLength(1);
    });

    it("should include stations with regional", async () => {
      // Arrange
      const mockLocations = [
        {
          id: "1",
          name: "Station",
          type: "station",
          products: { regional: true },
        },
      ];
      mockDbClient.locations.mockResolvedValue(mockLocations);

      // Act
      const result = await stationService.searchStations("test");

      // Assert
      expect(result).toHaveLength(1);
    });

    it("should exclude stations with no products", async () => {
      // Arrange
      const mockLocations = [
        {
          id: "1",
          name: "Station",
          type: "station",
          // no products property
        },
      ];
      mockDbClient.locations.mockResolvedValue(mockLocations);

      // Act
      const result = await stationService.searchStations("test");

      // Assert
      expect(result).toHaveLength(0);
    });
  });
});
