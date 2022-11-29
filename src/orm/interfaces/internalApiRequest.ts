import { AxiosResponse } from 'axios';
import { ApiRequestConfig } from './apiRequestConfig';

export default interface InternalApiRequest {
  callback: (url: string) => Promise<AxiosResponse>;
  url?: string;
  options?: ApiRequestConfig;
}
