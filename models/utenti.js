var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var Utenti_Schema = new Schema({
  username: {
    type: String,
    required: true,
    maxlength: 30
  },
  numodelli: {
    type: Number,
    min: 0,
    required: true,
    default: 1
  },
  sinossi: {
    type: Boolean,
    required: true,
    default: true
  },
  moderatore: {
    type: Boolean,
    required: true,
    default: true
  },
}, {
  collection: 'Utenti_schema'
});

Utenti_Schema.plugin(passportLocalMongoose);

//Export model
module.exports = mongoose.model('Utente_Schema', Utenti_Schema);
