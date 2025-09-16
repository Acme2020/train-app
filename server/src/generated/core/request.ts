/* generated using openapi-typescript-codegen -- do not edit */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { ApiRequestOptions } from "./ApiRequestOptions";
import { ApiResult } from "./ApiResult";
import { CancelablePromise } from "./CancelablePromise";
import { OpenAPI } from "./OpenAPI";

/**
 * Request method
 * @param options The request options from the service
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const request = <T>(
  options: ApiRequestOptions
): CancelablePromise<T> => {
  return new CancelablePromise<T>((resolve, reject, onCancel) => {
    // This is a placeholder implementation since we're using this on the server side
    // The actual implementation will depend on your server-side HTTP client
    const url = `${options.url}`;

    // Mock implementation that immediately resolves with an empty object
    resolve({} as T);

    // Add cancel handler
    onCancel(() => {
      // Cancel logic here if needed
      console.log("Request was cancelled");
    });
  });
};
