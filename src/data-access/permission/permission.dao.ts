import { PermissionEntity, PermissionEntityModel } from './permission.entity';
import { NotFoundError } from '../../models';
import { PermissionDao } from '..';

export class PermissionDaoImpl implements PermissionDao {
  getById(id: number): Promise<PermissionEntityModel> {
    return PermissionEntity.findByPk(id);
  }

  getByName(name: string): Promise<PermissionEntityModel> {
    return PermissionEntity.findOne({ where: { value: name } })
      .then(processNullableEntity);
  }

  getAllByName(value: string[]): Promise<PermissionEntityModel[]> {
    return PermissionEntity.findAll({ where: { value } });
  }
}

const processNullableEntity = (result: PermissionEntityModel | null) => {
  if (!result) {
    throw new NotFoundError(`Permission entity was not found`);
  }
  return result;
};
