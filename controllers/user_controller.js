var User = require('../models/utenti');
var Model = require('../models/modelli');
var Document = require('../models/documenti');
var Course = require('../models/corso');

//GET profilo user
exports.profilo_user_get = function(req, res) {
  Course.find(function(err, corso){
    if (err){
      console.log("\n **** Errore individuato in user_controller/profilo_user_get.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    var anno = corso[0];
    Model.find({
      utente: req.user,
      flag: true
    }, null, {
      sort: {
        chiave: 'asc'
      }
    }, function(err, models) {
      if (err){
        console.log("\n **** Errore individuato in user_controller/profilo_user_get.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      Document.findOne({
          utente: req.user,
          flag: true
        },
        function(err, documento) {
          if (err){
            console.log("\n **** Errore individuato in user_controller/profilo_user_get.\n Causato da: "+req.user+"\n"+err+"\n");
            return res.render('servererror',{
              utente: req.user
            });
          }
          res.render('profilo_utente', {
            utente: req.user,
            isLoggedIn: req.isLogged,
            modelli: models,
            documento: documento,
            anno
          });
        });
    });
  })
}

//GET visualizza documento di analisi
exports.visualizza_documento_get = function(req, res) {
  var autore = req.user;
  Course.find(function(err, corso){
    if (err){
      console.log("\n **** Errore individuato in user_controller/visualizza_documento_get.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    var anno = corso[0];
    Document.findOne({
      utente: req.user,
      flag: true
    }, function(err, documento) {
      if (err){
        console.log("\n **** Errore individuato in user_controller/visualizza_documento_get.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      res.render('visualizza_documento', {
        utente: req.user,
        isLoggedIn: req.isLogged,
        documento: documento,
        nickname: autore.username,
        anno
      })
    })
  })
}

//GET modifica documento di analisi
exports.modifica_documento_get = function(req, res) {
  var autore = req.user;
  Document.findOne({
    _id: req.params.documento_id,
  }, function(err, documento) {
    if (err){
      console.log("\n **** Errore individuato in user_controller/modifica_documento_get.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    Document.find({
      utente: req.user
    }, function(err, versioni) {
      if (err){
        console.log("\n **** Errore individuato in user_controller/modifica_documento_get.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      Course.find(function(err, corso) {
        if (err){
          console.log("\n **** Errore individuato in user_controller/modifica_documento_get.\n Causato da: "+req.user+"\n"+err+"\n");
          return res.render('servererror',{
            utente: req.user
          });
        }
        var anno = corso[0];
        if (!anno.analisi) {
          return res.redirect(403, "/profilo_utente");
        } else {
          res.render('modifica_documento', {
            utente: req.user,
            isLoggedIn: req.isLogged,
            documento: documento,
            nickname: autore.username,
            versioni,
            anno
          })
        }
      })
    })
  })
}

//POST salva modifiche documento di analisi
exports.salva_documento_post = function(req, res) {
  Document.findOne({
    _id: req.params.documento_id
  }, function(err, documento) {
    if (err){
      console.log("\n **** Errore individuato in user_controller/salva_documento_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    documento.titolo = req.body.titolo_documento;
    documento.ultimamodifica = new Date(Date.now()).toLocaleString(
      'it-it', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );
    documento.sinossi = req.body.sinossi_documento;
    documento.descrizione = req.body.descrizione_documento;
    documento.descrizione_semplificata = req.body.descrizione_semplificata_documento;
    documento.descrizione_ridotta = req.body.descrizione_ridotta_documento;
    documento.descrizione_residua = req.body.descrizione_residua_documento;
    documento.parafrasi = req.body.parafrasi_documento;
    documento.glossario = req.body.glossario_documento;
    documento.ruoli_individuali = req.body.ruoli_individuali_documento;
    documento.ruoli_collettivi = req.body.ruoli_collettivi_documento;
    documento.ruoli_giuridici = req.body.ruoli_giuridici_documento;
    documento.documenti = req.body.documenti_documento;
    documento.flussi = req.body.flussi_documento;
    documento.attivita_ruoli_individuali = req.body.attività_individuali_documento;
    documento.attivita_ruoli_collettivi = req.body.attività_collettive_documento;
    documento.attivita_ruoli_giuridici = req.body.attività_giuridiche_documento;
    documento.note = req.body.note_documento;
    documento.save();
    res.redirect('/profilo_utente/modifica_documento/' + documento.id);
  })
}

exports.crea_versione_documento_post = function(req, res) {
  Course.find(function(err, corso) {
    if (err){
      console.log("\n **** Errore individuato in user_controller/crea_versione_documento_post.\n Causato da: "+req.user+"\n"+err+"\n");
      return res.render('servererror',{
        utente: req.user
      });
    }
    var anno = corso[0];
    Document.findOne({
      utente: req.user,
      flag: true
    }, function(err, ultimaversione) {
      if (err){
        console.log("\n **** Errore individuato in user_controller/crea_versione_documento_post.\n Causato da: "+req.user+"\n"+err+"\n");
        return res.render('servererror',{
          utente: req.user
        });
      }
      ultimaversione.flag = false;
      ultimaversione.save();
      //check dei valori per inserimento nella nuova versione
      var titolo_doc,
      sinossi_doc,
      descrizione_doc,
      descrizione_semplificata_doc,
      descrizione_ridotta_doc,
      descrizione_residua_doc,
      parafrasi_doc,
      glossario_doc,
      ruoli_individuali_doc,
      ruoli_collettivi_doc,
      ruoli_giuridici_doc,
      documenti_doc,
      flussi_doc,
      attivita_ruoli_individuali_doc,
      attivita_ruoli_collettivi_doc,
      attivita_ruoli_giuridici_doc,
      note_doc;

      if (!anno.titolo) {
        titolo_doc = ultimaversione.titolo;
      } else {
        titolo_doc = req.body.titolo_documento;
      }

      if (!anno.sinossi) {
        sinossi_doc = ultimaversione.sinossi;
      } else {
        sinossi_doc = req.body.sinossi_documento;
      }

      if (!anno.descrizione) {
        descrizione_doc = ultimaversione.descrizione;
      } else {
        descrizione_doc = req.body.descrizione_documento;
      }

      if (!anno.descrizione_semplificata) {
        descrizione_semplificata_doc = ultimaversione.descrizione_semplificata;
      } else {
        descrizione_semplificata_doc = req.body.descrizione_semplificata_documento;
      }

      if (!anno.descrizione_ridotta) {
        descrizione_ridotta_doc = ultimaversione.descrizione_ridotta;
      } else {
        descrizione_ridotta_doc = req.body.descrizione_ridotta_documento;
      }

      if (!anno.descrizione_residua) {
        descrizione_residua_doc = ultimaversione.descrizione_residua;
      } else {
        descrizione_residua_doc = req.body.descrizione_residua_documento;
      }

      if (!anno.parafrasi) {
        parafrasi_doc = ultimaversione.parafrasi;
      } else {
        parafrasi_doc = req.body.parafrasi_documento;
      }

      if (!anno.glossario) {
        glossario_doc = ultimaversione.glossario;
      } else {
        glossario_doc = req.body.glossario_documento;
      }

      if (!anno.ruoli) {
        ruoli_individuali_doc = ultimaversione.ruoli_individuali;
        ruoli_collettivi_doc = ultimaversione.ruoli_collettivi;
        ruoli_giuridici_doc = ultimaversione.ruoli_giuridici;
      } else {
        ruoli_individuali_doc = req.body.ruoli_individuali_documento;
        ruoli_collettivi_doc = req.body.ruoli_collettivi_documento;
        ruoli_giuridici_doc = req.body.ruoli_giuridici_documento;
      }

      if (!anno.documenti) {
        documenti_doc = ultimaversione.documenti;
      } else {
        documenti_doc = req.body.documenti_documento;
      }

      if (!anno.flussi) {
        flussi_doc = ultimaversione.flussi;
      } else {
        flussi_doc = req.body.flussi_documento;
      }

      if (!anno.attivita) {
        attivita_ruoli_individuali_doc = ultimaversione.attivita_ruoli_individuali;
        attivita_ruoli_collettivi_doc = ultimaversione.attivita_ruoli_collettivi;
        attivita_ruoli_giuridici_doc = ultimaversione.attivita_ruoli_giuridici;
      } else {
        attivita_ruoli_individuali_doc = req.body.attività_individuali_documento
        attivita_ruoli_collettivi_doc = req.body.attività_collettive_documento
        attivita_ruoli_giuridici_doc = req.body.attività_giuridiche_documento
      }

      if (!anno.note) {
        note_doc = ultimaversione.note;
      } else {
        note_doc = req.body.note_documento;
      }

      var documento = new Document({
        titolo: titolo_doc,
        utente: req.user,
        ultimamodifica: new Date(Date.now()).toLocaleString(
          'it-it', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }
        ),
        sinossi: sinossi_doc,
        descrizione: descrizione_doc,
        descrizione_semplificata: descrizione_semplificata_doc,
        descrizione_ridotta: descrizione_ridotta_doc,
        descrizione_residua: descrizione_residua_doc,
        parafrasi: parafrasi_doc,
        glossario: glossario_doc,
        ruoli_individuali: ruoli_individuali_doc,
        ruoli_collettivi: ruoli_collettivi_doc,
        ruoli_giuridici: ruoli_giuridici_doc,
        documenti: documenti_doc,
        flussi: flussi_doc,
        attivita_ruoli_individuali: attivita_ruoli_individuali_doc,
        attivita_ruoli_collettivi: attivita_ruoli_collettivi_doc,
        attivita_ruoli_giuridici: attivita_ruoli_giuridici_doc,
        note: note_doc,
        flag: true,
        indice: ultimaversione.indice + 0.01
      })
      documento.save();
      if (documento.indice > 1.02) {
        Document.deleteOne({
          indice: (documento.indice - 0.03),
          utente: req.user
        }, function(err) {
          if (err){
            console.log("\n **** Errore individuato in user_controller/crea_versione_documento_post.\n Causato da: "+req.user+"\n"+err+"\n");
            return res.render('servererror',{
              utente: req.user
            });
          }
          res.redirect('/profilo_utente/modifica_documento/' + documento.id);
        })
      } else {
        res.redirect('/profilo_utente/modifica_documento/' + documento.id);
      }
    })
  });
}
