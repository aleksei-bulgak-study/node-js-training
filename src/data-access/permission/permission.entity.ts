import { Sequelize, DataTypes, Model } from 'sequelize';

const PermissionEntity = (sequelize: Sequelize): typeof Model => {
  return sequelize.define(
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
  );
};

export { PermissionEntity };
