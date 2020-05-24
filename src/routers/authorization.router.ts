import { Router, Request, Response } from 'express';
import asyncMiddleware from '../middlewares/async.middleware';
import { AuthRequest, authRequestSchema } from '../models';
import { AuthService } from '../services/authorization.service';
import { validate } from '../middlewares/validation.middleware';

const AuthorizationRouter = (service: AuthService): Router => {
  const router = Router();

  router.post(
    '/',
    validate<AuthRequest>(authRequestSchema),
    asyncMiddleware(async (req: Request, res: Response) => {
      const token = await service.generateToken(req.body);
      res.status(200).json(token);
    })
  );
  return router;
};

export { AuthorizationRouter };
