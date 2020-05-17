import { Sequelize, Model } from 'sequelize';
import { GroupEntity } from './group.entity';
import { Group, NotFoundError } from '../../models';
import { PersonDao, PermissionDao, GroupDao } from '..';

class GroupDaoImpl implements GroupDao {
  private readonly groupEntity: typeof Model;
  private readonly permissionDao: PermissionDao;
  private readonly personDao: PersonDao;
  private readonly sequilize: Sequelize;

  constructor(sequilize: Sequelize, personDao: PersonDao, permissionDao: PermissionDao) {
    this.sequilize = sequilize;
    this.permissionDao = permissionDao;
    this.personDao = personDao;
    this.groupEntity = GroupEntity(sequilize, personDao.getModel(), permissionDao.getModel());
  }

  getById(id: string): Promise<Group> {
    return this.groupEntity.findByPk(id, {
      include: [this.permissionDao.getModel(), this.personDao.getModel()],
    });
  }
  getAll(): Promise<Group[]> {
    return this.groupEntity.findAll({
      include: [this.permissionDao.getModel(), this.personDao.getModel()],
    });
  }
  create(group: Group): Promise<void> {
    return this.sequilize.transaction(() => {
      return Promise.all([
        this.groupEntity.create(group),
        this.permissionDao.getAllByName(group.permissions),
      ]).then(([group, permissions]) => {
        group.setPermissions(permissions.map((permission) => permission.id));
        return group;
      });
    });
  }
  update(group: Group): Promise<void> {
    return this.sequilize.transaction(() => {
      return Promise.all([
        this.groupEntity.update(group, { where: { id: group.id }, returning: true }),
        this.permissionDao.getAllByName(group.permissions),
      ]).then(([group, permissions]) => {
        group[1][0].setPermissions(permissions.map((permission) => permission.id));
      });
    });
  }
  delete(id: string): Promise<void> {
    return this.groupEntity.destroy({ where: { id } });
  }
  getModel(): typeof Model {
    return this.groupEntity;
  }

  private processNullableEntity(result: Model | null): Model {
    if (!result) {
      throw new NotFoundError(`Group entity was not found`);
    }
    return result;
  }
}

export { GroupDaoImpl };
