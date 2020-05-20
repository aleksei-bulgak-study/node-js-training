import * as dotenv from 'dotenv';
import { databaseConfig, dbUrl } from './database';
import port from '../configs/port';
import { loggerService } from './logger';

dotenv.config();
const portNumber = port();
const sequelize = databaseConfig(dbUrl(), loggerService);

export { portNumber as port, sequelize, loggerService };
