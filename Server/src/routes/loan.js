const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const {
  createLoan,
  getLoans,
} = require('../controllers/loanController');

router.post('/:somitiId', authMiddleware, createLoan);
router.get('/:somitiId',authMiddleware, getLoans);

module.exports = router;
