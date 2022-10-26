import axios from "axios";
import type { AxiosInstance } from "axios";

interface AxiosOptions {
  baseUrl?: string;
}

export let defaultAxiosInstance: AxiosInstance | null = null;

export function setup (options?: AxiosOptions) {
  defaultAxiosInstance = axios.create({
    baseURL: options?.baseUrl ?? "",
  });
};