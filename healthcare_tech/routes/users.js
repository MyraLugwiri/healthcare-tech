const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const axios = require('axios');
// Load User model
const User = require('../models/Users');
const { forwardAuthenticated } = require('../config/auth');

// Login Page (Will be a button on the welcome page)
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page (Will be a button on the welcome page)
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/registration', (req, res) => {


  const { name, email, role, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !role || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // if (password.length < 6) {
  //   errors.push({ msg: 'Password must be at least 6 characters' });
  // }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          role,
          password,
        });
        console.log(newUser)
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Add medication to the 

// Login
router.post('/logon', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/patient/search',
    failureRedirect: '/users/registration',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(req.user, error => {
    if(error){
      res.flash('error_msg', 'You cannot logout')
      
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login'); // would be ideal to send users to welcome page
    
  });
 
  
});


module.exports = router;