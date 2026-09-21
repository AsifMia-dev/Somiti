const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const {
  createLoan,
  getLoans,
  getLoansByBorrower,
  getLoanById,
  updateLoan,
  deleteLoan,
} = require('../controllers/loanController');

router.post('/', authMiddleware, createLoan);
router.get('/', authMiddleware, getLoans);
router.get('/:id', authMiddleware, getLoanById);
router.get('/:borrowerId', authMiddleware, getLoansByBorrower);
router.put('/:id', authMiddleware, updateLoan);
router.delete('/:id', authMiddleware, deleteLoan);

module.exports = router;
