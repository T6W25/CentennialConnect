const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/join', eventController.joinEvent);

module.exports = router;
