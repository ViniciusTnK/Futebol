import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
// @ts-ignore
import bcrypt = require('bcryptjs');

import app from '../server';
import User from '../database/models/user';

import { Response } from 'superagent';
import { StatusCodes } from 'http-status-codes';
import WebToken from '../JWT';

chai.use(chaiHttp);

const { expect } = chai;

const defaultWebToken = new WebToken()

const validPassword = '1234567';
const invalidPassword = '123';
const wrongPassword = '111111111'

const validEmail = 'admin@admin.com';
const invalidEmail = 'abc@12.3'

const validLogin = {
  email: validEmail,
  password: validPassword,
}

const defaultUser = {
  id: 123,
  role: 'atacante',
  username: 'xablau',
  email: validEmail,
};

function returnUser({ id, role, username, email, password }: User) {
  return { id, role, username, email, password };
}

const { OK, BAD_REQUEST, UNAUTHORIZED } = StatusCodes;

describe("Test '/login' POST route", () => {

  it("when the request has valid inputs: should return the user, a token and status 200", async () => {
    sinon
    .stub(User, 'findOne')
    .resolves({ ...defaultUser, password: bcrypt.hashSync(validPassword) } as User);

    const chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(validLogin);

    const { status, body: { token, user } } = chaiHttpResponse;
    const userInToken = returnUser(defaultWebToken.validateToken(token) as User);

    expect(user).to.deep.equal(defaultUser);
    expect(userInToken).to.deep.equal({ ...defaultUser, password: validPassword });
    expect(status).to.equal(OK);

    sinon.restore();
  });

  const emailRequired = '"email" is required';
  it(`when no email is sent: should return status ${BAD_REQUEST} and the message: ${emailRequired}`, async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ password: validPassword });

    const { status, body: { message } } = chaiHttpResponse;

    expect(message).to.equal(emailRequired);
    expect(status).to.equal(BAD_REQUEST);
  });

  const passwordRequired = '"password" is required';
  it(`when no password is sent: should return status ${BAD_REQUEST} and the message: ${passwordRequired}`, async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: validEmail });

    const { status, body: { message } } = chaiHttpResponse;

    expect(message).to.equal(passwordRequired);
    expect(status).to.equal(BAD_REQUEST);
  });

  const isEmpty = 'All fields must be filled';
  it(`when no email or password is empty: should return status ${BAD_REQUEST} and the message: ${isEmpty}`, async () => {
    const chaiHttpResponseEmail = await chai
      .request(app)
      .post('/login')
      .send({ ...validLogin, email: '' });

    const { status: emailStatus, body: { message: emailMessage } } = chaiHttpResponseEmail;

    expect(emailStatus).to.equal(BAD_REQUEST);
    expect(emailMessage).to.equal(isEmpty);

    const chaiHttpResponsePassword = await chai
      .request(app)
      .post('/login')
      .send({ ...validLogin, email: '' });

    const { status: passwordStatus, body: { message: passwordMessage } } = chaiHttpResponsePassword;

    expect(passwordMessage).to.equal(isEmpty);
    expect(passwordStatus).to.equal(BAD_REQUEST);
  });

  const incorretInput = 'Incorrect email or password';
  it(`when the user dosen't exists: should return status ${UNAUTHORIZED} and the message: ${incorretInput}`, async () => {
    sinon
    .stub(User, 'findOne')
    .resolves(null);
    
    const chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(validLogin);

    const { status, body: { message } } = chaiHttpResponse;

    expect(message).to.equal(incorretInput);
    expect(status).to.equal(UNAUTHORIZED);
    
    sinon.restore();
  });

  it(`when the password is incorrect: should return status ${UNAUTHORIZED} and the message: ${incorretInput}`, async () => {
    sinon
    .stub(User, 'findOne')
    .resolves({ ...defaultUser, password: bcrypt.hashSync(validPassword) } as User);
    
    const chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ ...validLogin, password: wrongPassword });

    const { status, body: { message } } = chaiHttpResponse;

    expect(message).to.equal(incorretInput);
    expect(status).to.equal(UNAUTHORIZED);
    
    sinon.restore();
  });
});

describe("Test '/login/validate' GET route", () => {
  it(`when the authorization is valid: should return ${OK}`, async () => {
    sinon
    .stub(User, 'findOne')
    .resolves({ ...defaultUser, password: bcrypt.hashSync(validPassword) } as User);

    const { body: { token } } = await chai
      .request(app)
      .post('/login')
      .send(validLogin);

    expect(typeof token).to.equal('string');

    const { text, status } = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', token);

    expect(text).to.equal(defaultUser.role);
    expect(status).to.equal(OK);
    
    sinon.restore();
  });

  const invalidAuthorization = 'invalid authorization';
  it(`when no authorization is sent: should return ${BAD_REQUEST} and the message: ${invalidAuthorization}`, async () => {
    const { body: { message }, status } = await chai
      .request(app)
      .get('/login/validate')

    expect(message).to.equal(invalidAuthorization);
    expect(status).to.equal(BAD_REQUEST);
  });
});
