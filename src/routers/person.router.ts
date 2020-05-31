import { Router, Request, Response } from 'express';

import PersonService from '../services';
import { fullPersonSchema, createPersonSchema, Person } from '../models';
import { validate } from '../middlewares/validation.middleware';
import asyncMiddleware from '../middlewares/async.middleware';

const PersonRouter = (service: PersonService): Router => {
  const router = Router();

  router.get(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response) => {
      const result = await service.getById(req.params.id);
      res.status(200).json(result);
    })
  );

  router.post(
    '/',
    validate<Person>(createPersonSchema),
    asyncMiddleware(async (req: Request, res: Response) => {
      const result = await service.create(req.body);
      res.status(201).json(result);
    })
  );

  router.put(
    '/:id',
    validate<Person>(fullPersonSchema),
    asyncMiddleware(async (req: Request, res: Response) => {
      const person = req.body;
      person.id = req.params.id;
      const result = await service.update(person);
      res.status(200).json(result);
    })
  );

  router.delete(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response) => {
      const result = await service.delete(req.params.id);
      res.status(200).json(result);
    })
  );

  router.get(
    '/',
    asyncMiddleware(async (req: Request, res: Response) => {
      const { loginSubstring = '', limit } = req.query;
      const loginArgument = loginSubstring.toString();
      const result = await service.getAutoSuggestUsers(loginArgument, +limit);
      res.status(200).json(result);
    })
  );

  return router;
};

export { PersonRouter };
