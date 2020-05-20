import * as dotenv from 'dotenv';
import App from './app';
import { databaseConfig, loggerService } from './configs';
import { PersonDbService } from './services';
import { PersonDaoImpl, GroupDaoImpl, PermissionDaoImpl } from './data-access';
import { PersonRouter, GroupRouter } from './routers';
import {
  internalErrorMidleware,
  defaultErrorMiddleware,
  errorLogMiddleware,
  requestLogMiddleware,
} from './middlewares';
import { GroupServiceImpl } from './services/group/group.service';
import { winstonMiddleware } from './configs/logger';

dotenv.config();
const dbUrl = process.env.DB_URL ? process.env.DB_URL : '';
const portString = process.env.PORT ? process.env.PORT : '0';
const port: number = Number.parseInt(portString);

const sequelize = databaseConfig(dbUrl, loggerService);
const personDao = new PersonDaoImpl(sequelize);
const permissionDao = new PermissionDaoImpl(sequelize);
const groupDao = new GroupDaoImpl(sequelize, personDao, permissionDao);
const personService = new PersonDbService(personDao);
const personRouter = new PersonRouter(personService, '/users');
const groupService = new GroupServiceImpl(groupDao, personService);
const groupRouter = new GroupRouter(groupService, '/groups');
const middlewares = [winstonMiddleware, requestLogMiddleware(loggerService)];
const errorHandlers = [
  errorLogMiddleware(loggerService),
  internalErrorMidleware,
  defaultErrorMiddleware(loggerService),
];

const app = new App(middlewares, [personRouter, groupRouter], errorHandlers);
app.start(port);

process.on('uncaughtException', (err) => {
  loggerService.error('Uncaught exception was thrown due to', err);
  process.exit(1);
});

process.on('unhandledRejection', () => {
  loggerService.error('Unhandler rejectio error was thrown due to');
});
