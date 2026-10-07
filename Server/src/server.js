require('dotenv').config();
const http = require('http');
const app = require('./app/app');
const prisma = require('./lib/prisma')

<<<<<<< HEAD
const { startOverdueJob } = require('./jobs/startOverdueJob');

=======
>>>>>>> f1efd2809565f4182c0fff0fd5436fb67720af76
const server = http.createServer(app);

const PORT = process.env.PORT || 3000


const startServer = async () => {
  try {
    await prisma.$connect();
    console.info('Database connected');
    server.listen(PORT, () => {
      if (process.env.DEBUG) console.info(`Server running on port ${PORT}`);
    });
<<<<<<< HEAD
    startOverdueJob();
=======
>>>>>>> f1efd2809565f4182c0fff0fd5436fb67720af76
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

startServer();
