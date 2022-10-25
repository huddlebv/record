import { setup, axiosInstance } from "./axios";
import { AxiosInstance } from "axios";

setup({
  baseUrl: 'https://huddle.test/api/v3/',
});

export let axiosInstanceQ: AxiosInstance = axiosInstance!;