import { PermissionEntity } from './permission.entity';
import { Sequelize, Model } from 'sequelize';
import { Permission, NotFoundError } from '../../models';
import { PermissionDao } from '..';

export class PermissionDaoImpl implements PermissionDao {
  private readonly permissionEntity: typeof Model;

  constructor(sequilize: Sequelize) {
    this.permissionEntity = PermissionEntity(sequilize);
  }

  getById(id: number): Promise<Permission> {
    return this.permissionEntity
      .findByPk(id)
      .then(processNullableEntity)
      .then((result: Model) => {
        return {
          id: result.get('id'),
          value: result.get('value'),
        };
      });
  }
  getByName(name: string): Promise<Permission> {
    return this.permissionEntity
      .findOne({ where: { value: name } })
      .then(processNullableEntity)
      .then((result: Model) => {
        return {
          id: result.get('id'),
          value: result.get('value'),
        };
      });
  }

  getAllByName(value: string[]): Promise<Permission[]> {
    return this.permissionEntity.findAll({ where: { value } });
  }

  getModel(): typeof Model {
    return this.permissionEntity;
  }
}

const processNullableEntity = (result: Model | null) => {
  if (!result) {
    throw new NotFoundError(`Permission entity was not found`);
  }
  return result;
};
