import { setup, axiosInstance } from "./axios";

setup({
  baseUrl: 'https://huddle.test/api/v3/',
});

console.log(axiosInstance);
console.log('test');