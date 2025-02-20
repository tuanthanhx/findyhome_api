import mongoose from 'mongoose';
import app from './app';
import config from './config/config';

// MongoDB Connection
mongoose
  .connect(config.mongoUri)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection Failed:', err));

app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`),
);
