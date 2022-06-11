import { Router } from 'express';

type validURL = `/${string}`;

type RouterAndURL = [
  validURL,
  Router,
];

export { RouterAndURL, validURL };
