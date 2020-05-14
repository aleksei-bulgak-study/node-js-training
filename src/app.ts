import express, { ErrorRequestHandler } from 'express';
import { Application, RequestHandler } from 'express';
import { RouterWrapper } from './routers';

class App {
  private app: Application;

  constructor(
    middlewares: RequestHandler[],
    routes: RouterWrapper[],
    exceptionHandlers: ErrorRequestHandler[]
  ) {
    this.app = express();
    this.app.use(express.json());
    if (middlewares && middlewares.length) {
      this.app.use(...middlewares);
    }
    routes.forEach((router) => this.app.use(router.path, router.router));
    this.app.use(...exceptionHandlers);
  }

  start(port: Number) {
    this.app.listen(port);
  }
}

export default App;
