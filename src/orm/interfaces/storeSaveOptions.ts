import {ApiRequestConfig} from "./apiRequestConfig";

type StoreSaveOptions = Pick<ApiRequestConfig, "replace" | "save" | "dataset">;

export default StoreSaveOptions;