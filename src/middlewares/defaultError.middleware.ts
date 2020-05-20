import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import LoggerService from '../configs/logger';

export default (logger: LoggerService): ErrorRequestHandler => (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (error) {
    logger.error('Application failed with unknown exception', error);
    response.status(500).json({ message: error.message });
    return;
  }
  return next(error);
};
