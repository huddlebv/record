import axios from "axios";
import type { AxiosInstance } from "axios";

interface AxiosOptions {
  baseUrl?: string;
}

export let axiosInstance: AxiosInstance | null = null;

export function setup (options?: AxiosOptions) {
  axiosInstance = axios.create({
    baseURL: options?.baseUrl ?? "",
  });
};