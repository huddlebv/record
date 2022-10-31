import axios from 'axios';
import type { AxiosInstance } from 'axios';
import AxiosOptions from "./orm/interfaces/axiosOptions";
import DebugOptions from "./orm/interfaces/axiosDebugOptions";

export let defaultAxiosInstance: AxiosInstance | null = null;
export let debug: DebugOptions = {
  logRequest: false,
  logRequestHeaders: false,
  logRequestBody: false,
  logResponseHeaders: false,
  logResponseBody: false,
  logResponseStatus: false,
};

export function setupRecord(options?: AxiosOptions) {
  defaultAxiosInstance = axios.create({
    baseURL: options?.baseUrl ?? '',
  });

  if (options?.debug) {
    debug = options.debug
      ? { ...debug, ...options.debug }
      : debug;
  }
}
