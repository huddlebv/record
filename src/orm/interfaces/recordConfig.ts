import { AxiosInstance, AxiosRequestConfig } from 'axios';
import DebugOptions from './axiosDebugOptions.js';

export default interface RecordConfig {
  api: {
    axiosInstance: AxiosInstance;
    debug?: DebugOptions;
    source?: string | null;
  };
}
