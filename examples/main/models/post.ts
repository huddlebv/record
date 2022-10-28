import Model from "../../../src/orm/model";
import PostRepository from "../repositories/postRepository";
import PostService from "../services/postService";

export default class Post extends Model {
    _title: string = "";

    constructor(map: any) {
        super(Post);

        this.id = map["id"];
        this.title = map["title"];
    }

    static store: PostRepository<Post> = new PostRepository<Post>(this);

    static api: PostService<Post> = new PostService<Post>(this.store);

    // set title to uppercase
    set title(value: string) {
        this._title = value.toUpperCase();
    }

    // get title
    get title(): string {
        return this._title;
    }

    declare id: number;
}
