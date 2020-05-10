import App from './app';
import { PersonService } from './service';
import { PersonRouter } from './router';
import { internalErrorMidleware, defaultErrorMiddleware } from './middleware';

const personService = new PersonService();
const personRouter = new PersonRouter(personService, '/users');
const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware];

const app = new App([], [personRouter], errorHandlers);
app.start(3000);
