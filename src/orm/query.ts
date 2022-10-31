import type Repository from './repository';
import QueryOperator from '../../src/orm/enums/queryOperator';

export default class Query<T> {
  private queryResult: T[] = [];

  constructor(private repository: Repository<T>) {}

  // filter the query result by function or key value pair with optional operator
  where(field: string | Function, operator?: QueryOperator | any, value?: any): Query<T> {
    if (typeof field === 'string') {
      // operator can be an actual operator or the value, depending on if a operator is provided
      // if no operator is provided, the operator is assumed to be QueryOperator.Equal
      const actualValue = typeof value === 'undefined' ? operator : value;
      const actualOperator = typeof value === 'undefined' ? QueryOperator.EQUAL : operator;

      // set the query result equal to the current query result plus where the field is equal to the value
      this.queryResult = this.queryResult.concat(
        this.repository.data.filter(function (item) {
          switch (actualOperator) {
            case QueryOperator.EQUAL:
              return (item as any)[field] === actualValue;
            case QueryOperator.NOT_EQUAL:
              return (item as any)[field] !== actualValue;
            case QueryOperator.GREATER_THAN:
              return (item as any)[field] > actualValue;
            case QueryOperator.GREATER_THAN_OR_EQUAL:
              return (item as any)[field] >= actualValue;
            case QueryOperator.LESS_THAN:
              return (item as any)[field] < actualValue;
            case QueryOperator.LESS_THAN_OR_EQUAL:
              return (item as any)[field] <= actualValue;
            case QueryOperator.IN:
              return (actualValue as any[]).includes((item as any)[field]);
            case QueryOperator.NOT_IN:
              return !(actualValue as any[]).includes((item as any)[field]);
            case QueryOperator.CONTAINS:
              return (item as any)[field].includes(actualValue);
            case QueryOperator.DOES_NOT_CONTAIN:
              return !(item as any)[field].includes(actualValue);
            case QueryOperator.IS_NULL:
              return (item as any)[field] === null;
            case QueryOperator.IS_NOT_NULL:
              return (item as any)[field] !== null;
            default:
              return false;
          }
        }),
      );
    } else {
      // set the query result equal to the current query result plus where function returns true
      this.queryResult = this.queryResult.concat(
        this.repository.data.filter((item) => {
          return field(item);
        }),
      );
    }

    // filter out duplicates
    this.queryResult = this.filterDuplicates(this.queryResult);

    return this;
  }

  // return the query result
  get(): T[] {
    return this.queryResult;
  }

  // return the first item in the query result
  first(): T | null {
    return this.queryResult.length > 0 ? this.queryResult[0] : null;
  }

  // return the last item in the query result
  last(): T | null {
    return this.queryResult.length > 0 ? this.queryResult[this.queryResult.length - 1] : null;
  }

  update(data: object): T | T[] | null {
    // update the query result by the given data
    this.queryResult.forEach((item) => {
      (item as any).beforeUpdate(data);

      Object.assign(item as any, data);

      (item as any).afterUpdate(item);
    });

    return this.queryResult;
  }

  // delete the query result from the repository by mapping the id's to the repositories delete method
  delete(): void {
    this.repository.delete(this.queryResult.map((item) => (item as any).id));
  }

  // return whether a query result exists
  exists(): boolean {
    return this.queryResult.length > 0;
  }

  // return the count of the query result
  count(): number {
    return this.queryResult.length;
  }

  // filter out duplicates by id and return the result
  filterDuplicates(items: T[]): T[] {
    return items.filter((v, i, a) => a.findIndex((v2) => (v2 as any).id === (v as any).id) === i);
  }
}
