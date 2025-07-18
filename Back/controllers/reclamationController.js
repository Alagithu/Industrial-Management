const Reclamation = require('../models/Reclamation');
const User = require('../models/User');

// Ajouter une réclamation
const addReclamation = async (req, res) => {
  try {
    const { type, description, dateRec } = req.body;

    // Vérifie que req.user existe et a un _id
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const newReclamation = new Reclamation({
      employe: req.user.id,
      type,
      description,
      dateRec
    });

    await newReclamation.save();
    res.status(201).json({ message: 'Réclamation ajoutée avec succès', reclamation: newReclamation });
  } catch (error) {
    console.error('Erreur lors de l\'ajout :', error);
    res.status(400).json({ message: 'Erreur lors de l\'ajout', error: error.message });
  }
};


// Obtenir toutes les réclamations
const getAllReclamations = async (req, res) => {
  try {
    const userRole = req.user.role || req.user.position;
    const userId = req.user._id || req.user.id;

    let adminId;

    if (userRole === 'admin') {
      adminId = userId;
    } else if (userRole === 'responsable') {
      const responsable = await User.findById(userId);
      if (!responsable || !responsable.admin) {
        return res.status(403).json({ message: "Responsable non lié à un admin." });
      }
      adminId = responsable.admin;
    } else {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    // Récupérer les utilisateurs liés à cet admin
    const employes = await User.find({ admin: adminId }).select('_id');
    const employeIds = employes.map(e => e._id.toString());

    // Filtrer les réclamations
    const reclamations = await Reclamation.find({ employe: { $in: employeIds } })
      .populate('employe', 'NomPrénom email position');

    res.status(200).json(reclamations);
  } catch (error) {
    console.error("Erreur lors du chargement des réclamations :", error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des réclamations.' });
  }
};


// Supprimer une réclamation
const deleteReclamation = async (req, res) => {
  try {
    const { id } = req.params;
    await Reclamation.findByIdAndDelete(id);
    res.status(200).json({ message: 'Réclamation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error });
  }
};

module.exports = {
  addReclamation,
  getAllReclamations,
  deleteReclamation,
};
