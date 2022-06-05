import { App } from './app';
import 'dotenv/config';
import routes from './routes';

const PORT = process.env.PORT || 3001;

new App(routes).start(PORT);
