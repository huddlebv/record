import Model from "../../../src/orm/model.js";
import PostRepository from "../repositories/postRepository.js";
import PostService from "../services/postService.js";
import Hobby from "./hobby.js";
import User from "./user";
import type LikeInterface from "../interfaces/likeInterface";

enum PostType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
}

export default class Post extends Model {
  propTypes = {
    hobbies: Hobby,
    // user: User,
  };

  title: string | null;
  someVar: number;
  // hobbies: Hobby[] = [];
  user?: User | null;
  likes?: LikeInterface[] | null;
  type: PostType = PostType.TEXT;
  likedNames: string[] = [];

  constructor(map: any) {
    super(Post, map);

    this.id = map["id"];
    this.title = map["title"];
    this.someVar = map["someVar"] ?? 10;
    this.hobbies = map["hobbies"];
    // this.hobbies = map["hobbies"] ? map["hobbies"].map((hobby: any) => new Hobby(hobby)) : [];
    this.user = map["user"] ? new User(map["user"]) : null;
    this.likes = map["likes"] ?? [];
    this.type = map["type"] ?? PostType.TEXT;
    this.likedNames = map["likedNames"] ?? [];
  }

  static store: PostRepository<Post> = new PostRepository<Post>(this);

  static api: PostService<Post> = new PostService<Post>(this, this.store, {
    route: 'posts',
  });

  get hobbies(): Hobby[] | null {
    return this.hasMany<Hobby>(Hobby, "postId");
  }

  set hobbies(value: any) {
    this.setupRelation<Hobby>(Hobby, value, "postId");
  }

  declare id: number;
}
