import express from 'express';
import { internalErrorMidleware, defaultErrorMiddleware, notFoundMiddleware } from './middlewares';
import { port, sequelize } from './configs';
import { PersonDbService } from './services';
import { PersonDaoImpl } from './data-access';
import { PersonRouter } from './routers';

const personService = new PersonDbService(new PersonDaoImpl(sequelize));
const personRouter = PersonRouter(personService);
const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware];

const app = express();
app.use(express.json());
app.use('/users', personRouter);
app.use(notFoundMiddleware);
app.use(...errorHandlers);
app.listen(port);
