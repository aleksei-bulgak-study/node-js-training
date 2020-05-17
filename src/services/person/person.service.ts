/* eslint no-sync: "off" */
import { Person, ErrorType, InternalError } from '../../models';
import { v4 as uuidv4 } from 'uuid';
import PersonService from './person.interface';

class PersonInMemoryService implements PersonService {
  private people: Array<Person>;

  constructor() {
    this.people = new Array<Person>();
  }

  getUsers(users: string[]): Promise<Person[]> {
    return Promise.resolve(this.people.filter((user) => users.indexOf(user.id)));
  }

  getById(id: string): Promise<Person> {
    return Promise.resolve(this.getByIdSync(id));
  }
  getByIdSync(id: string): Person {
    if (id) {
      const results = this.people.filter((person) => person.id === id);
      if (!results || results.length === 0) {
        throw new InternalError(`User with specified id ${id} was not found`, ErrorType.NOT_FOUND);
      }
      if (results && results.length === 1) {
        return results[0];
      }
    }
    throw new InternalError('Invalid id was specified', ErrorType.NOT_FOUND);
  }

  create(user: Person): Promise<Person> {
    if (this.isUserValid(user)) {
      user.id = uuidv4().toString();
      user.isDeleted = false;
      this.people.push(user);
      return Promise.resolve(user);
    }
    throw new InternalError('Invalid user was specified', ErrorType.BAD_REQUEST);
  }

  getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<Person[]> {
    return Promise.resolve(
      this.people
        .filter(({ login }) => login.match(`.*${loginSubstring}.*`))
        .sort((first, second) => (first.login > second.login ? 1 : -1))
        .slice(0, limit ? limit : undefined)
    );
  }

  delete(id: string): Promise<Person> {
    const person = this.people.find((user) => user.id === id);
    if (person) {
      person.isDeleted = true;
      return Promise.resolve(person);
    }
    throw new InternalError(`Person with id ${id} was not found`, ErrorType.BAD_REQUEST);
  }

  update(person: Person): Promise<Person> {
    const currentPerson = this.getByIdSync(person.id);
    if (person.login && currentPerson.login !== person.login) {
      this.isUserValid(person);
    }
    currentPerson.login = person.login ? person.login : currentPerson.login;
    currentPerson.password = person.password ? person.password : currentPerson.password;
    currentPerson.isDeleted = person.isDeleted ? person.isDeleted : currentPerson.isDeleted;
    currentPerson.age = person.age ? person.age : currentPerson.age;
    return Promise.resolve(currentPerson);
  }

  private isUserValid(user: Person): boolean {
    if (!user || !user.login || !user.password) {
      throw new InternalError('User login or password is invalid', ErrorType.BAD_REQUEST);
    }

    if (this.getByLogin(user.login)) {
      throw new InternalError(
        `User with login ${user.login} has already exist`,
        ErrorType.BAD_REQUEST
      );
    }

    return true;
  }

  private getByLogin(value: string): Person {
    return this.people.filter(({ login }) => login === value)[0];
  }
}

export default PersonInMemoryService;
