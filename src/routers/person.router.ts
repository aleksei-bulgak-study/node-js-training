import { Router, Request, Response, NextFunction } from 'express';

import PersonService from '../services';
import { fullPersonSchema, createPersonSchema, Person } from '../models';
import { validate } from '../middlewares/validation.middleware';
import asyncMiddleware from '../middlewares/async.middleware';

export const PersonRouter = (service: PersonService): Router => {
  const router = Router();

  router.get(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      trackingWrapper(res, 'peopleService', 'getById', [req.params.id]);
      const result = await service.getById(req.params.id);
      res.locals.result = { status: 200, body: result };
      next();
    })
  );

  router.post(
    '/',
    validate<Person>(createPersonSchema),
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      trackingWrapper(res, 'peopleService', 'create', [req.body]);
      const result = await service.create(req.body);
      res.locals.result = { status: 201, body: result };
      next();
    })
  );

  router.put(
    '/:id',
    validate<Person>(fullPersonSchema),
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      const person = req.body;
      person.id = req.params.id;
      trackingWrapper(res, 'peopleService', 'update', [person]);
      const result = await service.update(person);
      res.locals.result = { status: 200, body: result };
      next();
    })
  );

  router.delete(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      trackingWrapper(res, 'peopleService', 'delete', [req.params.id]);
      const result = await service.delete(req.params.id);
      res.locals.result = { status: 200, body: result };
      next();
    })
  );

  router.get(
    '/',
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      const { loginSubstring = '', limit } = req.query;
      const loginArgument = loginSubstring.toString();
      trackingWrapper(res, 'peopleService', 'getAutoSuggestUsers', [loginArgument, '' + limit]);
      const result = await service.getAutoSuggestUsers(loginArgument, +limit);
      res.locals.result = { status: 200, body: result };
      next();
    })
  );

  return router;
};

const trackingWrapper = (
  res: Response,
  service: string,
  method: string,
  args: Array<string>
): void => {
  if (!res.locals.services) {
    res.locals.services = [];
  }
  res.locals.services.push({
    name: service,
    method: method,
    arguments: args,
  });
};
