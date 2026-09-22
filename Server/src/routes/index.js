const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const somitiRouter = require('./somiti');
const dashboardRouter = require('./dashboard');
const borrowerRouter = require('./borrower');
const loanRouter = require('./loan');


router.use('/auth', authRouter);
router.use('/somitis', somitiRouter);
router.use('/dashboard', dashboardRouter);
router.use('/borrowers', borrowerRouter);
router.use('/loans', loanRouter);


module.exports = router;
