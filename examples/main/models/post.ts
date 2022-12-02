import Model from "../../../src/orm/model.js";
import PostRepository from "../repositories/postRepository.js";
import PostService from "../services/postService.js";
import Hobby from "./hobby.js";

export default class Post extends Model {
  _title: string = "";

  constructor(map: any) {
    super(Post, map);

    this.id = map["id"];
    this.title = map["title"];

    this.setupRelation<Hobby>(Hobby, map["hobbies"]);
  }

  static store: PostRepository<Post> = new PostRepository<Post>(this);

  static api: PostService<Post> = new PostService<Post>(this, this.store, {
    route: 'posts',
  });

  get hobbies(): Hobby[] | null {
    return this.hasMany<Hobby>(Hobby, "postId");
  }

  // set title to uppercase
  set title(value: string | null) {
    this._title = value ? value.toUpperCase() : '';
  }

  // get title
  get title(): string {
    return this._title;
  }

  declare id: number;
}
