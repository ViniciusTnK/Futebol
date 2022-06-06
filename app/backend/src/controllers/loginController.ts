import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { loginService } from '../service';
import WebToken from '../JWT';
import { UserInterface } from '../interface/modelsInterfaces';

const userDefaultWebToken = new WebToken<UserInterface>();

const { OK, BAD_REQUEST } = StatusCodes;

async function login(req: Request, res: Response, next: NextFunction) {
  const { email: receivedEmail, password: receivedPassword } = req.body;

  const user = await loginService.validateLogin(receivedEmail, receivedPassword);
  if ('error' in user) return next(user.error);

  const { id, username, email, role } = user;

  const token = userDefaultWebToken.generateToken({
    id, username, email, password: receivedPassword, role,
  });

  res.status(OK).json({
    user: { id, username, email, role },
    token,
  });
}

async function validate(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    return res.status(BAD_REQUEST).json({ message: 'invalid authorization' });
  }

  const user = userDefaultWebToken.validateToken(authorization);

  if ('error' in user) return next(user.error);

  res.status(OK).send(user.role);
}

export default {
  login,
  validate,
};
