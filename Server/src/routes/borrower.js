const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createBorrower, getBorrowers, getEligibleBorrowers } = require('../controllers/borrowerController');

router.post('/:somitiId', authMiddleware, createBorrower);
router.get('/:somitiId', authMiddleware, getBorrowers);
router.get('/:somitiId/eligible', authMiddleware, getEligibleBorrowers);

module.exports = router;
