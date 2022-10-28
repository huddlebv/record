import type Repository from "./repository";

export default class Model {
  id: number = -Math.floor(Math.random());

  constructor(public model?: any) {}

  save?(): void {
    // this could call the save() method on the api, allowing for direct calling of save() on an instance of a model
    // instead of having to use the model class
    return this.model.api.save();
  }

  setupRelation<T>(model: any, data: any) {
    if (data) {
      (model.store as Repository<T>).transform(data, true, true);
    }
  }

  belongsTo<T>(model: any, id: number | null | undefined): T | null {
    return id ? (model.store as Repository<T>).find(id) : null;
  }

  hasMany<T>(model: any, key: string): T[] {
    return (model.store as Repository<T>).query.where(key, this.id).get();
  }

  has(key: string): boolean {
    const field = (this as any)[key];

    return typeof field !== "undefined" && typeof field !== null;
  }
}
