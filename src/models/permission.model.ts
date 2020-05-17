import Joi from '@hapi/joi';
const permissionValueSchema = Joi.string().valid(
  'READ',
  'WRITE',
  'DELETE',
  'SHARE',
  'UPLOAD_FILES'
);
const permissionSchema = Joi.object({
  id: Joi.number().required(),
  value: permissionValueSchema.required(),
});

export default interface Permission {
  id: number;
  value: string;
}

export { permissionSchema, permissionValueSchema };
