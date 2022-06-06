import { StatusCodes } from 'http-status-codes';
import { MyReturn } from './types/errorTypes';

function defaultErrorMsg(status: number, message: string): MyReturn {
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
