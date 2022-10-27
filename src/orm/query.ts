import type Repository from "./repository";

export default class Query<T> {
  private queryResult: T[] = [];

  constructor(private repository: Repository<T>) {}

  where(field: string | Function, value?: any): Query<T> {
    if (typeof field === "string") {
      this.queryResult = this.queryResult.concat(
        this.repository.data.filter((item) => (item as any)[field] === value)
      );
    } else {
      this.queryResult = this.queryResult.concat(
        this.repository.data.filter((item) => {
          return field(item);
        })
      );
    }

    this.queryResult = this.filterDuplicates(this.queryResult);

    return this;
  }

  get(): T[] {
    return this.queryResult;
  }

  first(): T | null {
    return this.queryResult.length > 0 ? this.queryResult[0] : null;
  }

  last(): T | null {
    return this.queryResult.length > 0
      ? this.queryResult[this.queryResult.length - 1]
      : null;
  }

  // filter out duplicates by id and return the result
  filterDuplicates(items: T[]): T[] {
    return items.filter(
      (v, i, a) => a.findIndex((v2) => (v2 as any).id === (v as any).id) === i
    );
  }
}
