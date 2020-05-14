import * as dotenv from 'dotenv';
import App from './app';
import { databaseConfig } from './configs';
import { PersonDbService } from './services';
import { PersonDaoImpl } from './data-access';
import { PersonRouter } from './routers';
import { internalErrorMidleware, defaultErrorMiddleware } from './middlewares';

dotenv.config();
const dbUrl = process.env.DB_URL ? process.env.DB_URL : '';
const portString = process.env.PORT ? process.env.PORT : '0';
const port: number = Number.parseInt(portString);

const sequelize = databaseConfig(dbUrl);
const personService = new PersonDbService(new PersonDaoImpl(sequelize));
const personRouter = new PersonRouter(personService, '/users');
const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware];

const app = new App([], [personRouter], errorHandlers);
app.start(port);
