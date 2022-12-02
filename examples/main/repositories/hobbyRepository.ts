import Repository from "../../../src/orm/repository.js";
import Hobby from "../models/hobby.js";

export default class HobbyRepository<T extends Hobby> extends Repository<T> {

}
