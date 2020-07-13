import Joi from '@hapi/joi';
import { permissionValueSchema } from './permission.model';

const groupSchema = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
  permissions: Joi.array().items(permissionValueSchema).min(1).unique().required(),
  users: Joi.array().items(Joi.string).optional(),
});

const createGroupSchema = Joi.object({
  id: Joi.string().uuid(),
  name: Joi.string().trim().required(),
  permissions: Joi.array().items(permissionValueSchema).min(1).unique().required(),
  users: Joi.array().empty().optional(),
});
export default interface Group {
  id: string;
  name: string;
  permissions: Array<string>;
  users: Array<string>;
}

export { groupSchema, createGroupSchema };
