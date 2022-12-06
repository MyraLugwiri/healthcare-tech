const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const unirest = require("unirest");
const axios = require('axios');
const User = require('../models/Users');
// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// getting Patient's current location
// axios.get('http://ipwhois.app/json/')
//   .then(({ data }) => {
        // const latitude = data.latitude
  //     const longitude = data.longitude
// }

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;