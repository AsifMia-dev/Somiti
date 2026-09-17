const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// Centralized routes from /src/routes
const routes = require('../routes');
router.use('/', routes);

router.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

router.get('/health', (req, res) => {
  res.json({ message: 'Server is healthy' });
});

module.exports = router;
