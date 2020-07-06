import { Router, Request, Response } from 'express';
import { Group, groupSchema, createGroupSchema } from '../models';
import asyncMiddleware from '../middlewares/async.middleware';
import GroupService from '../services/group/group.interface';
import { validate } from '../middlewares/validation.middleware';

export const GroupRouter = (service: GroupService): Router => {
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
    validate<Group>(createGroupSchema),
    asyncMiddleware(async (req: Request, res: Response) => {
      const result = await service.create(req.body);
      res.status(201).json(result);
    })
  );

  router.put(
    '/:id',
    validate<Group>(groupSchema),
    asyncMiddleware(async (req: Request, res: Response) => {
      const group = req.body;
      group.id = req.params.id;
      const result = await service.update(group);
      res.status(200).json(result);
    })
  );

  router.delete(
    '/:id',
    asyncMiddleware(async (req: Request, res: Response) => {
      await service.delete(req.params.id);
      res.status(200).end();
    })
  );

  router.get(
    '/',
    asyncMiddleware(async (req: Request, res: Response) => {
      const result = await service.getAll();
      res.status(200).json(result);
    })
  );

  router.put(
    '/:id/users',
    asyncMiddleware(async (req: Request, res: Response) => {
      const groupId = req.params.id;
      const users = req.body;
      const result = await service.updateUserGroupAssociation(groupId, users);
      res.status(200).json(result);
    })
  );

  return router;
};
