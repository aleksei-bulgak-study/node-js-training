import { NextFunction, Request, Response } from 'express';
import { InternalError } from '../models';

const internalError = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (error instanceof InternalError) {
    response.status(error.type).json({ message: error.message });
  }
  next(error);
};

export default internalError;
