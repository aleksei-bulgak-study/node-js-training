import { Permission } from '../../models';
import { Model } from 'sequelize';

export default interface PermissionDao {
  getById(id: number): Promise<Permission>;
  getByName(name: string): Promise<Permission>;
  getAllByName(name: string[]): Promise<Permission[]>;
  getModel(): typeof Model;
}
