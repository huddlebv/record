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
  first(options?: QueryOptions): T | null {
    if (!this.datasetExists(options?.dataset)) {
      return null;
    }

    const key = options?.dataset ?? 'all';

    if (this.data[key].length === 0) {
      return null;
    }

    return this.data[key][0];
  }

  // return the last item in the store
  last(options?: QueryOptions): T | null {
    if (!this.datasetExists(options?.dataset)) {
      return null;
    }

    const key = options?.dataset ?? 'all';

    if (this.data[key].length === 0) {
      return null;
    }

    return this.data[key][this.data[key].length - 1];
  }

  // take n number of items from the store
  take(amount: number, options?: QueryOptions): T[] {
    if (!this.datasetExists(options?.dataset)) {
      return [];
    }

    const key = options?.dataset ?? 'all';

    if (this.data[key].length === 0) {
      return [];
    }

    return this.data[key].slice(0, amount);
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
    if (options && options.replace && options.update) {
      console.error('You cannot use the replace and update options at the same time');

      return null;
    }

    // create the dataset if it doesn't exist
    if (options?.dataset && !this.datasetExists(options?.dataset)) {
      this.data[options.dataset] = [];
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

    this.deepUpdate(item, data);

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
    this.data[dataKey] = this.data[dataKey].filter((item) => (item as any)[filterNeedle] !== filterValue);

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
  transform(data: any, options: StoreSaveOptions): T | T[] {
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
            dataset: options.dataset ?? 'all',
          });

          if (match !== null) {
            if (options.update) {
              // update the existing model
              shouldInstantiate = false;

              this.update(id, item, {
                dataset: options.dataset ?? 'all',
              });
            } else if (options.replace) {
              // fire the beforeUpdate event
              (match as any).beforeUpdate(data);
            } else {
              // a match exists but we don't want to update or replace it, so we don't need to do anything
              return;
            }
          }
        }
      } else {
        // if it is an existing model, fire the beforeUpdate event
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
    if (options.save) {
      this.persist(instanceData, options);
    }

    // return the data
    return isArray ? instanceData : instanceData[0];
  }

  // add the data to the store
  persist(data: T | T[], options: StoreSaveOptions): T | T[] | null {
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
  private persistSingleItem(data: T, options: StoreSaveOptions): T | null {
    const key = options.dataset ?? 'all';
    const id = (data as any).id;

    // if we don't already have the data in the store, add it
    if (
      !this.find(id, {
        dataset: options.dataset ?? 'all',
      })
    ) {
      if (!this.datasetExists(key)) {
        this.data[key] = [];
      }

      this.data[key].push(data);

      return data;
    } else if (options.replace) {
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
        dataset: options.dataset ?? 'all',
      });
    }

    return null;
  }

  // combine the default save options with the options passed in
  private returnSaveOptions(options?: StoreSaveOptions): StoreSaveOptions {
    const defaultEndpointOptions: StoreSaveOptions = {
      replace: true,
      update: false,
      save: true,
      dataset: 'all',
    };

    return options ? { ...defaultEndpointOptions, ...options } : defaultEndpointOptions;
  }

  deepUpdate(item: any, newData: object): void {
    try {
      // for each field that needs to be updated
      Object.entries(newData).forEach(([key, value]) => {
        // if its an array
        if (Array.isArray(value)) {
          this.processArray(item, key, value);
          // if its an object and value is not null
        } else if (typeof value === 'object' && value !== null) {
          this.processObject(item, key, value);
        } else {
          // if its not an array or object, we can just set the value
          item[key] = value;
        }
      });
    } catch (error) {
      console.error(
        `Error in deepUpdate: ${error}\n` +
        `For item: ${JSON.stringify(item)}\n` +
        `and newData: ${JSON.stringify(newData)}`
      );
    }
  }

  private processObject(item: any, key: string, value: any) {
    try {
      const hasPropType = item.propTypes?.[key] !== undefined;
      const itemIsUndefined = item[key] === undefined || !item[key];

      if (!hasPropType && itemIsUndefined) {
        // item[key] = {};

        this.deepUpdate(item[key], value);
      } else if (hasPropType && itemIsUndefined) {
        const ModelConstructor = item.propTypes[key];

        if (ModelConstructor) {
          item[key] = this.createModelInstance(item, value, key);
        }
      } else {
        // if the item is already defined, recursively update it
        this.deepUpdate(item[key], value);
      }
    } catch (error) {
      console.error(
        `Error in processObject: ${error}\n` +
        `For item: ${JSON.stringify(item)}\n` +
        `and key: ${key}\n` +
        `and value: ${JSON.stringify(value)}`
      );
    }
  }

  private processArray(item: any, key: string, value: any) {
    try {
      // if the item doesn't have the array, create it
      if (item[key] === undefined || !Array.isArray(item[key])) {
        item[key] = [];
      }

      // if item is an array and values length is smaller than item length, remove the extra items
      if (Array.isArray(item[key]) && value.length < item[key].length) {
        // if the item has a getter/setter, we need to set the value as an array
        const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(item), key);
        const hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

        // remove all items after the new array length
        hasGetterSetter ? (item[key] = item[key].slice(0, value.length)) : item[key].splice(value.length);
      }

      // for each item in the array
      value.forEach((arrayItem: any, index: number) => {
        this.processArrayItem(item, key, value, arrayItem, index);
      });
    } catch (error) {
      console.error(
        `Error in processArray: ${error}\n` +
        `For item: ${JSON.stringify(item)}\n` +
        `and key: ${key}\n` +
        `and value: ${JSON.stringify(value)}`
      );
    }
  }

  private processArrayItem(item: any, key: string, value: any, arrayItem: any, index: number) {
    try {
      const hasPropType = item.propTypes?.[key] !== undefined;
      const isArray = Array.isArray(arrayItem);
      const isObject = typeof arrayItem === 'object';
      const isUndefined = typeof item[key]?.[index] === 'undefined';

      // if the item is undefined, does not have a class defined, and is an array or object, create it
      if (isUndefined && !hasPropType && (isArray || isObject)) {
        item[key][index] = isArray ? [] : {};

        // recursively update the item
        this.deepUpdate(item[key][index], arrayItem);
      } else if (isUndefined && hasPropType) {
        // if the value is undefined and the item has a class defined, create the new instance
        const ModelConstructor = item.propTypes[key];
        if (ModelConstructor) {
          // if the item has a getter/setter, we need to set the value as an array
          const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(item), key);
          const hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

          // create the new instance
          const newItem = this.createModelInstance(item, arrayItem, key);

          if (newItem) {
            // add the new instance to the array
            hasGetterSetter ? (item[key] = [...item[key], newItem]) : item[key].push(newItem);
          }
        }
      } else if (isArray || isObject) {
        // if the item is already defined, recursively update it
        this.deepUpdate(item[key][index], arrayItem);
      } else {
        // if the item is already defined and is not an array or object, set the value
        item[key][index] = arrayItem;
      }
    } catch (error) {
      console.error(
        `Error in processArrayItem: ${error}\n` +
        `For item: ${JSON.stringify(item)}\n` +
        `and key: ${key}\n` +
        `and value: ${JSON.stringify(value)}` +
        `and arrayItem: ${JSON.stringify(arrayItem)}\n` +
        `and index: ${index}`
      );
    }
  }

  // if the item has a model constructor, we need to create a new instance of that model
  private createModelInstance(item: any, value: any, key: string): any {
    if (typeof item.propTypes === 'undefined') {
      return;
    }

    const ModelConstructor = item.propTypes[key];

    if (!ModelConstructor) {
      return;
    }

    const newItem = new ModelConstructor(value);

    this.deepUpdate(newItem, value);

    return newItem;
  }

  datasetExists(key?: string): boolean {
    return typeof this.data[key ?? 'all'] !== 'undefined';
  }

  query(options?: QueryOptions): Query<T> {
    return new Query<T>(this, options?.dataset ?? 'all');
  }
}
