import { Person } from '../../models';
import { Model } from 'sequelize';

export default interface PersonDao {
  getById(id: string): Promise<Person>;
  create(person: Person): Promise<void>;
  update(person: Person): Promise<void>;
  find(login: string, limit: number): Promise<Person[]>;
  findByLogin(login: string): Promise<Person>;
  findAll(userIds: Array<string>): Promise<Person[]>;

  getModel(): typeof Model;
}
