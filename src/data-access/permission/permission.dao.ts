import { PermissionEntity, PermissionEntityModel } from './permission.entity';
import { NotFoundError } from '../../models';
import { PermissionDao } from '..';

const processNullableEntity = (result: PermissionEntityModel | null): PermissionEntityModel => {
  if (!result) {
    throw new NotFoundError(`Permission entity was not found`);
  }
  return result;
};

export class PermissionDaoImpl implements PermissionDao {
  getById(id: number): Promise<PermissionEntityModel> {
    return PermissionEntity.findByPk(id);
  }

  async getByName(name: string): Promise<PermissionEntityModel> {
    const permissions = await PermissionEntity.findOne({ where: { value: name } });
    return processNullableEntity(permissions);
  }

  getAllByName(value: string[]): Promise<PermissionEntityModel[]> {
    return PermissionEntity.findAll({ where: { value } });
  }
}
