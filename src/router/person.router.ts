import { Router } from 'express';

import { PersonService } from '../service';
import RouterWrapper from './router.interface';
import { fullPersonSchema, createPersonSchema } from '../model';
import { validatePerson } from '../middleware/personValidation.middleware';

class PersonRouter implements RouterWrapper {
  readonly router: Router;
  readonly path: string;
  readonly service: PersonService;

  constructor(service: PersonService, path = '/') {
    this.router = Router();
    this.path = path;
    this.service = service;
    this.init();
  }

  private init(): void {
    this.router.get('/:id', (req, res) => {
      const result = this.service.getById(req.params.id);
      res.status(200).json(result);
    });

    this.router.post('/', validatePerson(createPersonSchema), (req, res) => {
      const result = this.service.create(req.body);
      res.status(201).json(result);
    });

    this.router.put('/:id', validatePerson(fullPersonSchema), (req, res) => {
      const person = req.body;
      person.id = req.params.id;
      const result = this.service.update(person);
      res.status(200).json(result);
    });

    this.router.delete('/:id', (req, res) => {
      const result = this.service.delete(req.params.id);
      res.status(200).json(result);
    });

    this.router.get('/', (req, res) => {
      const { loginSubstring = '', limit } = req.query;
      const loginArgument = loginSubstring.toString();
      const result = this.service.getAutoSuggestUsers(loginArgument, +limit);
      res.status(200).json(result);
    });
  }
}

export default PersonRouter;
