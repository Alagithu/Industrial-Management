const mongoose = require('mongoose');

const demandeCongesSchema = new mongoose.Schema({
 NomPrenom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email:{
    type:String,
    required:true,
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  statut: {
    type: String,
    default: 'En attente',
    enum: ['En attente', 'Accepté', 'Refusé']
  },
 Actions:{
  type:String,
  enum:["Accepter","Refuser"]
 }
});

module.exports = mongoose.model('DemandeConges', demandeCongesSchema);