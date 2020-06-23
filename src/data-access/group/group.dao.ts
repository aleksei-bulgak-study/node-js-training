import { Group } from '../../models';
import { sequelize } from '../../configs';
import { PersonEntity } from '../person';
import { PermissionEntity, PermissionDao } from '../permission';
import { GroupEntity, GroupEntityModel } from './group.entity';
import GroupDao from './groupDao.interface';
import { PermissionEntityModel } from '../permission/permission.entity';

class GroupDaoImpl implements GroupDao {
  private readonly permissionDao: PermissionDao;

  constructor(permissionDao: PermissionDao) {
    this.permissionDao = permissionDao;
  }

  getById(id: string): Promise<GroupEntityModel> {
    return GroupEntity.findByPk(id, {
      include: [PermissionEntity, PersonEntity],
    });
  }
  getAll(): Promise<GroupEntityModel[]> {
    return GroupEntity.findAll({
      include: [PermissionEntity, PersonEntity],
    });
  }
  create(group: Group): Promise<GroupEntityModel> {
    return sequelize.transaction(() => {
      return Promise.all([
        GroupEntity.create(group),
        this.permissionDao.getAllByName(group.permissions),
      ]).then(([groupModel, permissions]) => {
        groupModel.setPermissions(
          permissions.map((permission: PermissionEntityModel) => permission.id)
        );
        return groupModel;
      });
    });
  }
  update(group: Group): Promise<void> {
    return sequelize.transaction(() => {
      return Promise.all([
        GroupEntity.update(group, { where: { id: group.id }, returning: true }),
        this.permissionDao.getAllByName(group.permissions),
      ]).then(([groupModel, permissions]) => {
        groupModel[1][0].setPermissions(
          permissions.map((permission: PermissionEntityModel) => permission.id)
        );
      });
    });
  }
  delete(id: string): Promise<void> {
    return GroupEntity.destroy({ where: { id } });
  }
}

export { GroupDaoImpl };
