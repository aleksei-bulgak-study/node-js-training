import { Op } from 'sequelize';
import { Person } from '../../models';
import PersonDao from './personDao.interface';
import { PersonEntity, PersonModel } from './person.entity';

class PersonDaoImpl implements PersonDao {
  findAll(userIds: string[]): Promise<PersonModel[]> {
    return PersonEntity.findAll({ where: { id: userIds } });
  }

  getById(id: string): Promise<PersonModel> {
    return PersonEntity.findByPk(id);
  }

  create(person: Person): Promise<void> {
    return PersonEntity.create(person);
  }

  update(person: Person): Promise<void> {
    return PersonEntity.update(person, { where: { id: person.id } });
  }

  find(login: string, limit: number): Promise<PersonModel[]> {
    return PersonEntity.findAll({ where: { login: { [Op.like]: `%${login}%` } }, limit });
  }

  findByLogin(login: string): Promise<PersonModel> {
    return PersonEntity.findOne({ where: { login } });
  }
}

export { PersonDaoImpl };
