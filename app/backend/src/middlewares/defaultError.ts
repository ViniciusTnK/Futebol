import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MyError } from '../types/errorTypes';

function isObject(param: unknown) {
  return typeof param === 'object';
}

function isMyError(err: unknown): err is MyError {
  if (!isObject(err)) return false;
  return (err as MyError).status !== undefined && (err as MyError).message !== undefined;
}

function isError(err: unknown): err is Error {
  if (!isObject(err)) return false;
  return (err as Error).message !== undefined;
}

export default (err: unknown | MyError, req: Request, res: Response, _next: NextFunction) => {
  if (isMyError(err)) return res.status(err.status).json({ message: err.message });

  const msg = isError(err) ? err.message : JSON.stringify(err);
  console.log(msg);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('internal server error');
};
