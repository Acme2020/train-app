import { describe, it, expect } from "vitest";
import { mapToBoardEntry } from "../dataTransformers";
import { DataTransformationError } from "../../../services/errors/stationServiceErrors";

describe("dataTransformers", () => {
  describe("mapToBoardEntry", () => {
    it("should map complete API entry to BoardEntry", () => {
      const apiEntry = {
        tripId: "trip123",
        when: "2023-10-15T14:35:00+02:00",
        plannedWhen: "2023-10-15T14:30:00+02:00",
        delay: 300,
        platform: "11",
        direction: "Hamburg Hbf",
        provenance: "München Hbf",
        line: { name: "ICE 703" },
        cancelled: false,
      };

      const result = mapToBoardEntry(apiEntry);

      expect(result).toEqual({
        tripId: "trip123",
        when: "2023-10-15T14:35:00+02:00",
        plannedWhen: "2023-10-15T14:30:00+02:00",
        delay: 300,
        platform: "11",
        direction: "Hamburg Hbf",
        provenance: "München Hbf",
        line: "ICE 703",
        cancelled: false,
      });
    });

    it("should handle missing optional fields with defaults", () => {
      const apiEntry = {
        tripId: "trip123",
        plannedWhen: "2023-10-15T14:30:00+02:00",
        // Missing: when, delay, platform, direction, provenance, line, cancelled
      };

      const result = mapToBoardEntry(apiEntry);

      expect(result).toEqual({
        tripId: "trip123",
        when: "2023-10-15T14:30:00+02:00", // Falls back to plannedWhen
        plannedWhen: "2023-10-15T14:30:00+02:00",
        delay: 0,
        platform: "",
        direction: "",
        provenance: "",
        line: "",
        cancelled: false,
      });
    });

    it("should use plannedWhen when when is missing", () => {
      const apiEntry = {
        tripId: "trip123",
        plannedWhen: "2023-10-15T14:30:00+02:00",
        // when is missing
      };

      const result = mapToBoardEntry(apiEntry);

      expect(result.when).toBe("2023-10-15T14:30:00+02:00");
      expect(result.plannedWhen).toBe("2023-10-15T14:30:00+02:00");
    });

    it("should prefer when over plannedWhen if both exist", () => {
      const apiEntry = {
        tripId: "trip123",
        when: "2023-10-15T14:35:00+02:00",
        plannedWhen: "2023-10-15T14:30:00+02:00",
      };

      const result = mapToBoardEntry(apiEntry);

      expect(result.when).toBe("2023-10-15T14:35:00+02:00");
      expect(result.plannedWhen).toBe("2023-10-15T14:30:00+02:00");
    });

    it("should handle line object with missing name", () => {
      const apiEntry = {
        tripId: "trip123",
        plannedWhen: "2023-10-15T14:30:00+02:00",
        line: {}, // Empty line object
      };

      const result = mapToBoardEntry(apiEntry);

      expect(result.line).toBe("");
    });

    it("should handle undefined line", () => {
      const apiEntry = {
        tripId: "trip123",
        plannedWhen: "2023-10-15T14:30:00+02:00",
        line: undefined,
      };

      const result = mapToBoardEntry(apiEntry);

      expect(result.line).toBe("");
    });

    it("should throw DataTransformationError when transformation fails", () => {
      // Create an entry that will cause an error during transformation
      const invalidEntry = Object.create(null); // Object with no prototype
      Object.defineProperty(invalidEntry, "tripId", {
        get() {
          throw new Error("Property access error");
        },
      });

      expect(() => mapToBoardEntry(invalidEntry)).toThrow(
        DataTransformationError
      );
      expect(() => mapToBoardEntry(invalidEntry)).toThrow(
        "Failed to process data for board entry mapping"
      );
    });
  });
});
