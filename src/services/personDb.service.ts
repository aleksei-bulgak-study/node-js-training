import { v4 as uuidv4 } from 'uuid';
import PersonService from './person.interface';
import { Person, InternalError, ErrorType } from '../models';
import PersonDao from '../data-access/person.interface';

export default class PersonDBService implements PersonService {
  private readonly dao: PersonDao;

  constructor(dao: PersonDao) {
    this.dao = dao;
  }

  async getById(id: string): Promise<Person> {
    if (id) {
      try {
        const result = await this.dao.getById(id);
        if (!result) {
          throw new InternalError(`Failed to obtain user with id ${id}`, ErrorType.INTERNAL);
        }
        return result;
      } catch (err) {
        console.error('Failed to obtain person due to error');
        throw new InternalError(`Failed to obtain user with id ${id}`, ErrorType.INTERNAL);
      }
    }
    throw new InternalError('Invalid id was specified', ErrorType.NOT_FOUND);
  }

  async create(user: Person): Promise<Person> {
    if (await this.checkUserValid(user)) {
      user.id = uuidv4().toString();
      user.isDeleted = false;
      await this.dao.create(user);
      return Promise.resolve(user);
    }
    throw new InternalError('Invalid user was specified', ErrorType.BAD_REQUEST);
  }

  async update(person: Person): Promise<Person> {
    const currentPerson = await this.getById(person.id);
    if (person.login && currentPerson.login !== person.login) {
      await this.checkUserValid(person);
    }
    await this.dao.update(person);
    return Promise.resolve(person);
  }

  async delete(id: string): Promise<Person> {
    const person = await this.getById(id);

    try {
      person.isDeleted = true;
      return this.update(person);
    } catch (err) {
      throw new InternalError(`Person with id ${id} was not found`, ErrorType.BAD_REQUEST);
    }
  }

  async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<Person[]> {
    return this.dao.find(loginSubstring, limit);
  }

  private async checkUserValid(user: Person): Promise<boolean> {
    if (!user || !user.login || !user.password) {
      throw new InternalError('User login or password is invalid', ErrorType.BAD_REQUEST);
    }

    try {
      const results = await this.dao.findByLogin(user.login);
      if (results) {
        throw new InternalError(
          `User with login ${user.login} has already exist`,
          ErrorType.BAD_REQUEST
        );
      }
    } catch (err) {
      if (err instanceof InternalError) {
        throw err;
      }
    }

    return Promise.resolve(true);
  }
}
