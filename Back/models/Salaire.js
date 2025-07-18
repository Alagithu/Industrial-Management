const mongoose = require('mongoose');

const salaireSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  mois: {
    type: Number,
    required: true,
  },
  annee: {
    type: Number,
    required: true,
  },
  nombreJours: {
    type: Number,
    required: true,
  },
  tauxJournalier: {
    type: Number,
    required: true,
  },
  montantTotal: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Salaire', salaireSchema);
