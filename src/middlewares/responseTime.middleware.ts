import LoggerService from '../configs/logger';
import { RequestHandler, Response, Request, NextFunction, ErrorRequestHandler } from 'express';

const startTimeMidleware = (): RequestHandler => (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  response.locals.start = process.hrtime();
  next();
};

const endTimeMiddleware = (logger: LoggerService): RequestHandler => (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const methodFinised = process.hrtime();
  const methodStarted = response.locals.start;
  logger.debug({
    message: 'Operation response time',
    start: methodStarted,
    end: methodFinised,
    responseTime: process.hrtime(methodStarted),
  });
  next();
};

const endTimeFailureMiddleware = (logger: LoggerService): ErrorRequestHandler => (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const methodFinised = process.hrtime();
  const methodStarted = response.locals.start;
  logger.debug({
    message: 'Operation response time',
    start: methodStarted,
    end: methodFinised,
    responseTime: process.hrtime(methodStarted),
  });
  next(error);
};

export { startTimeMidleware, endTimeMiddleware, endTimeFailureMiddleware };
