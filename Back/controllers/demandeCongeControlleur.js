const DemandeConges =require("../models/DemandeConges");
const User = require("../models/User");
const Admin=require("../models/Admin");
// Créer une nouvelle demande de congé
exports.createDemande = async (req, res) => {
  try {
    const { NomPrenom,email, dateDebut, dateFin } = req.body;
    // Vérifier si les champs sont présents
    if (!NomPrenom||!email|| !dateDebut || !dateFin) {
      return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
    }
    const demande = new DemandeConges({
      NomPrenom,
      email,
      dateDebut,
      dateFin
    });
    await demande.save();
    res.status(201).json(demande);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la demande de congé', details: error });
  }
};

exports.getAllDemandes = async (req, res) => {
  try {
    const currentUser = req.user;
    const userId = currentUser._id || currentUser.id;
    const position = currentUser.position;

    let adminId;

    if (position === 'admin') {
      adminId = userId;
    } else if (position === 'responsable') {
      const responsable = await User.findById(userId).lean();
      if (!responsable || !responsable.admin) {
        return res.status(403).json({ message: "Responsable non lié à un admin." });
      }
      adminId = responsable.admin;
    } else {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    //  Trouver tous les utilisateurs liés à cet admin
    const employes = await User.find({ admin: adminId }).select('_id');

    //  Extraire leurs _id
    const employeIds = employes.map(e => e._id.toString());

    // Filtrer les demandes pour ne récupérer que celles liées à ces utilisateurs
    const demandes = await DemandeConges.find({ NomPrenom: { $in: employeIds } }).populate('NomPrenom');

    res.json(demandes);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes de congé :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};



exports.getDemandeById = async (req, res) => {
  try {
    const demande = await DemandeConges.findById(req.params.id); 
    if (!demande) {
      return res.status(404).json({ message: 'Demande de congé non trouvée' });
    }
    res.status(200).json(demande);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la demande de congé', details: error });
  }
};

exports.updateDemande = async (req, res) => {
  try {
    const { statut } = req.body;
    if (statut && !['En attente', 'Accepté', 'Refusé'].includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide, il doit être "En attente", "Accepté" ou "Refusé"' });
    }
    const demande = await DemandeConges.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
    if (!demande) {
      return res.status(404).json({ message: 'Demande de congé non trouvée' });
    }
    res.status(200).json(demande); 
    demande.statut=demande.Actions;
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la demande', details: error });
  }
};

// Supprimer une demande de congé
exports.deleteDemande = async (req, res) => {
  try {
    const demande = await DemandeConges.findByIdAndDelete(req.params.id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande de congé non trouvée' });
    }
    res.status(200).json({ message: 'Demande de congé supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la demande de congé', details: error });
  }
};
