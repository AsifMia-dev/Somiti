const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

const authRouter = require('./auth');
const private = require('./private');

router.use('/auth', authRouter);
router.use('/auth',authMiddleware,private)

module.exports = router;
