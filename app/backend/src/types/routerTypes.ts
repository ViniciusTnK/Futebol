import { Router } from 'express';

type validURL = `/${string}`;

type RouterAndURL = {
  url: validURL,
  router: Router,
};

export { RouterAndURL, validURL };
