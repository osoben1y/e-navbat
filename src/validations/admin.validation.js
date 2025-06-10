import Joi from 'joi';

export const adminValidation = (data) => {
  const admin = Joi.object({
    username: Joi.string().min(4).max(30).required(),
    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      .required(),
  });
  return admin.validate(data);
};
