import { Person } from '../../models';

export default interface PersonService {
  getUsers(users: string[]): Promise<Person[]>;
  getById(id: string): Promise<Person>;
  create(user: Person): Promise<Person>;
  update(person: Person): Promise<Person>;
  delete(id: string): Promise<Person>;
  getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<Person[]>;
  getByLogin(login: string): Promise<Person>;
}
