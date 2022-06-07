import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Match from '../database/models/match';
import { matchesService } from '../service';

const { OK, CREATED, BAD_REQUEST } = StatusCodes;

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

async function updateInProgress(req: Request, res: Response, next: NextFunction) {
  const { id: bruteId } = req.params;

  const notValid = typeof bruteId !== 'number' && typeof bruteId !== 'string';
  if (notValid) return res.status(BAD_REQUEST).json({ message: 'invalid param' });

  const id = parseInt(bruteId, 10);

  const result = await matchesService.updateMatch({ id }, { inProgress: false });

  if ('error' in result) return next(result.error);

  res.status(OK).json({ message: 'Finished' });
}

export default {
  getall,
  createMatch,
  updateInProgress,
};
