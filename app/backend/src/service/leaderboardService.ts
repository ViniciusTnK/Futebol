import Team from '../database/models/team';
import Match from '../database/models/match';
import { defaultErrorMsg } from '../errorMessages';
import matchesService from './matchesService';
import teamsService from './teamsService';

type places = 'away' | 'home' | 'all';

function whoIsBigger(a: number, b: number) {
  // 1 for a, -1 for b
  return (a > b) ? 1 : -1;
}

function orderByCriteria(a: number[], b: number[]) {
  const [aPoints, aVict, aBal, aFavor, aOwn] = a;
  const [bPoints, bVict, bBal, bFavor, bOwn] = b;

  if (aPoints !== bPoints) return whoIsBigger(aPoints, bPoints); // Points
  if (aVict !== bVict) return whoIsBigger(aVict, bVict); // Victory
  if (aBal !== bBal) return whoIsBigger(aBal, bBal); // Balance
  if (aFavor !== bFavor) return whoIsBigger(aFavor, bFavor); // Goals Favor
  if (aOwn !== bOwn) return whoIsBigger(aOwn, bOwn); // Goals Own

  return 0;
}

function isError(obj: unknown[] | { error: unknown }): obj is { error: unknown } {
  return ('error' in obj);
}

function getGoals(id: number, match: Match) {
  const { homeTeam, homeTeamGoals: home, awayTeamGoals: away } = match;
  return homeTeam === id ? [home, away] : [away, home];
}

function getMatchResult(myGoals: number, enemyGoals: number) {
  if (myGoals === enemyGoals) return 'totalDraws';
  return myGoals > enemyGoals ? 'totalVictories' : 'totalLosses';
}

const pointsByResult = { totalLosses: 0, totalDraws: 1, totalVictories: 3 };

function getData(id: number, matches: Match[]) {
  return matches.reduce((acc, curr) => {
    const [myGoals, enemyGoals] = getGoals(id, curr);
    const matchResult = getMatchResult(myGoals, enemyGoals);
    const points = pointsByResult[matchResult];

    acc.totalPoints += points;
    acc[matchResult] += 1;
    acc.goalsFavor += myGoals;
    acc.goalsOwn += enemyGoals;
    return acc;
  }, {
    totalPoints: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
  });
}

function efficiency(points: number, matches: number) {
  return Math.round((points / (matches * 3)) * 100 * 100) / 100;
}

function getMatchesByPlace(place: places, id: number, matches: Match[]) {
  if (place === 'all') {
    return matches.filter(({ homeTeam, awayTeam }) => homeTeam === id || awayTeam === id);
  }

  const team = place === 'home' ? 'homeTeam' : 'awayTeam';
  return matches.filter(({ [team]: teamId }) => teamId === id);
}

function getAllInfo(teams: Team[], matches: Match[], place: places) {
  return teams.map(({ id, teamName }) => {
    const thisTeamMatches = getMatchesByPlace(place, id, matches);
    const totalGames = thisTeamMatches.length;
    const data = getData(id, thisTeamMatches);

    const { goalsFavor, goalsOwn, totalPoints } = data;

    return {
      ...data,
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

    return result.sort((a, b): number => {
      const {
        totalPoints: aP, totalVictories: aV, goalsBalance: aB, goalsFavor: aFavor, goalsOwn: aOwn,
      } = a;
      const {
        totalPoints: bP, totalVictories: bV, goalsBalance: bB, goalsFavor: bFavor, goalsOwn: bOwn,
      } = b;
      const array = [aP, aV, aB, aFavor, aOwn];
      const brray = [bP, bV, bB, bFavor, bOwn];

      // negate to decrease
      return -1 * orderByCriteria(array, brray);
    });
  } catch (error) { return { error }; }
}

export default {
  getLeaderboardByPlace,
};
