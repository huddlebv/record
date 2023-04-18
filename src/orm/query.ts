import type Repository from './repository.js';
import QueryOperator from '../../src/orm/enums/queryOperator.js';

export default class Query<T> {
  private queryResult: T[] = [];

  constructor(private repository: Repository<T>, private key: string) {
    this.setup();
  }

  private setup() {
    if (!this.repository.datasetExists(this.key)) {
      this.queryResult = [];
    } else {
      this.queryResult = this.repository.data[this.key];
    }
  }

  // filter the query result by function or key value pair with optional operator
  where(field: string | Function, operator?: QueryOperator | any, value?: any): Query<T> {
    if (typeof field === 'string') {
      // operator can be an actual operator or the value, depending on if a operator is provided
      // if no operator is provided, the operator is assumed to be QueryOperator.Equal
      const actualValue = typeof value === 'undefined' ? operator : value;
      const actualOperator = typeof value === 'undefined' ? QueryOperator.EQUAL : operator;

      // set the query result equal to the current query result plus where the field is equal to the value
      this.queryResult = this.queryResult.filter(function (item) {
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
      });
    } else {
      // return value of the filter might be false, in case the query is being extended
      let hasReturnValues = true;

      // set the query result equal to the current query result plus where function returns true
      const filteredResult = this.queryResult.filter((item) => {
        // call the function with the item and the query as parameters
        const filteredItemResult = field(item, this);

        // if we don't have a return value, the query is being extended
        if (typeof filteredItemResult === 'undefined') {
          hasReturnValues = false;
        }

        return field(item, this);
      });

      // if we have return values, we can set the query result to the filtered result
      // otherwise, we can't set the query result to the filtered result, because the query is being extended
      if (hasReturnValues) {
        this.queryResult = filteredResult;
      }
    }

    // filter out duplicates
    this.queryResult = this.filterDuplicates(this.queryResult);

    return this;
  }

  // or where the query result
  orWhere(field: string | Function, operator?: QueryOperator | any, value?: any): Query<T> {
    // get the current query result
    const currentQueryResult = this.queryResult;

    // temporarily reset query results to the repository data so that we can filter through all items
    this.setup();

    // get the new query result
    const newQueryResult = this.where(field, operator, value).get();

    // set the query result equal to the current query result plus the new query result
    const concattedQueryResult = currentQueryResult.concat(newQueryResult);

    // filter out duplicates
    this.queryResult = this.filterDuplicates(concattedQueryResult);

    return this;
  }

  // return the query result
  get(): T[] {
    return this.queryResult;
  }

  // return the first item in the query result
  first(amount: number = 1): T | null {
    if (this.queryResult.length === 0) {
      return null;
    }

    return this.queryResult[0];
  }

  // return the last item in the query result
  last(amount: number = 1): T | null {
    if (this.queryResult.length === 0) {
      return null;
    }

    return this.queryResult[this.queryResult.length - 1];
  }

  // only grab the first x items in the query result
  limit(amount: number = 1): Query<T> {
    this.queryResult = this.queryResult.slice(0, amount);

    return this;
  }

  update(data: object): T | T[] | null {
    // update the query result by the given data
    this.queryResult.forEach((item) => {
      (item as any).beforeUpdate(data);

      this.repository.deepUpdate(item, data);

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

  // order by the given field and direction
  orderBy(field: string | Function, direction: 'asc' | 'desc' = 'asc'): Query<T> {
    // if the field is a function, we can't sort the query result
    if (typeof field === 'string') {
      this.queryResult = this.queryResult.sort((a, b) => {
        if (direction === 'asc') {
          return (a as any)[field] > (b as any)[field] ? 1 : -1;
        } else {
          return (a as any)[field] < (b as any)[field] ? 1 : -1;
        }
      });
    } else {
      this.queryResult = this.queryResult.sort((a, b) => {
        if (direction === 'asc') {
          return field(a) > field(b) ? 1 : -1;
        } else {
          return field(a) < field(b) ? 1 : -1;
        }
      });
    }

    return this;
  }
}
