import { PermissionEntityModel } from './permission.entity';

export default interface PermissionDao {
  getById(id: number): Promise<PermissionEntityModel>;
  getByName(name: string): Promise<PermissionEntityModel>;
  getAllByName(name: string[]): Promise<PermissionEntityModel[]>;
}
