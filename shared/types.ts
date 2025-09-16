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
  direction: string;
  line: string;
  stop: string;
}

export interface BoardResponse {
  departures: BoardEntry[];
  arrivals: BoardEntry[];
}
