import { describe, it, expect } from "vitest";
import { servesTrains, getTrainProductsConfig } from "../productFilters";

describe("productFilters", () => {
  describe("servesTrains", () => {
    it("should return true for stations with nationalExpress", () => {
      const products = { nationalExpress: true };
      expect(servesTrains(products)).toBe(true);
    });

    it("should return true for stations with national", () => {
      const products = { national: true };
      expect(servesTrains(products)).toBe(true);
    });

    it("should return true for stations with regionalExpress", () => {
      const products = { regionalExpress: true };
      expect(servesTrains(products)).toBe(true);
    });

    it("should return true for stations with regional", () => {
      const products = { regional: true };
      expect(servesTrains(products)).toBe(true);
    });

    it("should return false for stations with only non-train products", () => {
      const products = { bus: true, tram: true, subway: true };
      expect(servesTrains(products)).toBe(false);
    });

    it("should return false for stations with no products", () => {
      expect(servesTrains(undefined)).toBe(false);
      expect(servesTrains({})).toBe(false);
    });

    it("should return true for stations with mixed products including trains", () => {
      const products = {
        bus: true,
        tram: true,
        nationalExpress: true,
      };
      expect(servesTrains(products)).toBe(true);
    });
  });

  describe("getTrainProductsConfig", () => {
    it("should return correct train products configuration", () => {
      const config = getTrainProductsConfig();

      expect(config).toEqual({
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
      });
    });

    it("should return a new object each time", () => {
      const config1 = getTrainProductsConfig();
      const config2 = getTrainProductsConfig();

      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2); // Different object references
    });
  });
});
