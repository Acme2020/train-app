import { LocationResponse } from "../../interfaces/stationInterface";

/**
 * Helper functions for filtering and validating train stations
 */

/**
 * Check if a station serves train products (not just buses, trams, etc.)
 * @param products - The products object from the location response
 * @returns true if the station serves trains, false otherwise
 */
export function servesTrains(products?: LocationResponse["products"]): boolean {
  if (!products) return false;

  return !!(
    products.nationalExpress ||
    products.national ||
    products.regionalExpress ||
    products.regional
  );
}

/**
 * Get the default product configuration for train services
 * @returns Product configuration object for train services only
 */
export function getTrainProductsConfig() {
  return {
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
}
