import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import loginService from '../service/loginService';
import WebToken from '../JWT';
import { UserInterface } from '../interface/modelsInterfaces';

const userDefaultWebToken = new WebToken<UserInterface>();

async function login(req: Request, res: Response, next: NextFunction) {
  const { email: receivedEmail, password: receivedPassword } = req.body;

  const user = await loginService.validateLogin(receivedEmail, receivedPassword);
  if ('error' in user) return next(user.error);

  const { id, username, email, role } = user;

  const token = userDefaultWebToken.generateToken({
    id, username, email, password: receivedPassword, role,
  });

  res.status(StatusCodes.OK).json({
    user: { id, username, email, role },
    token,
  });
}

export default {
  login,
};
