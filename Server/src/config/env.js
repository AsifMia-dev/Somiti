require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  SESSION_SECRET: process.env.SESSION_SECRET || 'change-me',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};
