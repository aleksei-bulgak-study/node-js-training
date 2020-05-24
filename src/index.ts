import cors from 'cors';
import App from './app';
import { DB_URL, APP_PORT, JWT_SECRET } from './configs/env';
import { databaseConfig, loggerService } from './configs';
import { PersonDbService } from './services';
import { PersonDaoImpl, GroupDaoImpl, PermissionDaoImpl } from './data-access';
import { PersonRouter, GroupRouter } from './routers';
import {
  internalErrorMidleware,
  defaultErrorMiddleware,
  errorLogMiddleware,
  requestLogMiddleware,
  authentificationMiddleware,
} from './middlewares';
import { GroupServiceImpl } from './services/group/group.service';
import { winstonMiddleware } from './configs/logger';
import AuthorizationRouter from './routers/authorization.router';
import { AuthService } from './services/authorization.service';

const sequelize = databaseConfig(DB_URL, loggerService);
const personDao = new PersonDaoImpl(sequelize);
const permissionDao = new PermissionDaoImpl(sequelize);
const groupDao = new GroupDaoImpl(sequelize, personDao, permissionDao);
const personService = new PersonDbService(personDao);
const personRouter = new PersonRouter(personService, '/users');
const groupService = new GroupServiceImpl(groupDao, personService);
const groupRouter = new GroupRouter(groupService, '/groups');
const middlewares = [cors({ origin: '*' }), winstonMiddleware, requestLogMiddleware(loggerService)];
const errorHandlers = [
  errorLogMiddleware(loggerService),
  internalErrorMidleware,
  defaultErrorMiddleware(loggerService),
];

const authService = new AuthService(personService, loggerService, JWT_SECRET);
const authRouter = new AuthorizationRouter(authService, '/login');
const authMiddleware = authentificationMiddleware(authService);

const app = new App(
  middlewares,
  [personRouter, groupRouter, authRouter],
  errorHandlers,
  authMiddleware
);
app.start(APP_PORT);

process.on('uncaughtException', (err) => {
  loggerService.error('Uncaught exception was thrown due to', err);
  process.exit(1);
});

process.on('unhandledRejection', () => {
  loggerService.error('Unhandler rejection error was thrown due to');
});
