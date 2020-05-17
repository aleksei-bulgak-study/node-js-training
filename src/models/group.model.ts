import Joi from '@hapi/joi';
import { permissionValueSchema } from './permission.model';

const groupSchema = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
  permissions: Joi.array().items(permissionValueSchema),
});

export default interface Group {
  id: string;
  name: string;
  permissions: Array<string>;
}

export { groupSchema };
