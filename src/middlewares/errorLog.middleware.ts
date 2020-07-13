import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import LoggerService from '../configs/logger';

export default (logger: LoggerService): ErrorRequestHandler => (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  logger.errorDetailed({
    message: error.message,
    method: request.method,
    args: request.params,
  });
  next(error);
};
