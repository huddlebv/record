import Api from "../../../src/orm/api";
import Post from "../models/post";

export default class PostService<T extends Post> extends Api<T> {
  getPosts() {
    return new Promise((resolve, reject) => {
      this.get("posts", {
        source: null,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getPost() {
    return new Promise((resolve, reject) => {
      this.get("posts/3", {
        source: null,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
