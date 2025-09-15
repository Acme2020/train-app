import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Autocomplete stations by name
     * @param q Search query for station name
     * @param limit Max number of results (default 5)
     * @returns Station List of matching stations
     * @throws ApiError
     */
    static getApiStationsAutocomplete(q, limit) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stations/autocomplete',
            query: {
                'q': q,
                'limit': limit,
            },
        });
    }
    /**
     * Get departures and arrivals for a specific station
     * @param stationId The station EVA ID (e.g., 8000261 for München Hbf)
     * @param minutes Minutes ahead to show departures and arrivals for (default 10)
     * @returns any Object containing arrays of departures and arrivals
     * @throws ApiError
     */
    static getApiStationsBoard(stationId, minutes = 10) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stations/{stationId}/board',
            path: {
                'stationId': stationId,
            },
            query: {
                'minutes': minutes,
            },
        });
    }
}
