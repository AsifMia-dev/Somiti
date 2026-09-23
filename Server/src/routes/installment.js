const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const {getCurrentWeekInstcallments} = require('../controllers/installmentController');

router.get('/:somitiId', authMiddleware, getCurrentWeekInstcallments);
// router.post('/:id/collect', authMiddleware, getCurrentWeekInstcallments);

module.exports = router;
