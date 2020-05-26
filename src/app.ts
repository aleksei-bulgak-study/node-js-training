import express, { ErrorRequestHandler, Router } from 'express';
import { RequestHandler } from 'express';

export default (
  middlewares: RequestHandler[],
  routes: Array<Router | RequestHandler>,
  exceptionHandlers: ErrorRequestHandler[]
) => {
  const app = express();
  app.use(express.json());
  if (middlewares && middlewares.length) {
    app.use(...middlewares);
  }
  routes.forEach((router) => app.use(router));
  app.use(...exceptionHandlers);

  return (port: number) => {
    app.listen(port);
  };
};
