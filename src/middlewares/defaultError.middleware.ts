import { Request, Response, ErrorRequestHandler } from 'express';
import LoggerService from '../configs/logger';

export default (logger: LoggerService): ErrorRequestHandler => (
  error: Error,
  request: Request,
  response: Response
): void => {
  logger.error('Application failed with unknown exception', error);
  response.status(500).json({ message: error.message });
};
