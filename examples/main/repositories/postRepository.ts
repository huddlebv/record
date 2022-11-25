import Repository from "../../../src/orm/repository.js";
import Post from "../models/post.js";

export default class PostRepository<T extends Post> extends Repository<T> {

}
