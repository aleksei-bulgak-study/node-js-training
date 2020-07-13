import { NextFunction, Request, Response } from 'express';
import { InternalError, NotFoundError } from '../models';

const internalError = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (error instanceof InternalError) {
    response.status(error.type).json({ message: error.message });
    return;
  } else if (error instanceof NotFoundError) {
    response.status(404).json({ message: error.message });
    return;
  }
  next(error);
};

export default internalError;
