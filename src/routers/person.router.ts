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
        return this.service.getById(req.params.id).then((result) => res.status(200).json(result));
      })
    );

    this.router.post(
      '/',
      asyncMiddleware(async (req: Request, res: Response) => {
        this.validatePerson(req.body, createPersonSchema);
        return this.service.create(req.body).then((result) => res.status(201).json(result));
      })
    );

    this.router.put(
      '/:id',
      asyncMiddleware(async (req: Request, res: Response) => {
        const person = req.body;
        person.id = req.params.id;
        this.validatePerson(person, fullPersonSchema);
        return this.service.update(person).then((result) => res.status(200).json(result));
      })
    );

    this.router.delete(
      '/:id',
      asyncMiddleware(async (req: Request, res: Response) =>
        this.service.delete(req.params.id).then((result) => res.status(200).json(result))
      )
    );

    this.router.get(
      '/',
      asyncMiddleware(async (req: Request, res: Response) => {
        const { loginSubstring = '', limit } = req.query;
        const loginArgument = loginSubstring.toString();
        return this.service
          .getAutoSuggestUsers(loginArgument, +limit)
          .then((result) => res.status(200).json(result));
      })
    );
  }

  isSecured(): boolean {
    return true;
  }

  private validatePerson(person: Person, validator: ObjectSchema<Person>): void {
    const result = validator.validate(person);
    if (result.error) {
      throw new InternalError(result.error.message, ErrorType.BAD_REQUEST);
    }
  }
}

export default PersonRouter;
