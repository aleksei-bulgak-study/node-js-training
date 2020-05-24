import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services';
import { InternalError, ErrorType } from '../models';

const authMiddleware = (service: AuthService) => (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return Promise.resolve(next(new InternalError('Authorization failed', ErrorType.UNAUTHORIZED)));
  }
  return service
    .validateToken(authHeader)
    .then(() => next())
    .catch(() => next(new InternalError('Access forbidden', ErrorType.FORBIDDEN)));
};

export default authMiddleware;
