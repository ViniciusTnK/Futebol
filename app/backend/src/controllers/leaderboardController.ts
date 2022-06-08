import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { leaderboardService } from '../service';

const { OK, NOT_FOUND } = StatusCodes;

async function getLeaderboard(req: Request, res: Response, next: NextFunction) {
  const { place } = req.params;

  if (place !== 'home' && place !== 'away') {
    return res.status(NOT_FOUND).send(`Cannot GET /leaderboard/${place}`);
  }

  const leaderboard = await leaderboardService.getLeaderboard(place);

  if ('error' in leaderboard) return next(leaderboard.error);

  res.status(OK).json(leaderboard);
}

export default {
  getLeaderboard,
};
