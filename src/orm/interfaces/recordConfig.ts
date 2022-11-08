import { AxiosInstance, AxiosRequestConfig } from 'axios';
import DebugOptions from './axiosDebugOptions';

export default interface RecordConfig {
  api: {
    axiosConfig?: AxiosRequestConfig;
    axiosInstance?: AxiosInstance | null;
    debug?: DebugOptions;
    source?: string | null;
  };
}
