const Salaire = require('../models/Salaire');

// Créer un salaire
exports.createSalaire = async (req, res) => {
  try {
    const salaire = new Salaire(req.body);
    await salaire.save();
    res.status(201).json(salaire);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du salaire", error });
  }
};


const getEmployesByAdmin = require("../utils/getEmployesByAdmin");

exports.getAllSalaires = async (req, res) => {
  try {
    const employeIds = await getEmployesByAdmin(req.user);
    const salaires = await Salaire.find({ employe: { $in: employeIds } });
    res.status(200).json(salaires);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des salaires", error });
  }
};


// Supprimer un salaire
exports.deleteSalaire = async (req, res) => {
  try {
    await Salaire.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Salaire supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du salaire", error });
  }
};
