const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createBorrower, getBorrowers } = require('../controllers/borrowerController');

router.post('/:somitiId', authMiddleware, createBorrower);
router.get('/:somitiId', authMiddleware, getBorrowers);

module.exports = router;
