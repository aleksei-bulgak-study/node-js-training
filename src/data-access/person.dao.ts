import { Sequelize, Model, Op } from 'sequelize';
import { Person } from '../models';
import PersonDao from './person.interface';
import { PersonEntity } from './person.model';

export class PersonDaoImpl implements PersonDao {
  private dao: typeof Model;

  constructor(sequelize: Sequelize) {
    this.dao = PersonEntity(sequelize);
  }

  async getById(id: string): Promise<Person> {
    return this.dao.findByPk(id);
  }

  async create(person: Person): Promise<void> {
    await this.dao.create(person);
  }

  async update(person: Person): Promise<void> {
    await this.dao.update(person, { where: { id: person.id } });
  }

  async find(login: string, limit: number): Promise<Person[]> {
    return this.dao.findAll({ where: { login: { [Op.like]: `%${login}%` } }, limit });
  }

  async findByLogin(login: string): Promise<Person> {
    return this.dao.findOne({ where: { login } });
  }
}
