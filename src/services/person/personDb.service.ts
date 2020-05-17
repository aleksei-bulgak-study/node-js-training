import { v4 as uuidv4 } from 'uuid';
import PersonService from './person.interface';
import { Person, InternalError, ErrorType, NotFoundError } from '../../models';
import { PersonDao } from '../../data-access';

export default class PersonDBService implements PersonService {
  private readonly dao: PersonDao;

  constructor(dao: PersonDao) {
    this.dao = dao;
  }
  getUsers(userIds: string[]): Promise<Person[]> {
    return this.dao.findAll(userIds).then((users: Person[]) => {
      if (!users || users.length == 0) {
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
    });
  }

  getById(id: string): Promise<Person> {
    if (id) {
      return this.dao
        .getById(id)
        .then((person) => {
          if (!person) {
            throw new NotFoundError(`Failed to obtain user with id ${id}`);
          }
          return person;
        })
        .catch(() => {
          throw new NotFoundError(`Failed to obtain user with id ${id}`);
        });
    }
    throw new InternalError('Invalid id was specified', ErrorType.NOT_FOUND);
  }

  create(user: Person): Promise<Person> {
    return this.checkUserValid(user)
      .catch(() => {
        throw new InternalError('Invalid user was specified', ErrorType.BAD_REQUEST);
      })
      .then(() => {
        user.id = uuidv4().toString();
        user.isDeleted = false;
        return this.dao.create(user);
      })
      .then(() => user);
  }

  update(person: Person): Promise<Person> {
    return this.getById(person.id)
      .then((currentPerson: Person) => {
        if (person.login && currentPerson.login !== person.login) {
          return this.checkUserValid(person);
        }
        return this.dao.update(person);
      })
      .then(() => person);
  }

  delete(id: string): Promise<Person> {
    return this.getById(id)
      .then((person) => {
        person.isDeleted = true;
        return this.update(person);
      })
      .catch(() => {
        throw new InternalError(`Person with id ${id} was not found`, ErrorType.BAD_REQUEST);
      });
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

    return Promise.resolve();
  }
}
