/**
 * Custom error classes for the station service
 */

export class StationServiceError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly cause?: Error;

  constructor(message: string, code: string, statusCode = 500, cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.cause = cause;

    // Maintains proper stack trace for where the error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class StationNotFoundError extends StationServiceError {
  constructor(stationId: string) {
    super(`Station with ID '${stationId}' not found`, "STATION_NOT_FOUND", 404);
  }
}

export class InvalidStationQueryError extends StationServiceError {
  constructor() {
    super(
      `Invalid station query. Query cannot be empty.`,
      "INVALID_QUERY",
      400
    );
  }
}

export class InvalidStationIdError extends StationServiceError {
  constructor() {
    super(
      `Invalid station id. Station ID cannot be empty.`,
      "INVALID_STATION_ID",
      400
    );
  }
}

export class ApiConnectionError extends StationServiceError {
  constructor(operation: string, originalError?: Error) {
    super(
      `Failed to connect to Deutsche Bahn API for ${operation}`,
      "API_CONNECTION_ERROR",
      503,
      originalError
    );
  }
}

export class DataTransformationError extends StationServiceError {
  constructor(operation: string, originalError?: Error) {
    super(
      `Failed to process data for ${operation}`,
      "DATA_TRANSFORMATION_ERROR",
      500,
      originalError
    );
  }
}
