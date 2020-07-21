import express, { Router } from 'express';
import cors from 'cors';
import { port, loggerService, jwtSecret } from './configs';
import {
  internalErrorMidleware,
  defaultErrorMiddleware,
  errorLogMiddleware,
  requestLogMiddleware,
  notFoundMiddleware,
  authentificationMiddleware,
} from './middlewares';
import { PersonDbService } from './services';
import { PersonRouter, GroupRouter, AuthorizationRouter } from './routers';
import { PersonDaoImpl, GroupDaoImpl, PermissionDaoImpl } from './data-access';
import { GroupServiceImpl } from './services/group/group.service';
import { winstonMiddleware } from './configs/logger';
import { AuthService } from './services/authorization.service';

const personDao = new PersonDaoImpl();
const permissionDao = new PermissionDaoImpl();
const groupDao = new GroupDaoImpl(permissionDao);

const personService = new PersonDbService(personDao);
const groupService = new GroupServiceImpl(groupDao, personService);
const authService = new AuthService(personService, loggerService, jwtSecret);

const personDatabaseRouter = PersonRouter(personService);
const groupRouter = GroupRouter(groupService);
const authRouter = AuthorizationRouter(authService);

const authMiddleware = authentificationMiddleware(authService);
const middlewares = [cors({ origin: '*' }), winstonMiddleware, requestLogMiddleware(loggerService)];
const errorHandlers = [
  errorLogMiddleware(loggerService),
  internalErrorMidleware,
  defaultErrorMiddleware(loggerService),
];

const securedRoutes = Router();
securedRoutes.use(authMiddleware);
securedRoutes.use('/v2/users', personDatabaseRouter);
securedRoutes.use('/v1/groups', groupRouter);

const app = express();
app.use(express.json());
app.use(...middlewares);
app.use('/login', authRouter);
app.use(securedRoutes);
app.use(notFoundMiddleware);
app.use(...errorHandlers);
const server = app.listen(port);

process.on('uncaughtException', (err) => {
  loggerService.error('Uncaught exception was thrown due to', err);
  process.exit(1);
});

process.on('unhandledRejection', () => {
  loggerService.error('Unhandler rejection error was thrown due to');
});

export { app, server };
