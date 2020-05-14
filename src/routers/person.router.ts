import { Router, Request, Response } from 'express';
import { ObjectSchema } from '@hapi/joi';
import PersonService from '../services';
import RouterWrapper from './router.interface';
import { Person, ErrorType, fullPersonSchema, createPersonSchema, InternalError } from '../models';
import asyncMiddleware from '../middlewares/async.middleware';

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
    this.router.get(
      '/:id',
      asyncMiddleware(async (req: Request, res: Response) => {
        const result = await this.service.getById(req.params.id);
        res.status(200).json(result);
      })
    );

    this.router.post(
      '/',
      asyncMiddleware(async (req: Request, res: Response) => {
        this.validatePerson(req.body, createPersonSchema);
        const result = await this.service.create(req.body);
        res.status(201).json(result);
      })
    );

    this.router.put(
      '/:id',
      asyncMiddleware(async (req: Request, res: Response) => {
        const person = req.body;
        person.id = req.params.id;
        this.validatePerson(person, fullPersonSchema);
        const result = await this.service.update(person);
        res.status(200).json(result);
      })
    );

    this.router.delete(
      '/:id',
      asyncMiddleware(async (req: Request, res: Response) => {
        const result = await this.service.delete(req.params.id);
        res.status(200).json(result);
      })
    );

    this.router.get(
      '/',
      asyncMiddleware(async (req: Request, res: Response) => {
        const { loginSubstring = '', limit } = req.query;
        const loginArgument = loginSubstring.toString();
        const result = await this.service.getAutoSuggestUsers(loginArgument, +limit);
        res.status(200).json(result);
      })
    );
  }

  validatePerson(person: Person, validator: ObjectSchema<Person>): void {
    const result = validator.validate(person);
    if (result.error) {
      throw new InternalError(result.error.message, ErrorType.BAD_REQUEST);
    }
  }
}

export default PersonRouter;
