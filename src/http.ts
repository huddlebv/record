import { defaultAxiosInstance } from "./axios";
import type { AxiosResponse } from "axios";
import type { AxiosRequestConfig } from "axios";

export async function get<T>(
  url: string,
  config: AxiosRequestConfig
): Promise<AxiosResponse> {
  return await defaultAxiosInstance!.get<T>(url, config);
}