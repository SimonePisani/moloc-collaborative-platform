var express = require('express');
var router = express.Router();
var passport = require('passport');


var log_controller = require('../controllers/log_controller.js');

//GET Login
router.get("/", log_controller.login_get);

//POST Login
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  failureFlash: true
}), log_controller.login_post);

//GET logout
router.get("/logout", log_controller.logout_get);

module.exports = router;
