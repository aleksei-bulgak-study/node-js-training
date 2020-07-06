import { v4 as uuidv4 } from 'uuid';
import PersonService from './person.interface';
import { Person, InternalError, ErrorType, NotFoundError } from '../../models';
import { PersonDao } from '../../data-access';
import { PersonModel } from '../../data-access/person/person.entity';

const convertPersonFromEntity = (personEntity: PersonModel): Person => {
  return {
    id: personEntity.id,
    login: personEntity.login,
    password: personEntity.password,
    age: personEntity.age,
    isDeleted: personEntity.isDeleted,
  };
};

export default class PersonDBService implements PersonService {
  private readonly dao: PersonDao;

  constructor(dao: PersonDao) {
    this.dao = dao;
  }
  async getUsers(userIds: string[]): Promise<Person[]> {
    const users = await this.dao.findAll(userIds);
    if (!users || users.length === 0) {
      throw new InternalError(`Users with ids ${userIds} were not found`, ErrorType.BAD_REQUEST);
    }

    const foundUserIds = users.map((user) => user.id);
    const notFoundUsers = userIds.filter((userId) => foundUserIds.indexOf(userId) === -1);
    if (!notFoundUsers) {
      throw new InternalError(
        `Users with ids ${notFoundUsers} were not found`,
        ErrorType.BAD_REQUEST
      );
    }

    return users;
  }

  async getById(id: string): Promise<Person> {
    if (id) {
      try {
        const personEntity = await this.dao.getById(id);
        if (!personEntity) {
          throw new NotFoundError(`Failed to obtain user with id ${id}`);
        }
        return convertPersonFromEntity(personEntity);
      } catch {
        throw new NotFoundError(`Failed to obtain user with id ${id}`);
      }
    }
    throw new InternalError('Invalid id was specified', ErrorType.NOT_FOUND);
  }

  async create(user: Person): Promise<Person> {
    try {
      await this.checkUserValid(user);
    } catch {
      throw new InternalError('Invalid user was specified', ErrorType.BAD_REQUEST);
    }

    user.id = uuidv4().toString();
    user.isDeleted = false;
    await this.dao.create(user);
    return this.getById(user.id);
  }

  async update(person: Person): Promise<Person> {
    const personEntity = await this.getById(person.id);
    if (person.login && personEntity.login !== person.login) {
      this.checkUserValid(person);
    } else {
      await this.dao.update(person);
    }
    return this.getById(person.id);
  }

  async delete(id: string): Promise<Person> {
    try {
      const personEntity = await this.getById(id);
      personEntity.isDeleted = true;
      return this.update(personEntity);
    } catch {
      throw new InternalError(`Person with id ${id} was not found`, ErrorType.BAD_REQUEST);
    }
  }

  getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<Person[]> {
    return this.dao.find(loginSubstring, limit);
  }

  private async checkUserValid(user: Person): Promise<void> {
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

    return;
  }
}
