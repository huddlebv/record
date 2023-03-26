import { ApiRequestConfig } from './apiRequestConfig.js';

type StoreSaveOptions = Pick<ApiRequestConfig, 'replace' | 'save' | 'dataset' | 'update'>;

export default StoreSaveOptions;
