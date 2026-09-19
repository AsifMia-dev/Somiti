const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const somitiRouter = require('./somiti');
const dashboardRouter = require('./dashboard');

router.use('/auth', authRouter);
router.use('/somitis', somitiRouter);
router.use('/dashboard', dashboardRouter);

module.exports = router;
