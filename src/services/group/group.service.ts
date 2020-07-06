import { v4 as uuidv4 } from 'uuid';
import GroupService from './group.interface';
import { Group, InternalError, ErrorType, NotFoundError, Person } from '../../models';
import { GroupDao } from '../../data-access';
import { PersonService } from '../person';
import { GroupEntityModel } from '../../data-access/group/group.entity';
import { PermissionEntityModel } from '../../data-access/permission/permission.entity';
import { PersonModel } from '../../data-access/person/person.entity';

const convertGroupFromEntity = (group: GroupEntityModel): Group => {
  if (group) {
    return {
      id: group.id,
      name: group.name,
      permissions: group.permissions.map((permission: PermissionEntityModel) => permission.value),
      users: group.users.map((user: PersonModel) => user.login),
    };
  }
  return group;
};

const convertArrayOfGroupFromEntity = (groups: Array<GroupEntityModel>): Group[] => {
  if (groups) {
    return groups.map((group) => convertGroupFromEntity(group));
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

  async getById(id: string): Promise<Group> {
    try {
      const groupEntity = await this.groupDao.getById(id);
      return convertGroupFromEntity(groupEntity);
    } catch {
      throw new NotFoundError(`Group with id ${id} was not found`);
    }
  }
  async create(group: Group): Promise<Group> {
    if(!group.id) {
      group.id = uuidv4().toString();
    }
    const groupEntity = await this.groupDao.create(group);
    return convertGroupFromEntity(groupEntity);
  }

  async update(group: Group): Promise<Group> {
    await this.groupDao.update(group);
    return this.getById(group.id);
  }
  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.groupDao.delete(id);
  }
  async getAll(): Promise<Group[]> {
    try {
      const groups = await this.groupDao.getAll();
      return convertArrayOfGroupFromEntity(groups);
    } catch {
      throw new InternalError('Failed to retrieve groups', ErrorType.INTERNAL);
    }
  }

  async updateUserGroupAssociation(
    groupId: string,
    users: Array<string>
  ): Promise<GroupEntityModel> {
    const userModels = await this.personService.getUsers(users);
    let userIds = userModels ? userModels.map((user: Person) => user.id) : [];

    const group = await this.getById(groupId);
    const usersAlreadyInGroup = group.users;
    if(usersAlreadyInGroup) {
      userIds = userIds.filter(userId => usersAlreadyInGroup.indexOf(userId) === -1)
    }

    return this.groupDao.addUsersInGroup(groupId, userIds);
  }
}
