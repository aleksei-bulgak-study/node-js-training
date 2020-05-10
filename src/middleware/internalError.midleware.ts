import { NextFunction, Request, Response } from 'express';
import InternalError from '../error/internal.error';

export default (error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof InternalError) {
    response.status(error.type).json({ message: error.message });
  }
  next(error);
};
