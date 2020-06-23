import { DataTypes, Model, BuildOptions } from 'sequelize';
import { sequelize } from '../../configs';
import { PermissionEntity, PermissionEntityModel } from '../permission/permission.entity';
import { PersonEntity } from '../person/person.entity';

export interface GroupEntityModel extends Model {
  readonly id: string;
  readonly name: string;
  readonly permissions: PermissionEntityModel[];
  setUsers(users: Array<string>): void;
}

type GroupEntityModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): GroupEntityModel;
};

const GroupEntity = sequelize.define(
  'group',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
      comment: 'Primary key for group table',
      references: {
        model: 'group_permission',
        key: 'groupId',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Unique name for the group',
    },
  },
  {
    tableName: 'groups',
  }
) as GroupEntityModelStatic;
GroupEntity.belongsToMany(PermissionEntity, {
  through: 'group_permission',
});
GroupEntity.belongsToMany(PersonEntity, {
  through: 'user_group',
});

export { GroupEntity };
