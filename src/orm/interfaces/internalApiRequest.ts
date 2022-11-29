import { AxiosResponse } from 'axios';
import { ApiRequestConfig } from './apiRequestConfig.js';

export default interface InternalApiRequest {
  callback: (url: string) => Promise<AxiosResponse>;
  url?: string;
  options?: ApiRequestConfig;
}
