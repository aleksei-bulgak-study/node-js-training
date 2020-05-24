import { Router, Request, Response } from 'express';
import RouterWrapper from './router.interface';
import asyncMiddleware from '../middlewares/async.middleware';
import { InternalError, ErrorType, AuthToken, AuthRequest, authRequestSchema } from '../models';
import { AuthService } from '../services/authorization.service';

class AuthorizationRouter implements RouterWrapper {
  readonly router: Router;
  readonly path: string;
  readonly service: AuthService;

  constructor(service: AuthService, path = '/') {
    this.router = Router();
    this.path = path;
    this.service = service;
    this.init();
  }

  private init(): void {
    this.router.post(
      '/',
      asyncMiddleware((req: Request, res: Response) => {
        this.validate(req.body);
        return this.service
          .generateToken(req.body)
          .then((token: AuthToken) => res.status(200).json(token));
      })
    );
  }

  isSecured(): boolean {
    return false;
  }

  private validate(authRequest: AuthRequest): void {
    const result = authRequestSchema.validate(authRequest);
    if (result.error) {
      throw new InternalError(result.error.message, ErrorType.BAD_REQUEST);
    }
  }
}

export default AuthorizationRouter;
