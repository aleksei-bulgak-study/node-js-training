import { Request, Response, NextFunction } from 'express';

export default (error: Error, request: Request, response: Response, next: NextFunction): void => {
  if (error) {
    response.status(500).json({ message: error.message });
    return;
  }
  next(error);
};
