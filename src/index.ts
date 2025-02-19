import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
app.use(express.json());
app.use(cors());
app.use(helmet());
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
