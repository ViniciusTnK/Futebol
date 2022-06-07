import { StatusCodes } from 'http-status-codes';
import { MyReturn } from './types/errorTypes';

function defaultErrorMsg(status = 500, message = 'internal server error'): MyReturn {
  return {
    error: { status, message },
  };
}

function notFound(param: string) {
  return defaultErrorMsg(StatusCodes.NOT_FOUND, `${param} not found`);
}

export {
  defaultErrorMsg,
  notFound,
};
