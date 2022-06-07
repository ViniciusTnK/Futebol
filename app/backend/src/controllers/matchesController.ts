import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { matchesService } from '../service';

const { OK } = StatusCodes;

async function getall(req: Request, res: Response, next: NextFunction) {
  const macthes = await matchesService.getAll();

  if ('error' in macthes) return next(macthes.error);

  res.status(OK).json(macthes);
}

export default {
  getall,
};
