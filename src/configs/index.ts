import * as dotenv from 'dotenv';
import { databaseConfig, dbUrl } from './database';
import port from './port';
import { loggerService } from './logger';
import jwt from './jwt';

dotenv.config();
const portNumber = port();
const sequelize = databaseConfig(dbUrl(), loggerService);
const jwtSecret = jwt();

export { portNumber as port, sequelize, loggerService, jwtSecret };
