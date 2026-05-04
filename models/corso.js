var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Corso_Schema = new Schema({
  analisi:{
    type: Boolean,
    required: true,
    default: true
  },
  titolo:{
    type: Boolean,
    required: true,
    default: true
  },
  sinossi:{
    type: Boolean,
    required: true,
    default: true
  },
  descrizione:{
    type: Boolean,
    required: true,
    default: true
  },
  descrizione_semplificata:{
    type: Boolean,
    required: true,
    default: true
  },
  descrizione_ridotta:{
    type: Boolean,
    required: true,
    default: true
  },
  descrizione_residua:{
    type: Boolean,
    required: true,
    default: true
  },
  parafrasi:{
    type: Boolean,
    required: true,
    default: true
  },
  glossario:{
    type: Boolean,
    required: true,
    default: true
  },
  ruoli:{
    type: Boolean,
    required: true,
    default: true
  },
  documenti:{
    type: Boolean,
    required: true,
    default: true
  },
  flussi:{
    type: Boolean,
    required: true,
    default: true
  },
  attivita:{
    type: Boolean,
    required: true,
    default: true
  },
  note:{
    type: Boolean,
    required: true,
    default: true
  },
}, {
  collection: 'Corso_schema'
});

//Export model
module.exports = mongoose.model('Corso_Schema', Corso_Schema);
