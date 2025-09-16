/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Arrival } from '../models/Arrival';
import type { Departure } from '../models/Departure';
import type { Station } from '../models/Station';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StationsService {
    /**
     * Autocomplete stations by name
     * @param q Search query for station name
     * @param limit Max number of results (default 5)
     * @returns Station List of matching stations
     * @throws ApiError
     */
    public static getApiStationsAutocomplete(
        q: string,
        limit?: number,
    ): CancelablePromise<Array<Station>> {
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
    public static getApiStationsBoard(
        stationId: string,
        minutes: number = 10,
    ): CancelablePromise<{
        departures?: Array<Departure>;
        arrivals?: Array<Arrival>;
    }> {
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
