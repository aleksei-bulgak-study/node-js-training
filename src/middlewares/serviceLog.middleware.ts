import LoggerService from '../configs/logger';
import { RequestHandler, Response, Request, NextFunction } from 'express';

export default (logger: LoggerService): RequestHandler => (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (response.locals.result) {
    logger.debug({ message: 'Service method was called', data: response.locals.services });
    response.status(response.locals.result.status).json(response.locals.result.body);
  } else {
    return next();
  }
};
