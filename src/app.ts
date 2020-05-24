import express, { ErrorRequestHandler } from 'express';
import { Application, RequestHandler } from 'express';
import { RouterWrapper } from './routers';

class App {
  private app: Application;
  private readonly authMiddleware: RequestHandler;

  constructor(
    middlewares: RequestHandler[],
    routes: RouterWrapper[],
    exceptionHandlers: ErrorRequestHandler[],
    authMiddleware: RequestHandler
  ) {
    this.authMiddleware = authMiddleware;
    this.app = express();
    this.app.use(express.json());
    if (middlewares && middlewares.length) {
      this.app.use(...middlewares);
    }
    routes.forEach((router) => this.app.use(router.path, this.getRouters(router)));
    this.app.use(...exceptionHandlers);
  }

  start(port: Number) {
    this.app.listen(port);
  }

  private getRouters(router: RouterWrapper): RequestHandler[] {
    if (router.isSecured()) {
      return [this.authMiddleware, router.router];
    }
    return [router.router];
  }
}

export default App;
