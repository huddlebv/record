import type { AxiosRequestConfig } from "axios";

export interface GetEndpointOptions {
  config?: AxiosRequestConfig;
  replace?: boolean;
  save?: boolean;
  source?: string | null;
}
