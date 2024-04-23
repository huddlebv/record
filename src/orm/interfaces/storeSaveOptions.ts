import { ApiRequestConfig } from './apiRequestConfig.js';

type StoreSaveOptions = Pick<ApiRequestConfig, 'replace' | 'save' | 'dataset' | 'update' | 'prepend'>;

export default StoreSaveOptions;
