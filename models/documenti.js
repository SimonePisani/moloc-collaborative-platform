var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Documenti_Schema = new Schema({
  titolo: {
    type: String,
    required: true,
    maxlength: 100
  },
  sinossi: {
    type: String
  },
  utente: {
    type: Schema.Types.ObjectId,
    ref: 'Utente'
  },
  ultimamodifica: {
    type: String
  },
  descrizione: {
    type: String
  },
  descrizione_semplificata: {
    type: String
  },
  descrizione_ridotta: {
    type: String
  },
  descrizione_residua: {
    type: String
  },
  parafrasi: {
    type: String
  },
  glossario: {
    type: String
  },
  ruoli_individuali: {
    type: String
  },
  ruoli_collettivi: {
    type: String
  },
  ruoli_giuridici: {
    type: String
  },
  documenti: {
    type: String
  },
  flussi: {
    type: String
  },
  attivita_ruoli_individuali: {
    type: String
  },
  attivita_ruoli_collettivi: {
    type: String
  },
  attivita_ruoli_giuridici: {
    type: String
  },
  note: {
    type: String
  },
  flag: {
    type: Boolean
  },
  indice: {
    type: Number
  },
}, {
  collection: 'Documenti_Schema',
});


//Export model
module.exports = mongoose.model('Documenti', Documenti_Schema);
