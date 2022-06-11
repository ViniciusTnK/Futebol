import App from './app';
import 'dotenv/config';
import defaultError from './middlewares/defaultError';
import { loginRouter, teamsRouter, matchesRouter, leaderboardRouter } from './routers';
import { RouterAndURL } from './types/routerTypes';

const routers: RouterAndURL[] = [
  ['/login', loginRouter],
  ['/teams', teamsRouter],
  ['/matches', matchesRouter],
  ['/leaderboard', leaderboardRouter],
];

const PORT = process.env.PORT || 3001;

const server = new App(routers);

server.app.use(defaultError);

server.start(PORT);

// A execução dos testes de cobertura depende dessa exportação
export default server.app;
