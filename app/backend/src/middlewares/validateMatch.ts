import { Request, Response, NextFunction } from 'express';
import Joi = require('joi');

export default (req: Request, res: Response, next: NextFunction) => {
  const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress } = req.body;
  const match = { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress };

  const matchShema = Joi.object({
    homeTeam: Joi.number().required(),
    homeTeamGoals: Joi.number().required(),
    awayTeam: Joi.number().required(),
    awayTeamGoals: Joi.number().required(),
    inProgress: Joi.bool().required(),
  });

  const { error } = matchShema.validate(match);

  // if error is undefined then it dosen't goes to errorHandler
  req.body.match = match;
  next(error);
};
