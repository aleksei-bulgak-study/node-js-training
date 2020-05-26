import app from './app';
import { PersonService } from './service';
import { PersonRouter } from './router/person.router';
import { internalErrorMidleware, defaultErrorMiddleware, notFoundMiddleware } from './middleware';
import { port } from './config';

const personService = new PersonService();
const personRouter = PersonRouter(personService, '/users');
const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware];

app([], [personRouter, notFoundMiddleware], errorHandlers)(port);
