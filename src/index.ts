import * as dotenv from 'dotenv';
import App from './app';
import { databaseConfig } from './configs';
import { PersonDbService } from './services';
import { PersonDaoImpl, GroupDaoImpl, PermissionDaoImpl } from './data-access';
import { PersonRouter, GroupRouter } from './routers';
import { internalErrorMidleware, defaultErrorMiddleware } from './middlewares';
import { GroupServiceImpl } from './services/group/group.service';

dotenv.config();
const dbUrl = process.env.DB_URL ? process.env.DB_URL : '';
const portString = process.env.PORT ? process.env.PORT : '0';
const port: number = Number.parseInt(portString);

const sequelize = databaseConfig(dbUrl);
const personDao = new PersonDaoImpl(sequelize);
const permissionDao = new PermissionDaoImpl(sequelize);
const groupDao = new GroupDaoImpl(sequelize, personDao, permissionDao);
const personService = new PersonDbService(personDao);
const personRouter = new PersonRouter(personService, '/users');
const groupService = new GroupServiceImpl(groupDao, personService);
const groupRouter = new GroupRouter(groupService, '/groups');
const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware];

const app = new App([], [personRouter, groupRouter], errorHandlers);
app.start(port);
