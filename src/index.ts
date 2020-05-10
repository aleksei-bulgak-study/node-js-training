import * as dotenv from 'dotenv';
import App from './app';
import { PersonService } from './service';
import { PersonRouter } from './router';
import { internalErrorMidleware, defaultErrorMiddleware } from './middleware';

dotenv.config();
const portString = process.env.PORT ? process.env.PORT : '0';
const port: number = Number.parseInt(portString);

const personService = new PersonService();
const personRouter = new PersonRouter(personService, '/users');
const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware];

const app = new App([], [personRouter], errorHandlers);
app.start(port);
