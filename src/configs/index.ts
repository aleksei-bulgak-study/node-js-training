import * as dotenv from 'dotenv';
import { databaseConfig, dbUrl } from './database';
import port from '../configs/port';

dotenv.config();
const portNumber = port();
const sequelize = databaseConfig(dbUrl());

export { portNumber as port, sequelize };
