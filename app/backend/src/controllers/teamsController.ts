import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { teamsService } from '../service';

const { OK } = StatusCodes;

async function getall(req: Request, res: Response, next: NextFunction) {
  const teams = await teamsService.getAll();

  if ('error' in teams) return next(teams.error);

  res.status(OK).json(teams);
}

export default {
  getall,
};
