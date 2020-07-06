import express from 'express';
import {
  internalErrorMidleware,
  defaultErrorMiddleware,
  errorLogMiddleware,
  requestLogMiddleware,
  notFoundMiddleware,
  serviceLogMiddleware,
} from './middlewares';
import { port, loggerService } from './configs';
import { PersonDbService } from './services';
import { PersonRouter, GroupRouter } from './routers';
import { PersonDaoImpl, GroupDaoImpl, PermissionDaoImpl } from './data-access';
import { GroupServiceImpl } from './services/group/group.service';
import { winstonMiddleware } from './configs/logger';
import {
  startTimeMidleware,
  endTimeMiddleware,
  endTimeFailureMiddleware,
} from './middlewares/responseTime.middleware';

const personDao = new PersonDaoImpl();
const permissionDao = new PermissionDaoImpl();
const groupDao = new GroupDaoImpl(permissionDao);

const personService = new PersonDbService(personDao);
const groupService = new GroupServiceImpl(groupDao, personService);

const personDatabaseRouter = PersonRouter(personService);
const groupRouter = GroupRouter(groupService);

const middlewares = [winstonMiddleware, requestLogMiddleware(loggerService)];
const errorHandlers = [
  endTimeFailureMiddleware(loggerService),
  errorLogMiddleware(loggerService),
  internalErrorMidleware,
  defaultErrorMiddleware(loggerService),
];

const app = express();
app.use(express.json());
app.use(startTimeMidleware(loggerService));
app.use(...middlewares);
app.use('/v2/users', personDatabaseRouter);
app.use('/v1/groups', groupRouter);
app.use(endTimeMiddleware(loggerService));
app.use(serviceLogMiddleware(loggerService));
app.use(notFoundMiddleware);
app.use(...errorHandlers);
app.listen(port);

process.on('uncaughtException', (err) => {
  loggerService.error('Uncaught exception was thrown due to', err);
  process.exit(1);
});

process.on('unhandledRejection', () => {
  loggerService.error('Unhandler rejectio error was thrown due to');
});
