import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Match from '../database/models/match';
import { matchesService } from '../service';

const { OK, CREATED } = StatusCodes;

async function getall(req: Request, res: Response, next: NextFunction) {
  const macthes = await matchesService.getAll();

  if ('error' in macthes) return next(macthes.error);

  res.status(OK).json(macthes);
}

async function createMatch(req: Request, res: Response, next: NextFunction) {
  const match = await matchesService.createMatch(req.body.match as Match);

  if ('error' in match) return next(match.error);

  res.status(CREATED).json(match);
}

export default {
  getall,
  createMatch,
};
