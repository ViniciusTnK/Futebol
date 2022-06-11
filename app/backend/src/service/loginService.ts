import bcrypt = require('bcryptjs');
import { StatusCodes } from 'http-status-codes';
import { defaultErrorMsg } from '../utils/errorMessages';
import User from '../database/models/user';

function unauthorized() {
  return defaultErrorMsg(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
}

async function validateLogin(email: string, receivedPassword: string) {
  try {
    const user = await User.findOne({ where: { email } });

    if (user === null) return unauthorized();

    const valid = bcrypt.compareSync(receivedPassword, user.password);

    return valid ? user : unauthorized();
  } catch (error) {
    return { error };
  }
}

export default {
  validateLogin,
};
