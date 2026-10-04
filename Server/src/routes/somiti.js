const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { create, findSomitiByManagerIdController } = require('../controllers/somitiController');

router.post('/', authMiddleware, create);
router.get('/manager/:managerId',authMiddleware, findSomitiByManagerIdController);

module.exports = router;
