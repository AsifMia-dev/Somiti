require('dotenv').config();
const http = require('http');
const app = require('./app/app');
const prisma = require('./lib/prisma')

const server = http.createServer(app);

const PORT = process.env.PORT || 3000


const startServer = async () => {
  try {
    await prisma.$connect();
    console.info('Database connected');
    server.listen(PORT, () => {
      if (process.env.DEBUG) console.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

startServer();
