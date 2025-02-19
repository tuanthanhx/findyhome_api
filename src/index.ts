import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import config from './config/config';
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

app.use([handleQueries, validateRules]);

// Routes
app.use('/api/v1', routes);

// MongoDB Connection
mongoose
  .connect(config.mongoUri)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection Failed:', err));

app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`),
);
