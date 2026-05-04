var express = require('express');
var router = express.Router();

var passport = require('passport');

var admin_controller = require('../controllers/admin_controller.js');
var modifica_valida_modello_controller = require('../controllers/modifica_valida_modello_controller');

//GET redirect
router.get('/', isLoggedIn, hasAuthorization, admin_controller.admin_get);

//GET gestione utenti
router.get('/gestione_utenti', isLoggedIn, hasAuthorization, admin_controller.admin_gestione_utenti_get);

//GET gestione modelli
router.get('/gestione_modelli', isLoggedIn, hasAuthorization, admin_controller.admin_gestione_modelli_get);

//GET gestione corso
router.get('/gestione_corsi', isLoggedIn, hasAuthorization, admin_controller.admin_gestione_corsi_get);

//POST gestione corso
router.post('/gestione_corsi/salva_modifiche', isLoggedIn, hasAuthorization, admin_controller.admin_gestione_corsi_post);

//POST copia modello
router.post('/copia_modello/:modello_id', isLoggedIn, hasAuthorization, admin_controller.admin_copia_modello_post);

//POST elimina modello studente
router.post('/cancella_modello/:modello_id', isLoggedIn, hasAuthorization, admin_controller.admin_elimina_modello_studente_post);

//POST elimina utente
router.post('/cancella_utente/:utente_id', isLoggedIn, hasAuthorization, admin_controller.admin_elimina_utente_post);

//GET modifica utente
router.get('/modifica_utente/:utente_id', isLoggedIn, hasAuthorization, admin_controller.admin_modifica_utente_get);

//POST conferma modifiche utente
router.post('/modifica_utente/:utente_id/conferma_modifica', isLoggedIn, hasAuthorization, admin_controller.admin_conferma_modifiche_utente_post);

//GET registra utente
router.get("/registra_utente", isLoggedIn, hasAuthorization, admin_controller.admin_registra_utente_get);

//POST registra utente
router.post("/registra_utente/registra", isLoggedIn, hasAuthorization, admin_controller.admin_registra_utente_post);

//POST elimina modello
router.post('/:modello_id/:titolo/elimina_progetto', isLoggedIn, hasAuthorization, admin_controller.admin_elimina_modello_post);

//GET modifica modello
router.get('/:modello_id/:titolo/modifica_progetto', isLoggedIn, hasAuthorization, modifica_valida_modello_controller.modifica_modello_get);

//POST modifica progetto
router.post('/:modello_id/:titolo/salva', isLoggedIn, hasAuthorization, modifica_valida_modello_controller.salva_progetto_post);

//POST crea una nuova versione del progetto
router.post('/:modello_id/:titolo/crea_versione', isLoggedIn, hasAuthorization, modifica_valida_modello_controller.crea_versione_post);

//POST ripristina una vecchia versione del progetto
router.post('/:modello_id/:titolo/ripristina_versione', isLoggedIn, hasAuthorization, modifica_valida_modello_controller.crea_versione_post);

//GET valida progetto
router.get('/:modello_id/:titolo/valida_progetto', isLoggedIn, hasAuthorization, modifica_valida_modello_controller.valida_progetto_get);

//GET anteprima documento
router.get('/anteprima_documento/:utente_id', isLoggedIn, hasAuthorization, admin_controller.visualizza_documento_get);

//------------funzioni locali

// check if is logged
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// check if is administrator
function hasAuthorization(req, res, next) {
    if (req.isAuthenticated() && (req.user.moderatore)) {
        return next();
    }
    return res.redirect(403, "/profilo_utente");
}

module.exports = router;
