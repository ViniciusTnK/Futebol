import { StatusCodes } from 'http-status-codes';
import { defaultErrorMsg, notFound } from '../errorMessages';
import Match from '../database/models/match';
import Team from '../database/models/team';
import teamsService from './teamsService';
import { MatchInterface } from '../interface/modelsInterfaces';

const { NOT_FOUND } = StatusCodes;

async function getAll() {
  try {
    const matches = await Match.findAll({ include: [
      { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
      { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
    ] });

    if (matches === null) return notFound('matches');

    return matches;

    // code bellow is to test if the test works when the using lazy loading
    // // const matchesResult = await Match.findAll();

    // // const matches = matchesResult.map((
    // //   { id, awayTeam, awayTeamGoals, homeTeam, homeTeamGoals, inProgress },
    // // ) => ({ id, awayTeam, awayTeamGoals, homeTeam, homeTeamGoals, inProgress }));

    // // const teamsIds = matches.reduce((acc, curr) => {
    // //   acc.push(curr.homeTeam);
    // //   acc.push(curr.awayTeam);
    // //   return acc;
    // // }, <number[]>[]);

    // // const teamsPromisses = teamsIds.map((teamId) => Team.findOne({ where: { id: teamId } }));
    // // const teams = await Promise.all(teamsPromisses) as Team[];

    // // return matches.map((match, i) => {
    // //   const [teamHome, teamAway] = teams.slice(i * 2, i * 2 + 2).map(({ teamName }) => teamName);
    // //   return { ...match, teamHome: { teamName: teamHome }, teamAway: { teamName: teamAway } };
    // // });
  } catch (error) { return { error }; }
}

async function createMatch(data: Match) {
  try {
    // check if both teams exist
    const teamsPromise = [teamsService.getTeam(data.homeTeam), teamsService.getTeam(data.awayTeam)];
    const teams = await Promise.all(teamsPromise);
    const teamIsMissing = teams.some((team) => ('error' in team));

    if (teamIsMissing) return defaultErrorMsg(NOT_FOUND, 'There is no team with such id!');

    const match = await Match.create({ ...data, inProgress: true });
    return match;
  } catch (error) { return { error }; }
}

async function updateMatch(filters: Partial<MatchInterface>, attributes: Partial<MatchInterface>) {
  try {
    return await Match.update(attributes, { where: filters });
  } catch (error) { return { error }; }
}

export default {
  getAll,
  createMatch,
  updateMatch,
};
