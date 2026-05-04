var User = require('../models/utenti');
var Model = require('../models/modelli');


//GET modifica modello
exports.modifica_modello_get = function(req, res) {
  Model.findOne({
    _id: req.params.modello_id
  }, function(err, modello) {
    if (err){
      console.log("\n **** Errore individuato in modifica_valida_modello_controller/modifica_modello_get.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    Model.find({
      chiave: modello.chiave
    }, function(err, versioni) {
      if (err){
        console.log("\n **** Errore individuato in modifica_valida_modello_controller/modifica_modello_get.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      res.render('modifica_modello', {
        modello,
        utente: req.user,
        versioni
      });
    });
  });
};

//POST crea nuova versione progetto
exports.crea_versione_post = function(req, res) {
  Model.findOne({
    _id: req.params.modello_id
  }, function(err, model) {
    if (err){
      console.log("\n **** Errore individuato in modifica_valida_modello_controller/crea_versione_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    Model.findOne({
      chiave: model.chiave,
      flag: true
    }, function(err, ultimaversione) {
      if (err){
        console.log("\n **** Errore individuato in modifica_valida_modello_controller/crea_versione_post.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      ultimaversione.flag = false;
      ultimaversione.save();
      var modello = new Model({
        titolo: req.body.Titolo,
        testo: req.body.Testo,
        utente: req.user,
        autore_originale: ultimaversione.autore_originale,
        indice: ultimaversione.indice + 0.01,
        chiave: ultimaversione.chiave,
        ultimamodifica: new Date(Date.now()).toLocaleString(
            'it-it', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }
        ),
        flag: "yes",
      });
      modello.save();
      if (modello.indice > 1.03) {
        Model.deleteOne({
          chiave: modello.chiave,
          indice: (modello.indice - 0.04)
        }, function(err) {
          if (err){
            console.log("\n **** Errore individuato in modifica_valida_modello_controller/crea_versione_post.\n Causato da: "+req.user+"\n"+err+"\n");
            return res.render('servererror',{
              utente: req.user
            });
          }
          if (req.user.moderatore) {
            res.redirect('/profilo_admin/'+modello.id+'/'+modello.titolo.split(' ').join('_')+'/modifica_progetto');
          } else {
            res.redirect('/profilo_utente/'+modello.id+'/'+modello.titolo.split(' ').join('_')+'/modifica_progetto');
          }
        })
      } else {
        if (req.user.moderatore) {
          res.redirect('/profilo_admin/'+modello.id+'/'+modello.titolo.split(' ').join('_')+'/modifica_progetto');
        } else {
          res.redirect('/profilo_utente/'+modello.id+'/'+modello.titolo.split(' ').join('_')+'/modifica_progetto');
        }
      }
    });
  });
};

//POST salva versione progetto
exports.salva_progetto_post = function(req, res) {
  Model.findOne({
    _id: req.params.modello_id
  }, function(err, model) {
    if (err){
      console.log("\n **** Errore individuato in modifica_valida_modello_controller/salva_progetto_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    model.titolo = req.body.Titolo;
    model.testo = req.body.Testo;
    model.ultimamodifica = new Date(Date.now()).toLocaleString(
        'it-it', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
    );
    model.save();
    res.redirect('back');
  })
};

//GET valida progetto
exports.valida_progetto_get = function(req, res) {
  Model.findOne({
    _id: req.params.modello_id
  }, function(err, modello) {
    if (err){
      console.log("\n **** Errore individuato in modifica_valida_modello_controller/valida_progetto_get.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    User.find(function(err, autori) {
      if (err){
        console.log("\n **** Errore individuato in admin_controller/admin_gestione_modelli_get.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      res.render('valida_modello', {
        modello,
        utente: req.user,
        autori
      });
    });
  });
}
