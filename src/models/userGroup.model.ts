import Joi from '@hapi/joi';

export const assotiateUserWithGroup = Joi.array().items(Joi.string().uuid().required());
