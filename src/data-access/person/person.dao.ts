import { Sequelize, Model, Op } from 'sequelize';
import { Person } from '../../models';
import PersonDao from './personDao.interface';
import { PersonEntity } from './person.entity';

class PersonDaoImpl implements PersonDao {
  private dao: typeof Model;

  constructor(sequelize: Sequelize) {
    this.dao = PersonEntity(sequelize);
  }

  findAll(userIds: string[]): Promise<Person[]> {
    return this.dao.findAll({ where: { id: userIds } });
  }

  getModel(): typeof Model {
    return this.dao;
  }

  getById(id: string): Promise<Person> {
    return this.dao.findByPk(id).then();
  }

  create(person: Person): Promise<void> {
    return this.dao.create(person);
  }

  update(person: Person): Promise<void> {
    return this.dao.update(person, { where: { id: person.id } });
  }

  find(login: string, limit: number): Promise<Person[]> {
    return this.dao.findAll({ where: { login: { [Op.like]: `%${login}%` } }, limit });
  }

  findByLogin(login: string): Promise<Person> {
    return this.dao.findOne({ where: { login } });
  }
}

export { PersonDaoImpl };
