import { Router, Request, Response } from 'express';
import { Group, groupSchema } from '../models';
import asyncMiddleware from '../middlewares/async.middleware';
import GroupService from '../services/group/group.interface';
import { validate } from '../middlewares/validation.middleware';

export const GroupRouter = (service: GroupService): Router => {
  const router = Router();

  router.get(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response) =>
      service.getById(req.params.id).then((result) => res.status(200).json(result))
    )
  );

  router.post(
    '/',
    validate<Group>(groupSchema),
    asyncMiddleware(async (req: Request, res: Response) => {
      return service.create(req.body).then((result) => res.status(201).json(result));
    })
  );

  router.put(
    '/:id',
    validate<Group>(groupSchema),
    asyncMiddleware(async (req: Request, res: Response) => {
      const group = req.body;
      group.id = req.params.id;
      return service.update(group).then((result) => res.status(200).json(result));
    })
  );

  router.delete(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response) =>
      service.delete(req.params.id).then(() => res.status(200).end())
    )
  );

  router.get(
    '/',
    asyncMiddleware(async (req: Request, res: Response) =>
      service.getAll().then((result) => res.status(200).json(result))
    )
  );

  router.put(
    '/:id/users',
    asyncMiddleware(async (req: Request, res: Response) => {
      const groupId = req.params.id;
      const users = req.body;
      return service
        .updateUserGroupAssociation(groupId, users)
        .then((result) => res.status(200).json(result));
    })
  );

  return router;
};

export default GroupRouter;
