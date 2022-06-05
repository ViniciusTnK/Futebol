import * as express from 'express';
import { RouterAndURL, validURL } from './types/routerTypes';
import routes from './routes';

class App {
  private _app: express.Express;

  constructor(routers: RouterAndURL[] = []) {
    this._app = express();
    this.config();
    routers.forEach(({ url, router }) => this._app.use(url, router));
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this._app.use(accessControl);
    this._app.use(express.json());
  }

  public useRouter(url: validURL, router: express.Router) {
    this._app.use(url, router);
  }

  get app() {
    return this._app;
  }

  public start(PORT: string | number):void {
    this._app.listen(PORT);
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App(routes);
