import { Group } from '../../models';
import { GroupEntityModel } from './group.entity';

export default interface GroupDao {
  getById(id: string): Promise<GroupEntityModel>;
  getAll(): Promise<GroupEntityModel[]>;
  create(group: Group): Promise<GroupEntityModel>;
  update(group: Group): Promise<void>;
  delete(id: string): Promise<void>;
  addUsersInGroup(groupId: string, users: string[]): Promise<GroupEntityModel>;
}
