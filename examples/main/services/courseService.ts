import Api from "../../../lib/src/orm/api";

export default class CourseService<T> extends Api<T> {
  getCourses() {
    return new Promise((resolve, reject) => {
      this.get("courses")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
