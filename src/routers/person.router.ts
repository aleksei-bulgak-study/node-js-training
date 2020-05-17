import { Router, Request, Response } from 'express';

import PersonService from '../services';
import { fullPersonSchema, createPersonSchema, Person } from '../models';
import { validate } from '../middlewares/validation.middleware';
import asyncMiddleware from '../middlewares/async.middleware';

export const PersonRouter = (service: PersonService): Router => {
  const router = Router();

  router.get(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response) => {
      return service.getById(req.params.id).then((result) => res.status(200).json(result));
    })
  );

  router.post(
    '/',
    validate<Person>(createPersonSchema),
    asyncMiddleware(async (req: Request, res: Response) => {
      return service.create(req.body).then((result) => res.status(201).json(result));
    })
  );

  router.put(
    '/:id',
    validate<Person>(fullPersonSchema),
    asyncMiddleware(async (req: Request, res: Response) => {
      const person = req.body;
      person.id = req.params.id;
      return service.update(person).then((result) => res.status(200).json(result));
    })
  );

  router.delete(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response) => {
      return service.delete(req.params.id).then((result) => res.status(200).json(result));
    })
  );

  router.get(
    '/',
    asyncMiddleware(async (req: Request, res: Response) => {
      const { loginSubstring = '', limit } = req.query;
      const loginArgument = loginSubstring.toString();
      return service
        .getAutoSuggestUsers(loginArgument, +limit)
        .then((result) => res.status(200).json(result));
    })
  );

  return router;
};
