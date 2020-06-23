import { DataTypes, Model, BuildOptions } from 'sequelize';
import { sequelize } from '../../configs';

export interface PermissionEntityModel extends Model {
  id: number;
  value: string;
}

type PermissionEntityModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): PermissionEntityModel;
};

const PermissionEntity = sequelize.define(
  'permission',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      comment: 'Primary key for permission table',
      references: {
        model: 'group_permission',
        key: 'permissionId',
      },
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Unique name for the permission',
    },
  },
  {
    tableName: 'permission',
  }
) as PermissionEntityModelStatic;

export { PermissionEntity };
