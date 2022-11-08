import type { AxiosRequestConfig } from 'axios';

export interface ApiRequestConfig {
  config?: AxiosRequestConfig;
  replace?: boolean;
  save?: boolean;
  source?: string | null;
  delete?: number | number[] | string;
  deleteValue?: any;
  dataset?: string;
}
