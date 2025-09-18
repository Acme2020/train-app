// Interfaces for the station service layer
import { BoardResponse, Station } from "@shared/types";

// Interface for DB client options
export interface LocationOptions {
  results: number;
  fuzzy: boolean;
  poi: boolean;
  addresses: boolean;
  stops: boolean;
}

export interface ProductOptions {
  nationalExpress: boolean;
  national: boolean;
  regionalExpress: boolean;
  regional: boolean;
  suburban: boolean;
  subway: boolean;
  bus: boolean;
  taxi: boolean;
  tram: boolean;
  ferry: boolean;
}

// Interface for raw API location responses
export interface LocationResponse {
  type: string;
  id: string;
  name: string;
  products?: {
    nationalExpress?: boolean;
    national?: boolean;
    regionalExpress?: boolean;
    regional?: boolean;
    [key: string]: boolean | undefined;
  };
}

// Interface for raw departure/arrival data
export interface TransportEvent {
  tripId: string;
  when?: string;
  plannedWhen: string;
  delay?: number;
  platform?: string;
  direction?: string;
  provenance?: string;
  cancelled?: boolean;
  line?: {
    name?: string;
  };
}

// Interface for the station service
export interface StationServiceInterface {
  searchStations(query: string, limit?: number): Promise<Station[]>;
  getStationBoard(stationId: string, duration?: number): Promise<BoardResponse>;
}
