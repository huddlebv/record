import { get as httpGet } from "../http";
import type Repository from "./repository";
import type { GetEndpointOptions } from "./interfaces/apiEndpointOptions";

export default class Api<T> {
  constructor(protected repository: Repository<T>) {}

  get(endpoint: string, options?: GetEndpointOptions) {
    const requestOptions: GetEndpointOptions = this.returnGetOptions(options);

    return new Promise((resolve, reject) => {
      httpGet(endpoint, requestOptions.config!)
        .then((res) => {
          if (requestOptions.save) {
            this.repository.transform(res.data[requestOptions.source!], true);
          }

          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private returnGetOptions(options?: GetEndpointOptions): GetEndpointOptions {
    const defaultEndpointOptions: GetEndpointOptions = {
      save: true,
      source: "data",
      config: {},
    };

    return options
      ? { ...defaultEndpointOptions, ...options }
      : defaultEndpointOptions;
  }
}