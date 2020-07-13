import Joi from '@hapi/joi';

const authRequestSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required(),
});

export default interface AuthRequest {
  login: string;
  password: string;
}

export { authRequestSchema };
