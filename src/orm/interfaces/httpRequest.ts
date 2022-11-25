import {AxiosRequestConfig, AxiosResponse} from 'axios';

export default interface HttpRequest {
  callback: () => Promise<AxiosResponse>;
  config?: AxiosRequestConfig;
  url: string;
}
