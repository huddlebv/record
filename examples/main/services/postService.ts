import Api from "../../../src/orm/api";

export default class PostService<T> extends Api<T> {
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
