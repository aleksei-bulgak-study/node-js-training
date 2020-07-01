import { Group, NotFoundError } from '../../models';
import { sequelize } from '../../configs';
import { PersonEntity } from '../person';
import { PermissionEntity, PermissionDao } from '../permission';
import { GroupEntity, GroupEntityModel } from './group.entity';
import GroupDao from './groupDao.interface';
import { PermissionEntityModel } from '../permission/permission.entity';

const processNullableEntity = (result: GroupEntityModel | null): GroupEntityModel => {
  if (!result) {
    throw new NotFoundError(`Group entity was not found`);
  }
  return result;
};

class GroupDaoImpl implements GroupDao {
  private readonly permissionDao: PermissionDao;

  constructor(permissionDao: PermissionDao) {
    this.permissionDao = permissionDao;
  }

  async getById(id: string): Promise<GroupEntityModel> {
    const group = await GroupEntity.findByPk(id, {
      include: [PermissionEntity, PersonEntity],
    });
    return processNullableEntity(group);
  }
  getAll(): Promise<GroupEntityModel[]> {
    return GroupEntity.findAll({
      include: [PermissionEntity, PersonEntity],
    });
  }
  create(group: Group): Promise<GroupEntityModel> {
    return sequelize.transaction(async () => {
      const groupModel = await GroupEntity.create(group);
      const permissions = await this.permissionDao.getAllByName(group.permissions);
      await groupModel.setPermissions(
        permissions.map((permission: PermissionEntityModel) => permission.id)
      );
      return this.getById(groupModel.id);
    });
  }
  update(group: Group): Promise<void> {
    return sequelize.transaction(async () => {
      const groupModel = await GroupEntity.update(group, {
        where: { id: group.id },
        returning: true,
      });
      const permissions = await this.permissionDao.getAllByName(group.permissions);
      await groupModel[1][0].setPermissions(
        permissions.map((permission: PermissionEntityModel) => permission.id)
      );
    });
  }

  delete(id: string): Promise<void> {
    return GroupEntity.destroy({ where: { id } });
  }

  async addUsersInGroup(groupId: string, users: string[]): Promise<GroupEntityModel> {
    const groupModel = await this.getById(groupId);

    await groupModel.addUsers(users);
    return this.getById(groupId);
  }
}

export { GroupDaoImpl };
