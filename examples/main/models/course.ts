import Model from "../../../src/orm/model";
import CourseRepository from "../repositories/courseRepository";
import CourseService from "../services/courseService";

export default class Course extends Model {
    constructor(map: CourseInterface) {
        super(Course);

        this.id = map["id"];
        this.name = map["name"];
        this.slug = map["slug"];
        this.description = map["description"];
        this.author_id = map["author_id"];
        this.certificate_id = map["certificate_id"];
    }

    // @ts-ignore
    static store: CourseRepository<Course> = new CourseRepository<Course>(this);

    static api: CourseService<Course> = new CourseService<Course>(this.store);
}

interface CourseInterface {
    id?: number;
    name?: string;
    slug?: string;
    description?: string;
    certificate_id?: number | null;
    author_id?: number | null;
}

export default interface Course extends CourseInterface {}
