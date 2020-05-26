import { Router } from 'express';

import { PersonService } from '../service';
import { fullPersonSchema, createPersonSchema } from '../model';
import { validatePerson } from '../middleware/personValidation.middleware';

export const PersonRouter = (service: PersonService): Router => {
  const router = Router();

  router.get('/:id', (req, res) => {
    const result = service.getById(req.params.id);
    res.status(200).json(result);
  });

  router.post('/', validatePerson(createPersonSchema), (req, res) => {
    const result = service.create(req.body);
    res.status(201).json(result);
  });

  router.put('/:id', validatePerson(fullPersonSchema), (req, res) => {
    const person = req.body;
    person.id = req.params.id;
    const result = service.update(person);
    res.status(200).json(result);
  });

  router.delete('/:id', (req, res) => {
    const result = service.delete(req.params.id);
    res.status(200).json(result);
  });

  router.get('/', (req, res) => {
    const { loginSubstring = '', limit } = req.query;
    const loginArgument = loginSubstring.toString();
    const result = service.getAutoSuggestUsers(loginArgument, +limit);
    res.status(200).json(result);
  });

  return router;
};
