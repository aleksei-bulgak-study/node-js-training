import { Group } from '../../models';
import { GroupEntityModel } from '../../data-access/group/group.entity';

export default interface GroupService {
  getById(id: string): Promise<Group>;
  create(group: Group): Promise<Group>;
  update(group: Group): Promise<Group>;
  delete(id: string): Promise<void>;
  getAll(): Promise<Group[]>;
  updateUserGroupAssociation(groupId: string, users: Array<string>): Promise<GroupEntityModel>;
}
