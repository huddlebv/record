import Query from './query';
import type StoreSaveOptions from './interfaces/StoreSaveOptions';
import QueryOptions from "./interfaces/queryOptions";

export default class Repository<T> {
  // by default all data is saved to the 'all' key
  // however, you can pass in a key to save the data to a different key
  data: Record<string, T[]> = {
    all: [],
  };

  constructor(protected model: any) {}

  // find an item in the store by id
  find(id: number, options?: QueryOptions): T | null {
    if (!this.datasetExists(options?.dataset)) {
      return null;
    }

    const match: T | undefined = this.data[options?.dataset ?? 'all'].find((item) => (item as any).id === id);

    return match ?? null;
  }

  // return all data in the store
  all(options?: QueryOptions): T[] {
    if (!this.datasetExists(options?.dataset)) {
      return [];
    }

    return this.data[options?.dataset ?? 'all'];
  }

  // return the first item in the store
  first(options?: QueryOptions): T | null {
    if (!this.datasetExists(options?.dataset)) {
      return null;
    }

    const key = options?.dataset ?? 'all';

    return this.data[key].length > 0 ? this.data[key][0] : null;
  }

  // return the last item in the store
  last(options?: QueryOptions): T | null {
    if (!this.datasetExists(options?.dataset)) {
      return null;
    }

    const key = options?.dataset ?? 'all';

    return this.data[key].length > 0 ? this.data[key][this.data[key].length - 1] : null;
  }

  // return the count of the data in the store
  count(options?: QueryOptions): number {
    if (!this.datasetExists(options?.dataset)) {
      return 0;
    }

    return this.data[options?.dataset ?? 'all'].length;
  }

  // return whether model data exists in the store based on an id
  exists(id: number, options?: QueryOptions): boolean {
    if (!this.datasetExists(options?.dataset)) {
      return false;
    }

    return this.find(id, options) !== null;
  }

  // function that saves or updates the data in the store
  save(data: T | T[] | object, options?: StoreSaveOptions): T | T[] | null {
    if (!this.datasetExists(options?.dataset)) {
      return null;
    }

    const saveOptions: StoreSaveOptions = this.returnSaveOptions(options);

    return this.transform(data, options);
  }

  // delete one or multiple models from the data store by id or by key/value pair
  delete(key: number | number[] | string, value?: any, options?: QueryOptions): void {
    if (!this.datasetExists(options?.dataset)) {
      return;
    }

    if (Array.isArray(key)) {
      key.forEach((item) => {
        this.deleteSingleItem(item, value, options);
      });
    } else if (typeof key === 'number') {
      this.deleteSingleItem(key, value, options);
    } else {
      this.deleteSingleItem(key, value, options);
    }
  }

  // deleteSingleItem by id or by key/value pair
  private deleteSingleItem(key: number | string, value?: any, options?: QueryOptions): void {
    const dataKey = options?.dataset ?? 'all';
    const filterNeedle = typeof key === 'number' ? 'id' : key;
    const filterValue = typeof key === 'number' ? key : value;

    // grab all items that match the id
    const itemsToDelete = this.data[dataKey].filter((item) => (item as any)[filterNeedle] === filterValue);

    // call beforeDelete on each item
    itemsToDelete.forEach((item) => (item as any).beforeDelete());

    // filter out the items that do not match the id
    this.data.all = this.data[dataKey].filter((item) => (item as any)[filterNeedle] !== filterValue);

    // call afterDelete on each item
    itemsToDelete.forEach((item) => (item as any).afterDelete());
  }

  // delete all data from the store (optionally by key)
  clear(options?: QueryOptions): void {
    if (!this.datasetExists(options?.dataset)) {
      return;
    }

    this.data[options?.dataset ?? 'all'] = [];
  }

  // completely reset the store
  reset(): void {
    this.data = {
      all: [],
    };
  }

  // transforms json data into an instance of the model
  transform(data: any, options?: StoreSaveOptions): T | T[] {
    const instanceData: any[] = [];
    const isArray = Array.isArray(data);
    const dataToTransform = isArray ? data : [data];

    dataToTransform.forEach((item: any) => {
      let shouldInstantiate = false;

      if (!(data instanceof this.model)) {
        const id = (data as any).id;

        shouldInstantiate = true;

        if (id !== null) {
          const match = this.find(id);

          if (match !== null) {
            (match as any).beforeUpdate(data);
          }
        }
      } else {
        (item as any).beforeUpdate(data);
      }

      const instance = shouldInstantiate ? new this.model(item) : item;

      instanceData.push(instance);
    });

    if (options?.save) {
      this.persist(instanceData, options);
    }

    return isArray ? instanceData : instanceData[0];
  }

  // add the data to the store
  persist(data: T | T[], options?: StoreSaveOptions): T | T[] | null {
    if (Array.isArray(data)) {
      const persistedData: T[] = [];

      data.forEach((item) => {
        const persistedItem = this.persistSingleItem(item, options);

        if (persistedItem !== null) {
          persistedData.push(persistedItem);
        }
      });

      return persistedData;
    } else {
      return this.persistSingleItem(data, options);
    }
  }

  // add the data to the store if it doesn't already exist or replace the existing data with the new data
  private persistSingleItem(data: T, options?: StoreSaveOptions): T | null {
    const key = options?.dataset ?? 'all';
    const id = (data as any).id;

    // if we don't already have the data in the store, add it
    if (!this.find(id)) {
      if (!this.datasetExists(key)) {
        this.data[key] = [];
      }

      this.data[key].push(data);

      return data;
    } else if (options?.replace) {
      let match = null;

      // replace the existing data with the new data
      this.data[key] = this.data[key].map(function (item) {
        if ((item as any).id === id) {
          match = item;
        }

        return (item as any).id === id ? data : item;
      });

      (match as any).afterUpdate(data);

      return this.find(id);
    }

    return null;
  }

  // combine the default save options with the options passed in
  private returnSaveOptions(options?: StoreSaveOptions): StoreSaveOptions {
    const defaultEndpointOptions: StoreSaveOptions = {
      replace: true,
      save: true,
      dataset: 'all',
    };

    return options ? { ...defaultEndpointOptions, ...options } : defaultEndpointOptions;
  }

  datasetExists(key?: string): boolean {
    return typeof this.data[key ?? 'all'] !== 'undefined';
  }

  query(options?: QueryOptions): Query<T> {
    return new Query<T>(this, options?.dataset ?? 'all')
  };
}
