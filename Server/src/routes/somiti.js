const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { create } = require('../controllers/somitiController');

router.post('/', authMiddleware, create);

module.exports = router;
