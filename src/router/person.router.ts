import { Router } from 'express';

import { PersonService } from '../service';
import { fullPersonSchema, createPersonSchema } from '../model';
import { validatePerson } from '../middleware/personValidation.middleware';

const urlBuilder = (basePath: string, specificPath: string): string => {
  return basePath + specificPath;
};

export const PersonRouter = (service: PersonService, path: string): Router => {
  const router = Router();

  router.get(urlBuilder(path, '/:id'), (req, res) => {
    const result = service.getById(req.params.id);
    res.status(200).json(result);
  });

  router.post(urlBuilder(path, '/'), validatePerson(createPersonSchema), (req, res) => {
    const result = service.create(req.body);
    res.status(201).json(result);
  });

  router.put(urlBuilder(path, '/:id'), validatePerson(fullPersonSchema), (req, res) => {
    const person = req.body;
    person.id = req.params.id;
    const result = service.update(person);
    res.status(200).json(result);
  });

  router.delete(urlBuilder(path, '/:id'), (req, res) => {
    const result = service.delete(req.params.id);
    res.status(200).json(result);
  });

  router.get(urlBuilder(path, '/'), (req, res) => {
    const { loginSubstring = '', limit } = req.query;
    const loginArgument = loginSubstring.toString();
    const result = service.getAutoSuggestUsers(loginArgument, +limit);
    res.status(200).json(result);
  });

  return router;
};
