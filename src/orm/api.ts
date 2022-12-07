import Http from '../http.js';
import type Repository from './repository.js';
import type { ApiRequestConfig } from './interfaces/apiRequestConfig.js';
import type InternalApiRequest from './interfaces/internalApiRequest.js';
import HttpRequest from './enums/httpRequest.js';
import { record } from '../main.js';
import ApiModelConfig from './interfaces/apiModelConfig.js';
import ApiResponse from './interfaces/apiResponse.js';

export default class Api<T> {
  constructor(protected model: any, protected repository: Repository<T>, protected config: ApiModelConfig) {}

  async get(endpoint?: string, options?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return await this.makeRequest(HttpRequest.GET, {
      url: endpoint,
      options,
      callback: (url: string) => Http.get(url, options?.config),
    });
  }

  async post(endpoint: string, data?: any, options?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return await this.makeRequest(HttpRequest.POST, {
      url: endpoint,
      options,
      callback: (url: string) => Http.post(url, data, options?.config),
    });
  }

  async put(endpoint: string, data?: any, options?: ApiRequestConfig): Promise<ApiResponse<T>> {
    /*
     * TODO: Currently, Http.put will replace the entire record with the data provided, instead of updating the record.
     * We can fix this but we'll have to write a function that can update a model and all of its relationships.
     */

    return await this.makeRequest(HttpRequest.PUT, {
      url: endpoint,
      options,
      callback: (url: string) => Http.put(url, data, options?.config),
    });
  }

  async patch(endpoint: string, data?: any, options?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return await this.makeRequest(HttpRequest.PATCH, {
      url: endpoint,
      options,
      callback: (url: string) => Http.patch(url, data, options?.config),
    });
  }

  async head(endpoint: string, options?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return await this.makeRequest(HttpRequest.HEAD, {
      url: endpoint,
      options,
      callback: (url: string) => Http.head(url, options?.config),
    });
  }

  async delete(endpoint: string, options?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return await this.makeRequest(HttpRequest.DELETE, {
      url: endpoint,
      options,
      callback: (url: string) => Http.delete(url, options?.config),
    });
  }

  private async makeRequest(method: HttpRequest, apiRequest: InternalApiRequest): Promise<ApiResponse<T>> {
    const requestOptions: ApiRequestConfig = this.returnApiOptions(apiRequest.options);

    return new Promise(async (resolve, reject) => {
      await apiRequest
        .callback(apiRequest.url && apiRequest.url !== '' ? apiRequest.url : this.config.route)
        .then((res) => {
          let instances: T[] = [];

          if (![HttpRequest.HEAD, HttpRequest.DELETE].includes(method) && requestOptions.save) {
            const dataToTransform = requestOptions.source ? res.data[requestOptions.source] : res.data;

            if (dataToTransform) {
              const savedInstances: T | T[] = this.repository.transform(
                requestOptions.source ? res.data[requestOptions.source] : res.data,
                requestOptions,
              );

              // if savedInstances is an array, then we can just assign it to instances
              if (Array.isArray(savedInstances)) {
                instances = savedInstances;
              } else {
                // if savedInstances is not an array, then we need to wrap it in an array
                instances.push(savedInstances);
              }
            }
          } else if (method === HttpRequest.DELETE && typeof requestOptions.delete !== 'undefined') {
            this.repository.delete(requestOptions.delete, requestOptions.deleteValue, {
              dataset: requestOptions?.dataset ?? 'all',
            });
          }

          resolve({
            response: res,
            instances,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private returnApiOptions(options?: ApiRequestConfig): ApiRequestConfig {
    let defaultEndpointOptions: ApiRequestConfig = {
      config: record.api.axiosConfig,
      replace: true,
      save: true,
      source: record.api.source,
      dataset: 'all',
    };

    defaultEndpointOptions = { ...defaultEndpointOptions, ...this.config };

    return options ? { ...defaultEndpointOptions, ...options } : defaultEndpointOptions;
  }
}
