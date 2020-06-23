import express from 'express';
import { internalErrorMidleware, defaultErrorMiddleware, notFoundMiddleware } from './middlewares';
import { port } from './configs';
import { PersonDbService } from './services';
import { PersonDaoImpl } from './data-access';
import { PersonRouter, GroupRouter } from './routers';
import { PermissionDaoImpl } from './data-access/permission/permission.dao';
import { GroupDaoImpl } from './data-access/group/group.dao';
import { GroupServiceImpl } from './services/group/group.service';

const personDao = new PersonDaoImpl();
const permissionDao = new PermissionDaoImpl();
const groupDao = new GroupDaoImpl(permissionDao);

const personService = new PersonDbService(personDao);
const groupService = new GroupServiceImpl(groupDao, personService);

const personDatabaseRouter = PersonRouter(personService);
const groupRouter = GroupRouter(groupService);
const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware];

const app = express();
app.use(express.json());
app.use('/v2/users', personDatabaseRouter);
app.use('/v1/groups', groupRouter);
app.use(notFoundMiddleware);
app.use(...errorHandlers);
app.listen(port);
