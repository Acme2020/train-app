import { BoardEntry } from "@shared/types";
import { DataTransformationError } from "../../services/errors/stationServiceErrors";

/**
 * Helper functions for transforming API response data
 */

/**
 * Transform raw API entry data to BoardEntry format
 * @param entry - Raw API entry data
 * @returns Transformed BoardEntry object
 * @throws DataTransformationError if transformation fails
 */
export function mapToBoardEntry(entry: any): BoardEntry {
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
