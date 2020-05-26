import express, { ErrorRequestHandler, Router } from 'express';
import { PersonService } from './service';
import { PersonRouter } from './router/person.router';
import { internalErrorMidleware, defaultErrorMiddleware, notFoundMiddleware } from './middleware';
import { port } from './config';

const personService = new PersonService();
const personRouter = PersonRouter(personService);
const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware];

const app = express();
app.use(express.json());
app.use('/users', personRouter);
app.use(notFoundMiddleware);
app.use(...errorHandlers);
app.listen(port);
