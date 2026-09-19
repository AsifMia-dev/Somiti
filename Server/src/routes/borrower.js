const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createBorrower, getBorrowers, updateBorrower, deleteBorrower } = require('../controllers/borrowerController');

router.post('/', authMiddleware, createBorrower);
router.get('/', authMiddleware, getBorrowers);
router.put('/:id', authMiddleware, updateBorrower);
router.delete('/:id', authMiddleware, deleteBorrower);

module.exports = router;
