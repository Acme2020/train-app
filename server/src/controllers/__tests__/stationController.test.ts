import { beforeEach, afterEach, it, expect, vi, describe } from "vitest";
import { Request, Response } from "express";
import { autocompleteStations, getStationBoard } from "../stationController";

// Mock the db-vendo-client module
vi.mock("db-vendo-client", () => {
  return {
    createClient: vi.fn(() => ({
      locations: vi.fn(async (query, options) => {
        if (query === "Berlin") {
          return [
            {
              id: "8011160",
              name: "Berlin Hbf",
              type: "station",
              products: {
                nationalExpress: true,
                national: true,
                regionalExpress: true,
                regional: true,
              },
            },
            {
              id: "8010404",
              name: "Berlin Südkreuz",
              type: "station",
              products: {
                nationalExpress: true,
                national: true,
              },
            },
            {
              id: "8089100",
              name: "Berlin Ostbahnhof",
              type: "station",
              products: {
                nationalExpress: true,
                national: true,
              },
            },
            {
              id: "8011162",
              name: "Berlin Friedrichstraße",
              type: "station",
              products: {
                regionalExpress: true,
                regional: true,
              },
            },
            {
              id: "8010255",
              name: "Berlin Alexanderplatz",
              type: "station",
              products: {
                regionalExpress: true,
                regional: true,
              },
            },
          ];
        } else if (query === "error") {
          throw new Error("API error");
        }
        return [];
      }),
      arrivals: vi.fn(async (stationId, options) => {
        if (stationId === "8011160") {
          return {
            arrivals: [
              {
                when: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                plannedWhen: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                delay: 0,
                platform: "1",
                line: { name: "ICE 123", product: "nationalExpress" },
                destination: {
                  type: "station",
                  id: "8010404",
                  name: "Berlin Südkreuz",
                },
              },
              {
                when: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
                plannedWhen: new Date(
                  Date.now() + 15 * 60 * 1000
                ).toISOString(),
                delay: 0,
                platform: "2",
                line: { name: "RE 1", product: "regional" },
                destination: {
                  type: "station",
                  id: "8089100",
                  name: "Berlin Ostbahnhof",
                },
              },
            ],
          };
        } else if (stationId === "error") {
          throw new Error("API error");
        }
        return { arrivals: [] };
      }),
      departures: vi.fn(async (stationId, options) => {
        if (stationId === "8011160") {
          return {
            departures: [
              {
                when: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
                plannedWhen: new Date(
                  Date.now() + 10 * 60 * 1000
                ).toISOString(),
                delay: 0,
                platform: "1",
                line: { name: "ICE 456", product: "nationalExpress" },
                destination: {
                  type: "station",
                  id: "8010404",
                  name: "Berlin Südkreuz",
                },
              },
            ],
          };
        } else if (stationId === "error") {
          throw new Error("API error");
        }
        return { departures: [] };
      }),
    })),
    profile: {},
  };
});

describe("stationController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    mockRes = {
      json: jsonMock,
      status: statusMock,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("autocompleteStations", () => {
    it("returns 400 when query parameter is missing", async () => {
      mockReq = { query: {} };

      await autocompleteStations(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Missing query parameter q",
      });
    });

    it("returns stations when query is valid", async () => {
      mockReq = { query: { q: "Berlin" } };

      await autocompleteStations(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: "8011160", name: "Berlin Hbf" }),
        ])
      );
    });

    it("handles errors and returns 503", async () => {
      mockReq = { query: { q: "error" } };

      await autocompleteStations(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(503);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to connect to Deutsche Bahn API for station search",
          code: "API_CONNECTION_ERROR",
        })
      );
    });
  });

  describe("getStationBoard", () => {
    it("returns station board data when station ID is valid", async () => {
      mockReq = {
        params: { stationId: "8011160" },
        query: { duration: "10" },
      };

      await getStationBoard(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          arrivals: expect.arrayContaining([
            expect.objectContaining({ line: "ICE 123" }),
          ]),
          departures: expect.arrayContaining([
            expect.objectContaining({ line: "ICE 456" }),
          ]),
        })
      );
    });

    it("handles errors and returns 503", async () => {
      mockReq = {
        params: { stationId: "error" },
        query: {},
      };

      await getStationBoard(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(503);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error:
            "Failed to connect to Deutsche Bahn API for station board for station 'error'",
          code: "API_CONNECTION_ERROR",
        })
      );
    });
  });
});
