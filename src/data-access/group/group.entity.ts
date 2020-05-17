import { Sequelize, DataTypes, Model } from 'sequelize';

export const GroupEntity = (
  sequelize: Sequelize,
  PersonModel: typeof Model,
  PermissionModel: typeof Model
): typeof Model => {
  const GroupModel = sequelize.define(
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
  );
  GroupModel.belongsToMany(PermissionModel, {
    through: 'group_permission',
  });
  GroupModel.belongsToMany(PersonModel, {
    through: 'user_group',
  });
  return GroupModel;
};
