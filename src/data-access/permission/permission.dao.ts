import { PermissionEntity, PermissionEntityModel } from './permission.entity';
import { NotFoundError } from '../../models';
import PermissionDao from './permissionDao.interface';

const processNullableEntity = (result: PermissionEntityModel | null): PermissionEntityModel => {
  if (!result) {
    throw new NotFoundError(`Permission entity was not found`);
  }
  return result;
};

export class PermissionDaoImpl implements PermissionDao {
  async getById(id: number): Promise<PermissionEntityModel> {
    const permission = PermissionEntity.findByPk(id);
    return processNullableEntity(permission);
  }

  async getByName(name: string): Promise<PermissionEntityModel> {
    const permission = await PermissionEntity.findOne({ where: { value: name } });
    return processNullableEntity(permission);
  }

  getAllByName(value: string[]): Promise<PermissionEntityModel[]> {
    return PermissionEntity.findAll({ where: { value } });
  }
}
