import { Op } from 'sequelize';
import { Person } from '../models';
import PersonDao from './person.interface';
import { PersonEntity } from './person.model';

export class PersonDaoImpl implements PersonDao {
  async getById(id: string): Promise<Person> {
    return PersonEntity.findByPk(id);
  }

  async create(person: Person): Promise<void> {
    await PersonEntity.create(person);
  }

  async update(person: Person): Promise<void> {
    await PersonEntity.update(person, { where: { id: person.id } });
  }

  async find(login: string, limit: number): Promise<Person[]> {
    return PersonEntity.findAll({ where: { login: { [Op.like]: `%${login}%` } }, limit });
  }

  async findByLogin(login: string): Promise<Person> {
    return PersonEntity.findOne({ where: { login } });
  }
}
