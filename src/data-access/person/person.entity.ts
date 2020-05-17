import { Sequelize, DataTypes, Model } from 'sequelize';

export const PersonEntity = (sequelize: Sequelize): typeof Model => {
  return sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        comment: 'Primary key for user table',
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Unique login for user',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Users password. Not save to store unencripted',
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Users age. Can be from 4-130',
      },
      isDeleted: {
        field: 'delete',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Flag that indicates users status',
      },
    },
    { tableName: 'users' }
  );
};
