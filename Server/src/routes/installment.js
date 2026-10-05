const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const {getCollectionSheet} = require('../controllers/installmentController');
const {collectInstallment} = require('../controllers/installmentController');

router.get('/:somitiId', authMiddleware, getCollectionSheet);
router.post('/:somitiId/:installmentId/collect', authMiddleware, collectInstallment);
// router.post('/:id/collect', authMiddleware, getCollectionSheet);

module.exports = router;
