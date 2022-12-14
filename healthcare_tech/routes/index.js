const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const unirest = require("unirest");
const axios = require('axios');
const User = require('../models/Users');
// Welcome Page(should contain a search bar, button for registering and login)
router.get('/', (req, res) => res.render('welcome'));

// Dashboard (Accessible to pharmacy and hospitals)
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;