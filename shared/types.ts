// Shared types

export interface Station {
  id: string;
  name: string;
}

export interface BoardEntry {
  tripId: string;
  when: string;
  plannedWhen: string;
  delay: number;
  platform: string;
  provenance: string;
  direction: string;
  line: string;
  cancelled: boolean;
}

export interface BoardResponse {
  departures: BoardEntry[];
  arrivals: BoardEntry[];
}
