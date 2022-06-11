import Team from '../database/models/team';
import Match from '../database/models/match';
import { defaultErrorMsg } from '../utils/errorMessages';
import matchesService from './matchesService';
import teamsService from './teamsService';

type places = 'away' | 'home' | 'all';

function isError(obj: unknown[] | { error: unknown }): obj is { error: unknown } {
  return ('error' in obj);
}

function getGoals(currTeam: number, match: Match) {
  const { homeTeam, homeTeamGoals: home, awayTeamGoals: away } = match;
  return homeTeam === currTeam ? [home, away] : [away, home];
}

function getMatchResult(myGoals: number, enemyGoals: number) {
  if (myGoals === enemyGoals) return 'totalDraws';
  return myGoals > enemyGoals ? 'totalVictories' : 'totalLosses';
}

const pointsByResult = { totalLosses: 0, totalDraws: 1, totalVictories: 3 };

function getDataFromMatches(id: number, matches: Match[]) {
  return matches.reduce((acc, currMatch) => {
    const [myGoals, enemyGoals] = getGoals(id, currMatch);
    const matchResult = getMatchResult(myGoals, enemyGoals);
    const points = pointsByResult[matchResult];

    acc.totalPoints += points;
    acc[matchResult] += 1;
    acc.goalsFavor += myGoals;
    acc.goalsOwn += enemyGoals;
    return acc;
  }, { // initial value
    totalPoints: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
  });
}

function efficiency(points: number, matches: number) {
  const maxPointsPerMatch = 3;
  return Math.round((points / (matches * maxPointsPerMatch)) * 100 * 100) / 100;
}

function getMatchesByPlace(place: places, id: number, matches: Match[]) {
  if (place === 'all') {
    return matches.filter(({ homeTeam, awayTeam }) => homeTeam === id || awayTeam === id);
  }

  const team = (place === 'home') ? 'homeTeam' : 'awayTeam';
  return matches.filter(({ [team]: teamId }) => teamId === id);
}

function getAllInfo(teams: Team[], matches: Match[], place: places) {
  return teams.map(({ id, teamName }) => {
    const thisTeamMatches = getMatchesByPlace(place, id, matches);
    const totalGames = thisTeamMatches.length;
    const dataFromMatches = getDataFromMatches(id, thisTeamMatches);

    const { goalsFavor, goalsOwn, totalPoints } = dataFromMatches;

    return {
      ...dataFromMatches,
      name: teamName,
      totalGames,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: efficiency(totalPoints, totalGames),
    };
  });
}

async function getLeaderboardByPlace(place: places) {
  try {
    const [teams, matches] = await Promise.all([teamsService.getAll(), matchesService.getAll()]);
    if (isError(teams) || isError(matches)) return defaultErrorMsg();

    const finishedMatches = matches.filter(({ inProgress }) => !inProgress);
    const result = getAllInfo(teams, finishedMatches, place);

    const criteriasOrder = [
      'totalPoints', 'totalVictories', 'goalsBalance', 'goalsFavor', 'goalsOwn',
    ] as const; // readonly so typescript can infer literal types from the array

    const loops = criteriasOrder.length;
    return result.sort((a, b) => {
      for (let i = 0; i < loops; i += 1) {
        const currCriteria = criteriasOrder[i];
        const diff = b[currCriteria] - a[currCriteria]; // (b - a) so it descend

        // if diff equals 0 then diff is falsy
        if (diff) return diff;
      }
      return 0;
    });
  } catch (error) { return { error }; }
}

export default {
  getLeaderboardByPlace,
};
