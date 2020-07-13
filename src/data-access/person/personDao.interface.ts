import { Person } from '../../models';
import { PersonModel } from './person.entity';

export default interface PersonDao {
  getById(id: string): Promise<PersonModel>;
  create(person: Person): Promise<void>;
  update(person: Person): Promise<void>;
  find(login: string, limit: number): Promise<PersonModel[]>;
  findByLogin(login: string): Promise<PersonModel>;
  findAll(userIds: Array<string>): Promise<PersonModel[]>;
}
