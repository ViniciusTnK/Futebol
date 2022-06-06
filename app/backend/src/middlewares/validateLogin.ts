import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi = require('joi');

export default (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const isString = typeof email === 'string' && typeof password === 'string';
  if (isString && (email.length === 0 || password.length === 0)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'All fields must be filled' });
  }

  const loginShema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(7).required(),
  });

  const { error } = loginShema.validate({ email, password });

  // if error is undefined then it dosen't goes to errorHandler
  next(error);
};
