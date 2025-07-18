const Commande = require('../models/Commande');
const Product = require('../models/Product');
const getEmployesByAdmin = require("../utils/getEmployesByAdmin");
exports.addCommande = async (req, res) => {
  try {
    const { produits, client } = req.body;

    if (!produits || !Array.isArray(produits) || produits.length === 0) {
      return res.status(400).json({ message: "Le tableau produits est obligatoire." });
    }

    // Résolution des noms de produits vers leur ID
    const produitsAvecId = await Promise.all(produits.map(async (p) => {
      const produitDoc = await Product.findOne({ name: p.nomProduit });
      if (!produitDoc) {
        throw new Error(`Produit non trouvé: ${p.nomProduit}`);
      }
      return {
        produit: produitDoc._id,
        quantite: p.quantite
      };
    }));

    // Créer la commande avec employé lié
    const commande = new Commande({
      produits: produitsAvecId,
      client,
      employe: req.user._id 
    });

    await commande.save();
    res.status(201).json(commande);
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getCommandes = async (req, res) => {
  try {
    const employeIds = await getEmployesByAdmin(req.user);
    const commandes = await Commande.find({ employe: { $in: employeIds } })
      .populate('produits.produit')
      .populate('employe', 'NomPrénom');
    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCommande = async (req, res) => {
  try {
    const { id } = req.params;
    await Commande.findByIdAndDelete(id);
    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

