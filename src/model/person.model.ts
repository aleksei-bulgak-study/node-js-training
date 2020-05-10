import Joi from '@hapi/joi';

const fullPersonSchema = Joi.object({
  id: Joi.string().uuid().required(),
  login: Joi.string().trim().required(),
  password: Joi.string().alphanum().trim().required(),
  age: Joi.number().min(4).max(130).required(),
  isDeleted: Joi.boolean().required(),
});

const createPersonSchema = Joi.object({
  id: Joi.string().uuid(),
  login: Joi.string().trim().required(),
  password: Joi.string().alphanum().trim().required(),
  age: Joi.number().min(4).max(130).required(),
  isDeleted: Joi.boolean().required(),
});

interface Person {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export { fullPersonSchema, createPersonSchema };
export default Person;
