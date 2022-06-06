import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'joi';
import { MyError } from '../types/errorTypes';

function isMyError(err: unknown): err is MyError {
  return (err as MyError).status !== undefined && (err as MyError).message !== undefined;
}

function isError(err: unknown): err is Error {
  return (err as Error).message !== undefined;
}

function isJoi(err: unknown): err is ValidationError {
  return (err as ValidationError).isJoi;
}

export default (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (isMyError(err)) return res.status(err.status).json({ message: err.message });
  if (isJoi(err)) return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });

  const msg = isError(err) ? err.message : JSON.stringify(err);
  console.log(`error: ${msg}`);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('internal server error');
};
