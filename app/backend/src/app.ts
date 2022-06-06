import * as express from 'express';
import { CorsOptions } from 'cors';
import cors = require('cors');
import { RouterAndURL, validURL } from './types/routerTypes';

const defaultCorsOptions = {
  origin: process.env.FRONT_END || /^http:\/\/localhost:3000(\/.+)?/,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

class App {
  private _app: express.Express;

  constructor(routers: RouterAndURL[] = [], corsOptions: CorsOptions = defaultCorsOptions) {
    this._app = express();
    this.config();
    this._app.use(cors(corsOptions));
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

export default App;

// app export transferred to server.ts
