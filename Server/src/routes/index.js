const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const somitiRouter = require('./somiti');

router.use('/auth', authRouter);
router.use('/somitis', somitiRouter);

module.exports = router;
