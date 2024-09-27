const express = require('express');
const router = express.Router();
const { fetchAllUsers } = require('../controller/userController');

router.get('/fetchAllUsers', fetchAllUsers)

module.exports = router;