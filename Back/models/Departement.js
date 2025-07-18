const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const departementSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  responsable: { 
    type: String,
    ref: 'User',
    required: true 
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
   admin: { type: Schema.Types.ObjectId, ref: 'Admin' } 
});
module.exports = mongoose.model('Departement', departementSchema);
