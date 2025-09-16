/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Line } from './Line';
import type { Station } from './Station';
export type Departure = {
    tripId: string;
    when: string;
    plannedWhen: string;
    delay?: number | null;
    platform?: string | null;
    direction: string;
    line: Line;
    stop: Station;
};

