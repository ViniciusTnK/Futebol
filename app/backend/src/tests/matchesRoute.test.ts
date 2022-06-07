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

const { OK, CREATED } = StatusCodes;

const teamHome = { id: 1, teamName: 'home' };
const teamAway = { id: 2, teamName: 'away' };

const matches = [
  {
    id: 1,
    homeTeam: 1,
    homeTeamGoals: 4,
    awayTeam: 2,
    awayTeamGoals: 4,
    inProgress: true,
  },
];

const expectedResult = [
  {
    ...matches[0],
    teamHome: { teamName: teamHome.teamName },
    teamAway: { teamName: teamAway.teamName },
  },
];

const eagerLoadingArgs = { include: [
  { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
  { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
] }

describe("Test '/matches' GET route", () => {
  it(`When all goes well: should return status ${OK} and all matches`, async () => {
    sinon
    .stub(Match, 'findAll')
    .withArgs(eagerLoadingArgs)// eager loading been used
    .resolves(expectedResult as unknown as Match[]) // force to accept
    .withArgs()// lazy loading
    .resolves(matches as Match[]);

    sinon
    .stub(Team, 'findOne')
    .withArgs({ where: { id: teamHome.id }})
    .resolves(teamHome as Team)
    .withArgs({ where: { id: teamAway.id }})
    .resolves(teamAway as Team)
    
    const { body, status } = await chai
      .request(app)
      .get('/matches');
  
    expect(body).to.deep.equal(expectedResult);
    expect(status).to.equal(OK);
    
    sinon.restore();
  });
});

const id = 1;
const match = {
  homeTeam: 1,
  homeTeamGoals: 2,
  awayTeam: 3,
  awayTeamGoals: 4,
  inProgress: true,
};

describe("Test '/matches' POST route", () => {
  it(`When all goes well: should return status ${CREATED} and the match created`, async () => {
    sinon
    .stub(Match, 'create')
    .withArgs(match)
    .resolves({ ...match, id } as Match);
    
    const { body, status } = await chai
      .request(app)
      .post('/matches')
      .send(match);
  
    expect(body).to.deep.equal({ ...match, id });
    expect(status).to.equal(CREATED);
    
    sinon.restore();
  });
});