import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ObjectSchema } from '@hapi/joi';
import { Person, ErrorType } from '../model';
import { InternalError } from '../error';

export const validatePerson = (validationSchema: ObjectSchema<Person>): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const person = req.body;
  const id = req.params.id;
  if (id) {
    person.id = id;
  }

  const result = validationSchema.validate(person);
  if (result.error) {
    return next(new InternalError(result.error.message, ErrorType.BAD_REQUEST));
  }
  return next();
};
