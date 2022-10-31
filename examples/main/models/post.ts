import Model from "../../../src/orm/model";
import PostRepository from "../repositories/postRepository";
import PostService from "../services/postService";

export default class Post extends Model {
  _title: string = "";

  constructor(map: any) {
    super(Post, map);

    this.id = map["id"];
    this.title = map["title"];
  }

  static store: PostRepository<Post> = new PostRepository<Post>(this);

  static api: PostService<Post> = new PostService<Post>(this.store);

  // set title to uppercase
  set title(value: string | null) {
    this._title = value ? value.toUpperCase() : '';
  }

  // get title
  get title(): string {
    return this._title;
  }

  beforeUpdate(map: any) {
    console.log('befu');
  }

  afterUpdate(instance: Post) {
    console.log('aftu');
  }

  declare id: number;
}
