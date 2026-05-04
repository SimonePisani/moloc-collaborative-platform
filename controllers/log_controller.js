var User = require('../models/utenti');

//GET login page
exports.login_get = function(req, res) {
  if (req.user) {
    if (req.user.moderatore) {
      res.redirect("/profilo_admin");
    } else {
      res.redirect("/profilo_utente");
    }
  } else {
    res.render('login', {
      user: req.user,
      message: req.flash('error')
    });
  }
};

//POST request to log in
exports.login_post = function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err){
      console.log("\n **** Errore individuato in log_controller/login_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    if (user.moderatore) {
      res.redirect("/profilo_admin");
    } else {
      res.redirect("/profilo_utente");
    }
  });
};

//GET Logout
exports.logout_get = function(req, res) {
  req.session.destroy(function(err) {
    if (err){
      console.log("\n **** Errore individuato in log_controller/logout_get.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    res.redirect('/'); //Inside a callback… bulletproof!
  });
};
