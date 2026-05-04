var User = require('../models/utenti');
var Model = require('../models/modelli');
var Document = require('../models/documenti');
var Course = require('../models/corso');

var randtoken = require('rand-token');


//GET redirect
exports.admin_get = function(req, res){
  res.redirect('/profilo_admin/gestione_utenti')
};

//GET admin gestione utenti
exports.admin_gestione_utenti_get = function(req, res){
  User.find({
    _id: {
      $ne: req.user
    }
  }, null, {
    sort: {
      username: 'asc'
    }
  }, function(err, utenti) {
    if (err){
      console.log("\n **** Errore individuato in admin_controller/admin_gestione_utenti_get.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    Model.find(function(err, modelli) {
      if (err){
        console.log("\n **** Errore individuato in admin_controller/admin_gestione_utenti_get.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      res.render('profilo_admin_gestione_utenti', {
        utente: req.user,
        isLoggedIn: req.isLogged,
        utenti,
        modelli
      });
    })
  });
};

//GET admin gestione modelli
exports.admin_gestione_modelli_get = function(req, res){
  Model.find({
    utente: req.user,
    flag: true
  }, null, {
    sort: {
      autore_originale_username: 'asc',
      ultimamodifica: 'desc'
    }
  }, function(err, models) {
    if (err){
      console.log("\n **** Errore individuato in admin_controller/admin_gestione_modelli_get.\n Causato da: "+req.user+"\n"+err+"\n");
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
      res.render('profilo_admin_gestione_modelli', {
        utente: req.user,
        autori,
        isLoggedIn: req.isLogged,
        modelli: models
      });
    })
  });
};

