import { Op } from 'sequelize';
import { Person } from '../../models';
import PersonDao from './personDao.interface';
import { PersonEntity } from './person.entity';

class PersonDaoImpl implements PersonDao {
  findAll(userIds: string[]): Promise<Person[]> {
    return PersonEntity.findAll({ where: { id: userIds } });
  }

  getById(id: string): Promise<Person> {
    return PersonEntity.findByPk(id);
  }

  create(person: Person): Promise<void> {
    return PersonEntity.create(person);
  }

  update(person: Person): Promise<void> {
    return PersonEntity.update(person, { where: { id: person.id } });
  }

  find(login: string, limit: number): Promise<Person[]> {
    return PersonEntity.findAll({ where: { login: { [Op.like]: `%${login}%` } }, limit });
  }

  findByLogin(login: string): Promise<Person> {
    return PersonEntity.findOne({ where: { login } });
  }
}

export { PersonDaoImpl };
