import { StatusCodes } from 'http-status-codes';
import { MyReturn } from './types/errorTypes';

function defaultError(status: number, message: string): MyReturn {
  return {
    error: { status, message },
  };
}

function notFound(param: string) {
  return defaultError(StatusCodes.NOT_FOUND, `${param} not found`);
}

export {
  defaultError,
  notFound,
};