//GET admin gestione corso
exports.admin_gestione_corsi_get = function(req, res) {
  Course.find(function(err, corso) {
    if (err){
      console.log("\n **** Errore individuato in admin_controller/admin_gestione_corsi_get.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    var anno = corso[0];
    res.render('profilo_admin_gestione_corsi', {
      utente: req.user,
      isLoggedIn: req.isLogged,
      corso: anno,
    })
  });
};

//POST copia modello
exports.admin_copia_modello_post = function(req, res){
  User.findOne({
    _id: req.user.id
  }, function(err, admin) {
    if (err){
      console.log("\n **** Errore individuato in admin_controller/admin_copia_modello_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    admin.numodelli = parseInt(admin.numodelli) + 1;
    Model.findOne({
      _id: req.params.modello_id
    }, function(err, modello) {
      if (err){
        console.log("\n **** Errore individuato in admin_controller/admin_copia_modello_post.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      User.findOne({
        _id: modello.utente
      }, function(err, autore){
        if (err){
          console.log("\n **** Errore individuato in admin_controller/admin_copia_modello_post.\n Causato da: "+req.user+"\n"+err+"\n");
          return res.render('servererror',{
            utente: req.user
          });
        }
        var copiamodello = new Model({
          titolo: modello.titolo + ' - Copia ',
          testo: modello.testo,
          utente: req.user,
          autore_originale: modello.utente,
          autore_originale_username: autore.username,
          indice: 1.0,
          chiave: admin.id + randtoken.generate(32),
          ultimamodifica: new Date(Date.now()).toLocaleString(
              'it-it', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }
          ),
          flag: "yes",
        });
        copiamodello.save();
        admin.save();
        res.redirect('back');
      })
    })
  })
};

//POST elimina modello studente
exports.admin_elimina_modello_studente_post = function(req, res){
  Model.findOne({
    _id: req.params.modello_id
  }, function(err, modello) {
    if (err){
      console.log("\n **** Errore individuato in admin_controller/admin_elimina_modello_studente_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    User.findOne({
      _id: modello.utente
    }, function(err, autore) {
      if (err){
        console.log("\n **** Errore individuato in admin_controller/admin_elimina_modello_studente_post.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      autore.numodelli = parseInt(autore.numodelli) - 1;
      autore.save();
      Model.deleteMany({
        chiave: modello.chiave
      }, function(err) {
        if (err){
          console.log("\n **** Errore individuato in admin_controller/admin_elimina_modello_studente_post.\n Causato da: "+req.user+"\n"+err+"\n");
          return res.render('servererror',{
            utente: req.user
          });
        }
        res.redirect('back')
      })
    })
  })
};

//POST elimina utente
exports.admin_elimina_utente_post = function(req, res){
  User.deleteOne({
    _id: req.params.utente_id
  }, function(err) {
    if (err){
      console.log("\n **** Errore individuato in admin_controller/admin_elimina_utente_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    Model.deleteMany({
      utente: req.params.utente_id
    }, function(err) {
      if (err){
        console.log("\n **** Errore individuato in admin_controller/admin_elimina_utente_post.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      Document.deleteMany({
        utente: req.params.utente_id
      }, function(err){
        if (err){
          console.log("\n **** Errore individuato in admin_controller/admin_elimina_utente_post.\n Causato da: "+req.user+"\n"+err+"\n");
          return res.render('servererror',{
            utente: req.user
          });
        }
        res.redirect('back');
      })
    })
  })
};

//GET modifica utente
exports.admin_modifica_utente_get = function(req, res){
  User.findOne({
    _id: req.params.utente_id
  }, function(err, studente) {
    if (err){
      console.log("\n **** Errore individuato in admin_controller/admin_modifica_utente_get.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    res.render('modifica_utente', {
      utente: req.user,
      message: req.flash('error'),
      isLoggedIn: req.isLogged,
      studente
    });
  });
};

//POST conferma modifiche utente
exports.admin_conferma_modifiche_utente_post = function(req, res){
  User.findOne({
    _id: req.params.utente_id
  }, function(err, studente) {
    if (err){
      console.log("\n **** Errore individuato in admin_controller/admin_conferma_modifiche_utente_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    if (req.body.new_username.length !== 0) {
      studente.username = req.body.new_username;
    }
    if (req.body.new_password.length !== 0) {
      studente.setPassword(req.body.new_password, function(err, studente) {
        if (err){
          console.log("\n **** Errore individuato in admin_controller/admin_conferma_modifiche_utente_post.\n Causato da: "+req.user+"\n"+err+"\n");
          return res.render('servererror',{
            utente: req.user
          });
        }
        studente.save();
      });
    }
    if (parseInt(req.body.new_numero_modelli) !== 0) {
      nuovo_modelli = parseInt(req.body.new_numero_modelli);
      for (var i = studente.numodelli; i < (studente.numodelli + nuovo_modelli); i++) {
        var modello = new Model({
          titolo: 'documento ' + (i + 1) + ' di ' + studente.username,
          testo: '',
          utente: studente,
          indice: 1.0,
          chiave: studente.id + randtoken.generate(32),
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
      }
      studente.numodelli = studente.numodelli + parseInt(req.body.new_numero_modelli);
    }
    studente.moderatore = req.body.new_moderazione;
    studente.save();
    res.redirect('/profilo_admin');
  })
};

//GET registra utente
exports.admin_registra_utente_get = function(req, res){
  res.render("registra_utente", {
    utente: req.user,
    message: req.flash('error'),
    isLoggedIn: req.isLogged
  });
};

//POST registra utente
exports.admin_registra_utente_post = function(req, res){
  User.register(new User({
    username: req.body.username,
    numodelli: req.body.numodelli,
    moderatore: req.body.admin
  }), req.body.password, function(err, user) {
    console.log("attempting user registration");
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      res.redirect('back');
      return;
    }
    for (var i = 0; i < parseInt(req.body.numodelli); i++) {
      var modello = new Model({
        titolo: 'documento ' + (i + 1) + ' di ' + req.body.username,
        testo: '',
        utente: user,
        indice: 1.0,
        chiave: user.id + randtoken.generate(32),
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
    }
    console.log(req.body.sinossi === 'true');
    console.log(req.body.sinossi);
    if (req.body.sinossi === 'true') {
      var documento = new Document({
        titolo: '<h3>Documento di analisi di ' + req.body.username + '</h3>',
        utente: user,
        ultimamodifica: new Date(Date.now()).toLocaleString(
          'it-it', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }
        ),
        sinossi: '<p>Inserire una sinossi</p>',
        descrizione: '<p>Inserire una descrizione</p>',
        descrizione_semplificata: '<p>Inserire una descrizione semplificata</p>',
        descrizione_ridotta: '<p>Inserire una descrizione ridotta</p>',
        descrizione_residua: '<p>Inserire una descrizione residua</p>',
        parafrasi: '<p>Inserire una parafrasi della descrizione</p>',
        glossario : '<li>\n\t<b>Inserire una voce</b>\n\t<p>Inserire la definizione della voce</p>\n</li>',
        ruoli_individuali: '<li>Inserire un ruolo individuale</li>',
        ruoli_collettivi: '<li>Inserire un ruolo collettivo</li>',
        ruoli_giuridici: '<li>inserire un ruolo giuridico</li>',
        documenti: '<li>Inserire un documento</li>',
        flussi: '<li>Inserire ruolo mittente, documento, ruolo destinatario</li>',
        attivita_ruoli_individuali: "<li>Inserire un'attività individuale</li>",
        attivita_ruoli_collettivi: "<li>Inserire un'attività collettiva</li>",
        attivita_ruoli_giuridici: "<li>Inserire un'attività giuridica</li>",
        note: '<p>Inserire delle note</p>',
        flag: 'yes',
        indice: 1.0,
      })
      documento.save();
    }
    console.log("user registration successful: " + req.body.username);
    res.redirect('/profilo_admin')
  });
};

//POST elimina proprio modello
exports.admin_elimina_modello_post = function(req, res){
  Model.findOne({
    _id: req.params.modello_id
  }, function(err, modello) {
    if (err){
      console.log("\n **** Errore individuato in admin_controller/admin_elimina_modello_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    User.findOne({
      _id: modello.utente
    }, function(err, utente) {
      if (err){
        console.log("\n **** Errore individuato in admin_controller/admin_elimina_modello_post.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      utente.numodelli = parseInt(utente.numodelli) - 1;
      utente.save();
      Model.deleteMany({
        chiave: modello.chiave
      }, function(err) {
        if (err){
          console.log("\n **** Errore individuato in admin_controller/admin_elimina_modello_post.\n Causato da: "+req.user+"\n"+err+"\n");
          return res.render('servererror',{
            utente: req.user
          });
        }
        res.redirect('back')
      })
    })
  })
};

//GET anteprima documento
exports.visualizza_documento_get = function(req, res){
  User.findOne({
    _id: req.params.utente_id
  }, function(err, autore){
    if (err){
      console.log("\n **** Errore individuato in admin_controller/visualizza_documento_get.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    Document.findOne({
      utente: req.params.utente_id,
      flag: true
    }, function(err, documento){
      if (err){
        console.log("\n **** Errore individuato in admin_controller/visualizza_documento_get.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      res.render('visualizza_documento', {
        utente: req.user,
        documento: documento,
        nickname: autore.username
      })
    })
  })
}

//POST gestione corso
exports.admin_gestione_corsi_post = function(req, res){
  Course.find(function(err, corso) {
    if (err){
      console.log("\n **** Errore individuato in admin_controller/admin_gestione_corsi_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    corso[0].analisi = req.body.analisi_check;
    corso[0].titolo = req.body.titolo_check;
    corso[0].sinossi = req.body.sinossi_check;
    corso[0].descrizione = req.body.descrizione_check;
    corso[0].descrizione_semplificata = req.body.descrizione_semplificata_check;
    corso[0].descrizione_ridotta = req.body.descrizione_ridotta_check;
    corso[0].descrizione_residua = req.body.descrizione_residua_check;
    corso[0].parafrasi = req.body.parafrasi_check;
    corso[0].glossario = req.body.glossario_check;
    corso[0].ruoli = req.body.ruoli_check;
    corso[0].documenti = req.body.documenti_check;
    corso[0].flussi = req.body.flussi_check;
    corso[0].attivita = req.body.attivita_check;
    corso[0].note = req.body.note_check;
    corso[0].save();
    res.redirect('back');
  });
}
