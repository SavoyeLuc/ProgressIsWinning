const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');


router.post('/register', auth, authController.register);
router.post('/login', auth, authController.login);

module.exports = router;
