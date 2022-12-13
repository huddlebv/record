import axios from 'axios';
import RecordConfig from './orm/interfaces/recordConfig.js';

export let record: RecordConfig = {
  api: {
    axiosInstance: axios.create({}),
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

  if (config) {
    record.api.axiosInstance = config.api.axiosInstance;
  }
}
