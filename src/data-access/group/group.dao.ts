import { Model } from 'sequelize';
import { Group } from '../../models';
import { sequelize } from '../../configs';
import { PersonEntity, PermissionEntity, GroupEntity, GroupDao, PermissionDao } from '..';
import { PermissionEntityModel } from '../permission/permission.entity';

class GroupDaoImpl implements GroupDao {
  private readonly permissionDao: PermissionDao;

  constructor(permissionDao: PermissionDao) {
    this.permissionDao = permissionDao;
  }

  getById(id: string): Promise<Group> {
    return GroupEntity.findByPk(id, {
      include: [PermissionEntity, PersonEntity],
    });
  }
  getAll(): Promise<Group[]> {
    return GroupEntity.findAll({
      include: [PermissionEntity, PersonEntity],
    });
  }
  create(group: Group): Promise<void> {
    return sequelize.transaction(() => {
      return Promise.all([
        GroupEntity.create(group),
        this.permissionDao.getAllByName(group.permissions),
      ]).then(([group, permissions]) => {
        group.setPermissions(permissions.map((permission: PermissionEntityModel) => permission.id));
        return group;
      });
    });
  }
  update(group: Group): Promise<void> {
    return sequelize.transaction(() => {
      return Promise.all([
        GroupEntity.update(group, { where: { id: group.id }, returning: true }),
        this.permissionDao.getAllByName(group.permissions),
      ]).then(([group, permissions]) => {
        group[1][0].setPermissions(
          permissions.map((permission: PermissionEntityModel) => permission.id)
        );
      });
    });
  }
  delete(id: string): Promise<void> {
    return GroupEntity.destroy({ where: { id } });
  }
  getModel(): typeof Model {
    return GroupEntity;
  }
}

export { GroupDaoImpl };
