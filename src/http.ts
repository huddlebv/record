import { record } from './main.js';
import type { AxiosResponse } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type HttpRequest from './orm/interfaces/httpRequest.js';

export default class Http {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance!.get(url, config),
    });
  }

  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance!.post<T>(url, data, config),
    });
  }

  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance!.put<T>(url, data, config),
    });
  }

  static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance!.patch<T>(url, data, config),
    });
  }

  static async head<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance!.head<T>(url, config),
    });
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.makeRequest({
      url,
      config,
      callback: () => record.api.axiosInstance!.delete<T>(url, config),
    });
  }

  private static async makeRequest(apiRequest: HttpRequest): Promise<AxiosResponse> {
    this.logRequest(apiRequest.url, apiRequest.config);

    return new Promise(async (resolve, reject) => {
      await apiRequest.callback().then((response) => {
        this.logResponse(response as AxiosResponse);

        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  private static logRequest(url: string, config?: AxiosRequestConfig) {
    if (record.api.debug?.logRequest) {
      console.log(`GET ${record.api.axiosInstance!.defaults.baseURL}${url}`);
    }

    if (record.api.debug?.logRequestHeaders) {
      console.log(`Request headers: ${record.api.axiosInstance!.defaults.headers}`);
    }

    if (record.api.debug?.logRequestBody && config) {
      console.log(`Request body: ${config.data}`);
    }
  }

  private static logResponse(response: AxiosResponse) {
    if (record.api.debug?.logResponseStatus) {
      console.log(`Status: ${response.status} ${response.statusText}`);
    }

    if (record.api.debug?.logResponseHeaders) {
      console.log(`Response headers: ${response.headers}`);
    }

    if (record.api.debug?.logResponseBody) {
      console.log(`Response body: ${response.data}`);
    }
  }
}
