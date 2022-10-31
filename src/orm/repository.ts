import Query from "./query";
import type StoreSaveOptions from "./interfaces/StoreSaveOptions";

export default class Repository<T> {
  data: T[] = [];

  constructor(protected model: any) {}

  // find an item in the store by id
  find(id: number): T | null {
    const match: T | undefined = this.data.find(
      (item) => (item as any).id === id
    );

    return match ?? null;
  }

  // return all data in the store
  all(): T[] {
    return this.data;
  }

  // return the first item in the store
  first(): T | null {
    return this.data.length > 0 ? this.data[0] : null;
  }

  // return the last item in the store
  last(): T | null {
    return this.data.length > 0 ? this.data[this.data.length - 1] : null;
  }

  // return the count of the data in the store
  count(): number {
    return this.data.length;
  }

  // return whether model data exists in the store based on an id
  exists(id: number): boolean {
    return this.find(id) !== null;
  }

  // function that saves or updates the data in the store
  save(data: T | T[] | object, options?: StoreSaveOptions): T | T[] | null {
    const saveOptions: StoreSaveOptions = this.returnSaveOptions(options);

    return this.transform(data, saveOptions.save, saveOptions.replace);
  }

  // delete one or multiple models from the data store by id or by key/value pair
  delete(key: number | number[] | string, value?: any): void {
    if (Array.isArray(key)) {
      key.forEach((item) => {
        this.deleteSingleItem(item);
      });
    } else if (typeof key === "number") {
      this.deleteSingleItem(key);
    } else {
      this.deleteSingleItem(key, value);
    }
  }

  // deleteSingleItem by id or by key/value pair
  private deleteSingleItem(key: number | string, value?: any): void {
    const filterNeedle = typeof key === "number" ? 'id' : key;
    const filterValue = typeof key === "number" ? key : value;

    // grab all items that match the id
    const itemsToDelete = this.data.filter((item) => (item as any)[filterNeedle] === filterValue);

    // call beforeDelete on each item
    itemsToDelete.forEach((item) => (item as any).beforeDelete());

    // filter out the items that do not match the id
    this.data = this.data.filter((item) => (item as any)[filterNeedle] !== filterValue);

    // call afterDelete on each item
    itemsToDelete.forEach((item) => (item as any).afterDelete());
  }

  // delete all data from the store
  clear(): void {
    this.data = [];
  }

  // transforms json data into an instance of the model
  transform(data: any, persist: boolean = false, replace: boolean = true): T | T[] {
    const instanceData: any[] = [];
    const isArray = Array.isArray(data);
    const dataToTransform = isArray ? data : [data];

    dataToTransform.forEach((item: any) => {
      let shouldInstantiate = false;

      if (!(data instanceof this.model)) {
        const id = (data as any).id;
        const match = this.find(id);

        if (id === null) {
          shouldInstantiate = true;
        } else if (match === null) {
          shouldInstantiate = true;
        } else {
          (match as any).beforeUpdate(data);
        }
      } else {
        (item as any).beforeUpdate(data);
      }

      const instance = shouldInstantiate ? new this.model(item) : item;

      instanceData.push(instance);
    });

    if (persist) {
      this.persist(instanceData, replace);
    }

    return isArray ? instanceData : instanceData[0];
  }

  // add the data to the store
  persist(data: T | T[], replace: boolean = true): T | T[] | null {
    if (Array.isArray(data)) {
      const persistedData: T[] = [];

      data.forEach((item) => {
        const persistedItem = this.persistSingleItem(item, replace);

        if (persistedItem !== null) {
          persistedData.push(persistedItem);
        }
      });

      return persistedData;
    } else {
      return this.persistSingleItem(data, replace);
    }
  }

  // add the data to the store if it doesn't already exist or replace the existing data with the new data
  private persistSingleItem(data: T, replace: boolean = true): T | null {
    const id = (data as any).id;

    // if we don't already have the data in the store, add it
    if (!this.find(id)) {
      this.data.push(data);

      return data;
    } else if (replace) {
      let match = null;

      // replace the existing data with the new data
      this.data = this.data.map(function (item) {
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
    };

    return options
      ? { ...defaultEndpointOptions, ...options }
      : defaultEndpointOptions;
  }

  query: Query<T> = new Query<T>(this);
}
