import GroupService from './group.interface';
import { Group, InternalError, ErrorType, NotFoundError, Person } from '../../models';
import { GroupDao } from '../../data-access';
import { PersonService } from '../person';
import { GroupEntityModel } from '../../data-access/group/group.entity';
import { PermissionEntityModel } from '../../data-access/permission/permission.entity';

const convertGroupFromEntity = async (group: GroupEntityModel): Promise<Group> => {
  if (group) {
    console.log(group);
    return {
      id: group.id,
      name: group.name,
      permissions: group.permissions.map((permission: PermissionEntityModel) => permission.value),
    };
  }
  return group;
};

const convertArrayOfGroupFromEntity = async (groups: Array<GroupEntityModel>): Promise<Group[]> => {
  if (groups) {
    return Promise.all(groups.map((group) => convertGroupFromEntity(group)));
  }
  return groups;
};

export class GroupServiceImpl implements GroupService {
  private readonly groupDao: GroupDao;
  private readonly personService: PersonService;

  constructor(groupDao: GroupDao, personService: PersonService) {
    this.groupDao = groupDao;
    this.personService = personService;
  }

  getById(id: string): Promise<Group> {
    return this.groupDao
      .getById(id)
      .then(convertGroupFromEntity)
      .catch(() => {
        throw new NotFoundError(`Group with id ${id} was not found`);
      });
  }
  create(group: Group): Promise<Group> {
    return this.groupDao.create(group).then(convertGroupFromEntity);
  }
  update(group: Group): Promise<Group> {
    return this.groupDao.update(group).then(() => group);
  }
  delete(id: string): Promise<void> {
    return this.getById(id).then(() => this.groupDao.delete(id));
  }
  getAll(): Promise<Group[]> {
    return this.groupDao
      .getAll()
      .then(convertArrayOfGroupFromEntity)
      .catch(() => {
        throw new InternalError('Failed to retrieve groups', ErrorType.INTERNAL);
      });
  }

  async updateUserGroupAssociation(
    groupId: string,
    users: Array<string>
  ): Promise<GroupEntityModel> {
    const userModels = await this.personService.getUsers(users);

    const userIds = userModels ? userModels.map((user: Person) => user.id) : [];
    return this.groupDao.addUsersInGroup(groupId, userIds);
  }
}
