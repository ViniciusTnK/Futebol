import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { teamsService } from '../service';

const { OK } = StatusCodes;

async function getall(req: Request, res: Response, next: NextFunction) {
  const teams = await teamsService.getAll();

  if ('error' in teams) return next(teams.error);

  res.status(OK).json(teams);
}

async function getTeam(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  const team = await teamsService.getTeam(id);

  if ('error' in team) return next(team.error);

  res.status(OK).json(team);
}

export default {
  getall,
  getTeam,
};
