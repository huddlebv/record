import { record } from './main.js';
import type { AxiosResponse } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type HttpRequest from './orm/interfaces/httpRequest.js';
import HttpRequestMethod from './orm/enums/httpRequestMethod.js';

export default class Http {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance.get(url, config),
      requestMethod: HttpRequestMethod.GET,
    });
  }

  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance.post<T>(url, data, config),
      requestMethod: HttpRequestMethod.POST,
    });
  }

  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance.put<T>(url, data, config),
      requestMethod: HttpRequestMethod.PUT,
    });
  }

  static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance.patch<T>(url, data, config),
      requestMethod: HttpRequestMethod.PATCH,
    });
  }

  static async head<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance.head<T>(url, config),
      requestMethod: HttpRequestMethod.HEAD,
    });
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance.delete<T>(url, config),
      requestMethod: HttpRequestMethod.DELETE,
    });
  }

  private static async makeRequest(apiRequest: HttpRequest): Promise<AxiosResponse> {
    let baseUrl = record.api.axiosInstance.defaults.baseURL;

    if (baseUrl && apiRequest.config?.baseURL) {
      // remove everything after the main domain
      baseUrl = baseUrl.replace(/(https?:\/\/[^\/]+\/).*/, '$1');

      // combine the axios base url with the request base url
      baseUrl =
        baseUrl +
        (baseUrl.endsWith('/') && apiRequest.config.baseURL.startsWith('/')
          ? apiRequest.config.baseURL.slice(1)
          : apiRequest.config.baseURL) +
        '/';
    }

    this.logRequest(apiRequest, baseUrl!);

    return new Promise(async (resolve, reject) => {
      await apiRequest
        .callback()
        .then((response) => {
          this.logResponse(response as AxiosResponse, apiRequest, baseUrl!);

          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private static logRequest(apiRequest: HttpRequest, baseUrl: string) {
    if (record.api.debug?.logRequest) {
      console.log(`Request: ${apiRequest.requestMethod} ${baseUrl}${apiRequest.url}`);
    }

    if (record.api.debug?.logRequestHeaders) {
      console.log(`Headers - ${apiRequest.config?.headers}`);
    }

    if (record.api.debug?.logRequestBody && apiRequest.config) {
      console.log(`Body - ${apiRequest.config.data}`);
    }
  }

  private static logResponse(response: AxiosResponse, apiRequest: HttpRequest, baseUrl: string) {
    if (record.api.debug?.logRequest) {
      console.log(`Response: ${apiRequest.requestMethod} ${baseUrl}${apiRequest.url}`);
    }

    if (record.api.debug?.logResponseStatus) {
      console.log(`Status - ${response.status} ${response.statusText}`);
    }

    if (record.api.debug?.logResponseHeaders) {
      console.log(`Headers - ${response.headers}`);
    }

    if (record.api.debug?.logResponseBody) {
      console.log(`Response body: ${response.data}`);
    }
  }
}
