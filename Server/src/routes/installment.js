const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const {
  getInstallments,
  collectInstallment,
} = require('../controllers/installmentController');

router.get('/', authMiddleware, getInstallments);
router.post('/:id/collect', authMiddleware, collectInstallment);

module.exports = router;
