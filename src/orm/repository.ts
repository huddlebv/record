import Query from './query.js';
import type StoreSaveOptions from './interfaces/StoreSaveOptions.js';
import QueryOptions from './interfaces/queryOptions.js';

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
  first(amount: number = 1, options?: QueryOptions): T | T[] | null {
    if (!this.datasetExists(options?.dataset)) {
      return null;
    }

    const key = options?.dataset ?? 'all';

    if (this.data[key].length === 0) {
      return amount > 0 ? [] : null;
    }

    return amount === 1 ? this.data[key][0] : this.data[key].slice(0, amount);
  }

  // return the last item in the store
  last(amount: number = 1, options?: QueryOptions): T | T[] | null {
    if (!this.datasetExists(options?.dataset)) {
      return null;
    }

    const key = options?.dataset ?? 'all';

    if (this.data[key].length === 0) {
      return amount > 0 ? [] : null;
    }

    return amount === 1
      ? this.data[key][this.data[key].length - 1]
      : this.data[key].slice(this.data[key].length - amount, this.data[key].length);
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

  // function that saves the data in the store
  save(data: T | T[] | object, options?: StoreSaveOptions): T | T[] | null {
    if (!this.datasetExists(options?.dataset)) {
      return null;
    }

    const saveOptions: StoreSaveOptions = this.returnSaveOptions(options);

    return this.transform(data, saveOptions);
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

  update(id: number, data: object, options?: QueryOptions): T | null {
    if (!this.datasetExists(options?.dataset)) {
      return null;
    }

    const item = this.find(id, options);

    if (item === null) {
      return null;
    }

    (item as any).beforeUpdate();

    Object.assign(item as any, data);

    (item as any).afterUpdate();

    return item;
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

    // loop over data
    dataToTransform.forEach((item: any) => {
      let shouldInstantiate = false;

      // see if the item already is a model
      if (!(item instanceof this.model)) {
        // if not, check if the item has an id
        const id = (item as any).id;

        // don't save if we don't have an id
        if (typeof id === 'undefined') {
          return;
        }

        // it's not a model, but it has an id, so we should instantiate it
        shouldInstantiate = true;

        // check if the item already exists in the store
        if (id !== null) {
          const match = this.find(id, {
            dataset: options?.dataset ?? 'all',
          });

          if (match !== null) {
            // if it does, fire the beforeUpdate event
            (match as any).beforeUpdate(data);
          }
        }
      } else {
        // if it is a existing model, fire the beforeUpdate event
        (item as any).beforeUpdate(data);
      }

      // instantiate the model if needed
      const instance = shouldInstantiate ? new this.model(item) : item;

      // add the instance to the array
      instanceData.push(instance);
    });

    // don't save if we don't have any data
    if (instanceData.length === 0) {
      return [];
    }

    // persist the data if needed
    if (options?.save) {
      this.persist(instanceData, options);
    }

    // return the data
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
    if (
      !this.find(id, {
        dataset: options?.dataset ?? 'all',
      })
    ) {
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

      return this.find(id, {
        dataset: options?.dataset ?? 'all',
      });
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
    return new Query<T>(this, options?.dataset ?? 'all');
  }
}
