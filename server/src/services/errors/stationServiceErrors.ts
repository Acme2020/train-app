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

    // Maintains proper stack trace for where our error was thrown (only available on V8)
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
  constructor(query: string) {
    super(
      `Invalid station query: '${query}'. Query must be at least 2 characters long.`,
      "INVALID_QUERY",
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

export class RateLimitError extends StationServiceError {
  constructor(retryAfter?: number) {
    const message = retryAfter
      ? `API rate limit exceeded. Retry after ${retryAfter} seconds.`
      : "API rate limit exceeded. Please try again later.";

    super(message, "RATE_LIMIT_EXCEEDED", 429);
  }
}
