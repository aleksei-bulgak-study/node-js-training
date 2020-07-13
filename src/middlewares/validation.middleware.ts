import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ObjectSchema, ArraySchema } from '@hapi/joi';
import { ErrorType, InternalError } from '../models';

export const validate = <T>(validationSchema: ObjectSchema<T>): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const entity = req.body;
  const id = req.params.id;
  if (id) {
    entity.id = id;
  }

  const result = validationSchema.validate(entity);
  if (result.error) {
    return next(new InternalError(result.error.message, ErrorType.BAD_REQUEST));
  }
  return next();
};

export const validateArray = <T>(validationSchema: ArraySchema): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const entity = req.body;

  const result = validationSchema.validate(entity);
  if (result.error) {
    return next(new InternalError(result.error.message, ErrorType.BAD_REQUEST));
  }
  return next();
};
