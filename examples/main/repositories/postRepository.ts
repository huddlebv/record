import Repository from "../../../src/orm/repository";
import Post from "../models/post";

export default class PostRepository<T extends Post> extends Repository<T> {

}
