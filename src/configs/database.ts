import { Sequelize, Model } from 'sequelize';

export default (dbUrl: string): typeof Model => {
  const sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: false,
    },
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((err: Error) => {
      console.error('Unable to connect to the database', err);
    });

  return sequelize;
};
