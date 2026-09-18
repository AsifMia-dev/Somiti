const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

const authRouter = require('./auth');

router.use('/auth', authRouter);

module.exports = router;
