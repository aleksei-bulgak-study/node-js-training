import { Router, Request, Response } from 'express';
import { ObjectSchema } from '@hapi/joi';
import RouterWrapper from './router.interface';
import { Group, ErrorType, groupSchema, InternalError } from '../models';
import asyncMiddleware from '../middlewares/async.middleware';
import GroupService from '../services/group/group.interface';

class GroupRouter implements RouterWrapper {
  readonly router: Router;
  readonly path: string;
  readonly service: GroupService;

  constructor(service: GroupService, path = '/') {
    this.router = Router();
    this.path = path;
    this.service = service;
    this.init();
  }

  private init(): void {
    this.router.get(
      '/:id',
      asyncMiddleware(async (req: Request, res: Response) =>
        this.service.getById(req.params.id).then((result) => res.status(200).json(result))
      )
    );

    this.router.post(
      '/',
      asyncMiddleware(async (req: Request, res: Response) => {
        this.validate(req.body, groupSchema);
        return this.service.create(req.body).then((result) => res.status(201).json(result));
      })
    );

    this.router.put(
      '/:id',
      asyncMiddleware(async (req: Request, res: Response) => {
        const group = req.body;
        group.id = req.params.id;
        this.validate(group, groupSchema);
        return this.service.update(group).then((result) => res.status(200).json(result));
      })
    );

    this.router.delete(
      '/:id',
      asyncMiddleware(async (req: Request, res: Response) =>
        this.service.delete(req.params.id).then(() => res.status(200).end())
      )
    );

    this.router.get(
      '/',
      asyncMiddleware(async (req: Request, res: Response) =>
        this.service.getAll().then((result) => res.status(200).json(result))
      )
    );

    this.router.put(
      '/:id/users',
      asyncMiddleware(async (req: Request, res: Response) => {
        const groupId = req.params.id;
        const users = req.body;
        return this.service
          .updateUserGroupAssociation(groupId, users)
          .then((result) => res.status(200).json(result));
      })
    );
  }

  isSecured(): boolean {
    return true;
  }

  private validate(group: Group, validator: ObjectSchema<Group>): void {
    const result = validator.validate(group);
    if (result.error) {
      throw new InternalError(result.error.message, ErrorType.BAD_REQUEST);
    }
  }
}

export default GroupRouter;
