import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import app from '../server';
import Match from '../database/models/match';

import { Response } from 'superagent';
import { StatusCodes } from 'http-status-codes';
import Team from '../database/models/team';

chai.use(chaiHttp);

const { expect } = chai;

const { OK } = StatusCodes;

function efficiency(points: number, matches: number) {
  return Math.round((points / (matches * 3)) * 100 * 100) / 100;
}

const teamHome = { id: 1, teamName: 'home' };
const teamAway = { id: 2, teamName: 'away' };

const matches = [{
  homeTeam: 1,
  homeTeamGoals: 4,
  awayTeam: 2,
  awayTeamGoals: 2,
}, {
  homeTeam: 2,
  homeTeamGoals: 1,
  awayTeam: 1,
  awayTeamGoals: 0,
}
];

const expectedResultAll = [
  {
    name: teamHome.teamName,
    totalPoints: 3,
    totalGames: 2,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 4,
    goalsOwn: 3,
    goalsBalance: 1,
    efficiency: efficiency(3, 2),
  },
  {
    name: teamAway.teamName,
    totalPoints: 3,
    totalGames: 2,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 3,
    goalsOwn: 4,
    goalsBalance: -1,
    efficiency: efficiency(3, 2),
  }
]

const expectedResultHome =   [
  {
  name: teamHome.teamName,
  totalPoints: 3,
  totalGames: 1,
  totalVictories: 1,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 4,
  goalsOwn: 2,
  goalsBalance: 2,
  efficiency: efficiency(3, 1),
}, {
  name: teamAway.teamName,
  totalPoints: 3,
  totalGames: 1,
  totalVictories: 1,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 1,
  goalsOwn: 0,
  goalsBalance: 1,
  efficiency: efficiency(3, 1),
}]

describe("Test '/leaderboard/home' GET route", () => {
  it(`When all goes well: should return status ${OK} and all data`, async () => {
    sinon
    .stub(Match, 'findAll')
    .resolves(matches as Match[]);

    sinon
    .stub(Team, 'findAll')
    .resolves([teamHome, teamAway] as Team[]);
    
    const { body, status } = await chai
      .request(app)
      .get('/leaderboard/home');
  
    expect(body).to.deep.equal(expectedResultHome);
    expect(status).to.equal(OK);
    
    sinon.restore();
  });
});

describe("Test '/leaderboard' GET route", () => {
  it(`When all goes well: should return status ${OK} and all data`, async () => {
    sinon
    .stub(Match, 'findAll')
    .resolves(matches as Match[]);

    sinon
    .stub(Team, 'findAll')
    .resolves([teamHome, teamAway] as Team[]);
    
    const { body, status } = await chai
      .request(app)
      .get('/leaderboard');
  
    expect(body).to.deep.equal(expectedResultAll);
    expect(status).to.equal(OK);
    
    sinon.restore();
  });
});