import Model from "../../../src/orm/model";
import PostRepository from "../repositories/postRepository";
import PostService from "../services/postService";

export default class Post extends Model {
    constructor(map: PostInterface) {
        super(Post);

        this.id = map["id"];
        this.title = map["title"];
    }

    // @ts-ignore
    static store: PostRepository<Post> = new PostRepository<Post>(this);

    static api: PostService<Post> = new PostService<Post>(this.store);
}

interface PostInterface {
    id: number;
    title?: string;
}

export default interface Post extends PostInterface {}
