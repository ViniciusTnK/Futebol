import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import app from '../server';
import Team from '../database/models/team';

import { Response } from 'superagent';
import { StatusCodes } from 'http-status-codes';

chai.use(chaiHttp);

const { expect } = chai;

const teams = [
  { id: 1, teamName: 'a'},
  { id: 2, teamName: 'b'},
  { id: 3, teamName: 'c'},
]

const { OK } = StatusCodes;


describe("Test '/login' GET route", () => {
  it(`When all goes well: should return status ${OK} and all teams`, async () => {
    sinon
    .stub(Team, 'findAll')
    .resolves(teams as Team[]);
  
    const { body, status } = await chai
      .request(app)
      .get('/teams');
  
    expect(body).to.deep.equal(teams);
    expect(status).to.equal(OK);
    
    sinon.restore();
  });
});
