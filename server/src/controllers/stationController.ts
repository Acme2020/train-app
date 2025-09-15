import { Request, Response } from 'express';

// Mock handler for /api/stations/autocomplete
export const autocompleteStations = (req: Request, res: Response) => {
	res.json([
		{ id: '8000261', name: 'München Hbf', latitude: 48.1402, longitude: 11.5586 },
		{ id: '8000105', name: 'Berlin Hbf', latitude: 52.5251, longitude: 13.3694 }
	]);
};

// Mock handler for /api/stations/:stationId/board
export const getStationBoard = (req: Request, res: Response) => {
	res.json({
		departures: [
			{
				tripId: 'ICE123',
				when: new Date().toISOString(),
				plannedWhen: new Date().toISOString(),
				delay: 0,
				platform: '5',
				direction: 'Berlin',
				line: { name: 'ICE', productName: 'ICE' },
				stop: { id: '8000261', name: 'München Hbf', latitude: 48.1402, longitude: 11.5586 }
			}
		],
		arrivals: [
			{
				tripId: 'EC456',
				when: new Date().toISOString(),
				plannedWhen: new Date().toISOString(),
				delay: 5,
				platform: '7',
				direction: 'München',
				line: { name: 'EC', productName: 'EC' },
				stop: { id: '8000105', name: 'Berlin Hbf', latitude: 52.5251, longitude: 13.3694 }
			}
		]
	});
};
