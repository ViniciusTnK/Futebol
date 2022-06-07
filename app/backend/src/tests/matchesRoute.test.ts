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

const { OK, CREATED, UNAUTHORIZED } = StatusCodes;

const teamHome = { id: 1, teamName: 'home' };
const teamAway = { id: 2, teamName: 'away' };

const id = 1;

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

  const invalidMatch = {
    homeTeam: 1,
    homeTeamGoals: 2,
    awayTeam: 1,
    awayTeamGoals: 4,
    inProgress: true,
  };

  const message = 'It is not possible to create a match with two equal teams';
  it(`if the two teams received are the same: should return status ${UNAUTHORIZED} and the message: ${message}`, async () => {
    const { body, status } = await chai
      .request(app)
      .post('/matches')
      .send(invalidMatch);
  
    expect(body.message).to.equal(message);
    expect(status).to.equal(UNAUTHORIZED);
  });
});

const message = "Finished";
describe("Test '/matches/:id/finish' PATCH route", () => {
  it(`When all goes well: should return status ${OK} and the message: ${message}`, async () => {
    sinon
    .stub(Match, 'update')
    .withArgs({ inProgress: false }, { where: { id } })
    .resolves([0, []]);
    
    const { body, status } = await chai
      .request(app)
      .patch(`/matches/${id}/finish`);
  
    expect(body).to.deep.equal({ message });
    expect(status).to.equal(OK);
    
    sinon.restore();
  });
});

const update = {
  homeTeamGoals: 3,
  awayTeamGoals: 1,
}

describe("Test '/matches/:id' PATCH route", () => {
  it(`When all goes well: should return status ${OK}`, async () => {
    sinon
    .stub(Match, 'update')
    .withArgs(update, { where: { id } })
    .resolves([0, []]);
    
    const { status } = await chai
      .request(app)
      .patch(`/matches/${id}`)
      .send(update);
  
    expect(status).to.equal(OK);
    
    sinon.restore();
  });
});