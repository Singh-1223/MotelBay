const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const {storeReturnTo} = require('../middleware');


router.route('/register')
          .get(users.renderRegister)
          .post(catchAsync(users.register));

router.get('/login',users.renderLogin)

//handing routes for handling user login using the passport authentication middleware
// use the storeReturnTo middleware to save the returnTo value from session to res.locals
 // passport.authenticate logs the user in and clears req.session
router.post('/login',storeReturnTo,passport.authenticate('local',{
    failureFlash: true, // Enable flashing messages for failed login
    failureRedirect: '/login' // Redirect to '/login' in case of failed login
}),users.login)

router.get('/logout', users.logout); 

module.exports = router;