require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};
