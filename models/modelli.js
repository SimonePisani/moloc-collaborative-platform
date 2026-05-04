var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Modelli_Schema = new Schema({
  titolo: {
    type: String,
    required: true,
    maxlength: 100
  },
  testo: {
    type: String
  },
  utente: {
    type: Schema.Types.ObjectId,
    ref: 'Utente'
  },
  autore_originale: {
    type: Schema.Types.ObjectId,
    ref: 'Utente'
  },
  autore_originale_username: {
    type: String
  },
  indice: {
    type: Number
  },
  chiave: {
    type: String
  },
  ultimamodifica: {
    type: String
  },
  flag: {
    type: Boolean
  }
}, {
  collection: 'Modelli_schema',
});

// Virtual for modello's URL
Modelli_Schema
  .virtual('url')
  .get(function() {
    return '/dashboard/modello_attuale/' + this._id;
  });

//Export model
module.exports = mongoose.model('Modello', Modelli_Schema);
