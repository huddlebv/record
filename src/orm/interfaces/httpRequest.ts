import { AxiosRequestConfig, AxiosResponse } from 'axios';
import HttpRequestMethod from "../enums/httpRequestMethod";

export default interface HttpRequest {
  callback: () => Promise<AxiosResponse>;
  config?: AxiosRequestConfig;
  url: string;
  requestMethod: HttpRequestMethod;
}
