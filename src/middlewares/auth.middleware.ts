import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services';
import { InternalError, ErrorType } from '../models';
import { loggerService } from '../configs';

const authMiddleware = (service: AuthService) => (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const authHeader = request.headers.authorization;
  console.log('header', authHeader);
  if (!authHeader) {
    return next(new InternalError('Authorization failed', ErrorType.UNAUTHORIZED));
  }
  try {
    service.validateToken(authHeader);
    return next();
  } catch (e) {
    loggerService.error('Error was thrown during auth process', e);
    return next(new InternalError('Access forbidden', ErrorType.FORBIDDEN));
  }
};

export default authMiddleware;
