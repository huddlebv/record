import type { AxiosRequestConfig } from "axios";

export interface GetEndpointOptions {
  save?: boolean;
  source?: string | null;
  config?: AxiosRequestConfig;
}
