import * as dotenv from 'dotenv';
import databaseConfig from './database';
import port from '../configs/port';

dotenv.config();
const portNumber = port();
const sequelize = databaseConfig();

export { portNumber as port, sequelize };
