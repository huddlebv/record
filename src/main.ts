import axios from 'axios';
import RecordConfig from './orm/interfaces/recordConfig.js';

export let record: RecordConfig = {
  api: {
    axiosInstance: null,
    axiosConfig: undefined,
    debug: {
      logRequest: false,
      logRequestHeaders: false,
      logRequestBody: false,
      logResponseHeaders: false,
      logResponseBody: false,
      logResponseStatus: false,
    },
    source: null,
  },
};

export function setupRecord(config?: RecordConfig) {
  record = config ? { ...record, ...config } : record;

  record.api.axiosInstance = axios.create(config?.api.axiosConfig);
}
