var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/user_controller.js');
var modifica_valida_modello_controller = require('../controllers/modifica_valida_modello_controller');


/* GET dashboard utente. */
router.get('/', isLoggedIn, hasAuthorization, user_controller.profilo_user_get);

//GET validatore progetto
router.get('/:modello_id/:titolo/valida_progetto', isLoggedIn, hasAuthorization, modifica_valida_modello_controller.valida_progetto_get);

//GET modifica progetto
router.get('/:modello_id/:titolo/modifica_progetto', isLoggedIn, hasAuthorization, modifica_valida_modello_controller.modifica_modello_get);

//POST modifica progetto
router.post('/:modello_id/:titolo/salva', isLoggedIn, hasAuthorization, modifica_valida_modello_controller.salva_progetto_post);

//POST crea una nuova versione del progetto
router.post('/:modello_id/:titolo/crea_versione', isLoggedIn, hasAuthorization, modifica_valida_modello_controller.crea_versione_post);

//POST ripristina una vecchia versione del progetto
router.post('/:modello_id/:titolo/ripristina_versione', isLoggedIn, hasAuthorization, modifica_valida_modello_controller.crea_versione_post);

//GET anteprima documento di analisi
router.get('/visualizza_documento/:documento_id', isLoggedIn, hasAuthorization, user_controller.visualizza_documento_get);

//GET anteprima documento di analisi
router.get('/modifica_documento/:documento_id', isLoggedIn, hasAuthorization, user_controller.modifica_documento_get);

//POST aggiorna documento di analisi
router.post('/modifica_documento/:documento_id/salva_documento', isLoggedIn, hasAuthorization, user_controller.salva_documento_post);

//POST crea nuova verisone documento di analisi
router.post('/modifica_documento/:documento_id/crea_versione_documento', isLoggedIn, hasAuthorization, user_controller.crea_versione_documento_post);
//------------funzioni locali

// check isLoggedIn
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

// check is not admin
function hasAuthorization(req, res, next) {
    if (req.isAuthenticated() && (!req.user.moderatore)) {
        return next();
    }
    return res.redirect(403, "/profilo_admin");
}

module.exports = router;
