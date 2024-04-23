import type Repository from './repository.js';

export default class Model {
  id: number = -Math.floor(Math.random());
  private _created: boolean = false;

  constructor(public model: any, map: any) {
    this.beforeCreate(map);

    setTimeout(() => {
      this._created = true;
      this.afterCreate(this);
    }, 0);
  }

  save?(): void {
    // this could call the save() method on the api, allowing for direct calling of save() on an instance of a model
    // instead of having to use the model class
    return this.model.api.save();
  }

  setupRelation<T>(model: any, data: any) {
    // , key: string
    if (data) {
      // delete all existing relations
      // (model.store as Repository<T>).query().where(key, this.id).delete();

      // add new relations
      (model.store as Repository<T>).transform(data, {
        save: true,
        replace: true,
        prepend: false,
      });
    }
  }

  belongsTo<T>(model: any, id: number | null | undefined): T | null {
    return id ? (model.store as Repository<T>).find(id) : null;
  }

  hasMany<T>(model: any, key: string): T[] {
    return (model.store as Repository<T>).query().where(key, this.id).get();
  }

  has(key: string): boolean {
    const field = (this as any)[key];

    return typeof field !== 'undefined' && typeof field !== null;
  }

  /*
   * TODO: before & after events should be cancellable, so logic for creating/updating should be handled here
   * instead of directly in the repository
   */
  beforeCreate(map: any) {
    //
  }

  afterCreate(instance: any) {
    //
  }

  beforeDelete() {
    //
  }

  afterDelete() {
    //
  }

  beforeUpdate(map: any) {
    //
  }

  afterUpdate(instance: any) {
    //
  }
}
