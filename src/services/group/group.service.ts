import GroupService from './group.interface';
import { Group, InternalError, ErrorType, NotFoundError, Person } from '../../models';
import { GroupDao } from '../../data-access';
import { PersonService } from '../person';
import { GroupEntityModel } from '../../data-access/group/group.entity';
import { PermissionEntityModel } from '../../data-access/permission/permission.entity';

const convertGroupFromEntity = (group: GroupEntityModel): Group => {
  if (group) {
    return {
      id: group.id,
      name: group.name,
      permissions: group.permissions.map((permission: PermissionEntityModel) => permission.value),
    };
  }
  return group;
};

const convertArrayOfGroupFromEntity = (groups: Array<GroupEntityModel>): Group[] => {
  if (groups) {
    return groups.map(convertGroupFromEntity);
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
      .then((person) => {
        if (!person) {
          throw new NotFoundError(`Group with id ${id} was not found`);
        }
        return person;
      })
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

  updateUserGroupAssociation(groupId: string, users: Array<string>): Promise<GroupEntityModel> {
    return Promise.all([this.groupDao.getById(groupId), this.personService.getUsers(users)]).then(
      ([group, foundUsers]) => {
        if (!group) {
          throw new InternalError(`Group with id ${groupId} was not found`, ErrorType.BAD_REQUEST);
        }
        const userIds = foundUsers ? foundUsers.map((user: Person) => user.id) : [];
        group.setUsers(userIds);
        return group;
      }
    );
  }
}
