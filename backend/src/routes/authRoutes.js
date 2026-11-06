const express = require('express');
const rateLimit = require('express-rate-limit');
const { login } = require('../controllers/authController');
const router = express.Router();
router.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }), login);
module.exports = router;
