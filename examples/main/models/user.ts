export default class User {
  declare id: number;
  declare name: string;
  declare postId: number;

  constructor(map: any) {
    this.id = map["id"];
    this.name = map["name"];
    this.postId = map["postId"];
  }

  get upperName(): string {
    return this.name.toUpperCase();
  }
}