import LoggerService from '../configs/logger';
import { RequestHandler, Response, Request, NextFunction } from 'express';

export default (logger: LoggerService): RequestHandler => (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  logger.debug({
    method: request.method,
    url: request.url,
    args: request.params,
  });
  next();
};
