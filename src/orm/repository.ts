import Query from "./query";
import type StoreCreateOptions from "./interfaces/storeCreateOptions";

export default class Repository<T> {
  data: T[] = [];

  constructor(protected model: any) {}

  find(id: number): T | null {
    const match: T | undefined = this.data.find(
      (item) => (item as any).id === id
    );

    return match ?? null;
  }

  all(): T[] {
    return this.data;
  }

  first(): T | null {
    return this.data.length > 0 ? this.data[0] : null;
  }

  last(): T | null {
    return this.data.length > 0 ? this.data[this.data.length - 1] : null;
  }

  count(): number {
    return this.data.length;
  }

  create(data: T | T[], options?: StoreCreateOptions): T | T[] {
    const createOptions: StoreCreateOptions = this.returnCreateOtions(options);

    if (createOptions.save) {
      this.persist(data);
    }

    return data;
  }

  // delete one or multiple models from the data store
  delete(id: number | number[]): void {
    if (Array.isArray(id)) {
      id.forEach((id) => {
        this.data = this.data.filter((item) => (item as any).id !== id);
      });
    } else {
      this.data = this.data.filter((item) => (item as any).id !== id);
    }

    return;
  }

  transform(data: any, persist: boolean = false): T | T[] {
    if (typeof data.length === "undefined") {
      const newInstance = new this.model(data);

      if (persist) {
        this.persist(newInstance);
      }

      return new this.model(data);
    } else {
      const instanceData: any[] = [];

      data.forEach((instance: any) => {
        instanceData.push(new this.model(instance));
      });

      if (persist) {
        this.persist(instanceData);
      }

      return instanceData;
    }
  }

  // add the data to the store
  persist(data: T | T[]) {
    if (Array.isArray(data)) {
      data.forEach((item) => {
        this.persistSingleItem(item);
      });
    } else {
      this.persistSingleItem(data);
    }
  }

  // add the data to the store if it doesn't already exist or replace the existing data with the new data
  persistSingleItem(data: T) {
    const id = (data as any).id;

    if (!this.find(id)) {
      this.data.push(data);
    } else {
      // replace the existing data with the new data
      this.data = this.data.map((item) => {
        return (item as any).id === id ? data : item;
      });
    }
  }

  private returnCreateOtions(options?: StoreCreateOptions): StoreCreateOptions {
    const defaultEndpointOptions: StoreCreateOptions = {
      save: true,
    };

    return options
      ? { ...defaultEndpointOptions, ...options }
      : defaultEndpointOptions;
  }

  query: Query<T> = new Query<T>(this);
}
