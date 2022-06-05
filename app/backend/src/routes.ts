import { loginRouter } from './routers';
import { RouterAndURL } from './types/routerTypes';

const routers: RouterAndURL[] = [
  { url: '/login', router: loginRouter },
];

export default routers;

// I can't create 'routers' inside server.ts, where it would make more sense,
// as it would cause a dependency cycle as I need it in server.ts and app.ts
