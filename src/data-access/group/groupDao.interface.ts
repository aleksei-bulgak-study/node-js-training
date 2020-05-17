import { Group } from '../../models';

export default interface GroupDao {
  getById(id: string): Promise<Group>;
  getAll(): Promise<Group[]>;
  create(group: Group): Promise<void>;
  update(group: Group): Promise<void>;
  delete(id: string): Promise<void>;
}
