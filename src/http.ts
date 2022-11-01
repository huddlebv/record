import { defaultAxiosInstance, debug } from './axios';
import type { AxiosResponse } from 'axios';
import type { AxiosRequestConfig } from 'axios';

interface ApiRequest {
  callback: () => Promise<AxiosResponse>;
  config?: AxiosRequestConfig;
  url: string;
}

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
  return await makeRequest({
    url,
    config,
    callback: () => defaultAxiosInstance!.get(url, config),
  });
}

export async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
  return await makeRequest({
    url,
    config,
    callback: () => defaultAxiosInstance!.post<T>(url, data, config),
  });
}

async function makeRequest(apiRequest: ApiRequest): Promise<AxiosResponse> {
  logRequest(apiRequest.url, apiRequest.config);

  const response = await apiRequest.callback();

  logResponse(response);

  return response;
}

function logRequest(url: string, config?: AxiosRequestConfig) {
  if (debug.logRequest) {
    console.log(`GET ${defaultAxiosInstance!.defaults.baseURL}${url}`);
  }

  if (debug.logRequestHeaders) {
    console.log(`Request headers: ${defaultAxiosInstance!.defaults.headers}`);
  }

  if (debug.logRequestBody && config) {
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
