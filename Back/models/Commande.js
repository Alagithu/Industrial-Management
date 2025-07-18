
const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  produits: [
    {
      produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantite: { type: Number, required: true, min: 1 }
    }
  ],
  date: { type: Date, default: Date.now },
  employe: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: String } 
  
});

module.exports = mongoose.model('Commande', commandeSchema);
