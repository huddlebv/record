import { defaultAxiosInstance, debug } from './axios';
import type { AxiosResponse } from 'axios';
import type { AxiosRequestConfig } from 'axios';

export async function get<T>(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
  logRequest(url, config);

  const response: AxiosResponse = await defaultAxiosInstance!.get<T>(url, config);

  logResponse(response);

  return response;
}

function logRequest(url: string, config: AxiosRequestConfig) {
  if (debug.logRequest) {
    console.log(`GET ${defaultAxiosInstance!.defaults.baseURL}${url}`);
  }

  if (debug.logRequestHeaders) {
    console.log(`Request headers: ${defaultAxiosInstance!.defaults.headers}`);
  }

  if (debug.logRequestBody) {
    console.log(`Request body: ${config.data}`);
  }
}

function logResponse(response: AxiosResponse) {
  if (debug.logResponseStatus) {
    console.log(`Status: ${response.status} ${response.statusText}`);
  }

  if (debug.logResponseHeaders) {
    console.log(`Response headers: ${response.headers}`);
  }

  if (debug.logResponseBody) {
    console.log(`Response body: ${response.data}`);
  }
}
