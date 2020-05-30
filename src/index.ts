import express from 'express';
import { internalErrorMidleware, defaultErrorMiddleware, notFoundMiddleware } from './middlewares';
import { port } from './configs';
import { PersonDbService, PersonInMemoryService } from './services';
import { PersonDaoImpl } from './data-access';
import { PersonRouter } from './routers';

const personService = new PersonDbService(new PersonDaoImpl());
const personInMemoryService = new PersonInMemoryService();

const personDatabaseRouter = PersonRouter(personService);
const personInMemoryRouter = PersonRouter(personInMemoryService);
const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware];

const app = express();
app.use(express.json());
app.use('/v1/users', personInMemoryRouter);
app.use('/v2/users', personDatabaseRouter);
app.use(notFoundMiddleware);
app.use(...errorHandlers);
app.listen(port);
