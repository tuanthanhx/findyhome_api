import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import routes from './routes';

import {
  handleQueries,
  validateRules,
} from './middlewares/validate.middleware';

// App
const app = express();

// Middleware

app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(xss());
app.use(ExpressMongoSanitize());
app.use(compression());

app.use(...handleQueries, validateRules);

// Routes
app.use('/api/v1', routes);

export default app;
