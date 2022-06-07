// import { StatusCodes } from 'http-status-codes';
import { notFound } from '../errorMessages';
import Match from '../database/models/match';
import Team from '../database/models/team';

// const { NOT_FOUND } = StatusCodes;

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
    const match = await Match.create(data);
    return match;
  } catch (error) { return { error }; }
}

async function updateInProgress(id: number) {
  try {
    return await Match.update({ inProgress: false }, { where: { id } });
  } catch (error) { return { error }; }
}

export default {
  getAll,
  createMatch,
  updateInProgress,
};
