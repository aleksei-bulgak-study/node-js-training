import { Router, Request, Response, NextFunction } from 'express';
import { Group, groupSchema, createGroupSchema, assotiateUserWithGroup } from '../models';
import asyncMiddleware from '../middlewares/async.middleware';
import GroupService from '../services/group/group.interface';
import { validate, validateArray } from '../middlewares/validation.middleware';

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
    method,
    name: service,
    arguments: args,
  });
};

export const GroupRouter = (service: GroupService): Router => {
  const router = Router();

  router.get(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      trackingWrapper(res, 'groupService', 'getByid', [req.params.id]);
      const result = await service.getById(req.params.id);
      res.locals.result = { status: 200, body: result };
      next();
    })
  );

  router.post(
    '/',
    validate<Group>(createGroupSchema),
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      trackingWrapper(res, 'groupService', 'create', [req.body]);
      const result = await service.create(req.body);
      res.locals.result = { status: 201, body: result };
      next();
    })
  );

  router.put(
    '/:id',
    validate<Group>(groupSchema),
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      const group = req.body;
      group.id = req.params.id;
      trackingWrapper(res, 'groupService', 'update', [group]);
      const result = await service.update(group);
      res.locals.result = { status: 200, body: result };
      next();
    })
  );

  router.delete(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      trackingWrapper(res, 'groupService', 'delete', [req.params.id]);
      await service.delete(req.params.id);
      res.locals.result = { status: 200, body: null };
      next();
    })
  );

  router.get(
    '/',
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      trackingWrapper(res, 'groupService', 'getAll', []);
      const result = await service.getAll();
      res.locals.result = { status: 200, body: result };
      next();
    })
  );

  router.put(
    '/:id/users',
    validateArray(assotiateUserWithGroup),
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      const groupId = req.params.id;
      const users = req.body;
      trackingWrapper(res, 'groupService', 'updateUserGroupAssociation', [groupId, users]);
      const result = await service.updateUserGroupAssociation(groupId, users);
      res.locals.result = { status: 201, body: result };
      next();
    })
  );

  return router;
};

export default GroupRouter;
