const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const {balanceSummary} = require('../controllers/dashboardController');

// GET /dashboard/:somitiId/balance-summary
router.get('/:somitiId/balance-summary',authMiddleware, balanceSummary);

module.exports = router;
