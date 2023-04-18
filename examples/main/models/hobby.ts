import Model from "../../../src/orm/model.js";
import HobbyRepository from "../repositories/hobbyRepository.js";
import HobbyService from "../services/hobbyService.js";

export default class Hobby extends Model {
  constructor(map: any) {
    super(Hobby, map);

    this.id = map["id"];
    this.postId = map["postId"];
    this.name = map["name"];
  }

  static store: HobbyRepository<Hobby> = new HobbyRepository<Hobby>(this);

  static api: HobbyService<Hobby> = new HobbyService<Hobby>(this, this.store, {
    route: 'hobbies',
  });

  get testy(): string {
    return "testy";
  }

  declare id: number;
  declare postId: number;
  declare name: string;
}
