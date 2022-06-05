import { SignOptions, sign, verify, Secret } from 'jsonwebtoken';
// import { readFileSync } from 'fs';

// const defaultPassword = readFileSync('../jwt.evaluation.key', { encoding: 'utf8' });
// ! FIX THIS LATTER
// line above not working, don't know why yet
const defaultPassword = 'tnc';
const defaultOptions: SignOptions = {
  expiresIn: '1d',
  algorithm: 'HS256',
};

export default class WebToken<T extends string | object | Buffer> {
  constructor(
    private _secretPassword: Secret = defaultPassword,
    private _config: SignOptions = defaultOptions,
  ) {}

  public generateToken(payload: T) {
    try {
      return sign(payload, this._secretPassword, this._config);
    } catch (error) {
      return { error };
    }
  }

  public validateToken(token: string) {
    try {
      return verify(token, this._secretPassword) as T;
    } catch (error) {
      return { error };
    }
  }
}

export {
  defaultPassword,
  defaultOptions,
};
