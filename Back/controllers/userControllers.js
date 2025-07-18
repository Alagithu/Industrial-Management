const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// Récupérer tous les utilisateurs, sans mot de passe
const getAllUsers = async (req, res) => {
  try {
    const currentUser = req.user;
    const userId = currentUser._id||currentUser.id;
    const position = currentUser.position;
    let users = [];
    if (position === 'admin') {
      users = await User.find({ admin: userId }).select("-password").lean();
    } else if (position === 'responsable'|| position === 'technicien' || position === 'employé') {
      const responsable = await User.findById(userId).lean();
      if (!responsable || !responsable.admin) {
        return res.status(403).json({ message: "Responsable non lié à un admin." });
      }
      users = await User.find({ admin: responsable.admin }).select("-password").lean();
    } else {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};



// Récupérer un utilisateur par ID, sans mot de passe
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// Ajouter un nouvel utilisateur
const addUser = async (req, res) => {
  const { NomPrénom, email, company, position, phone, password} = req.body;

  try {
    // Validation des données
    if (!NomPrénom || !email || !password) {
      return res.status(400).json({
        message: 'Nom, email et mot de passe sont obligatoires'
      });
    }

    // Vérification de l'email existant
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'Cet email est déjà utilisé'
      });
    }
    
    // Création de l'utilisateur
    const newUser = await User.create({
      NomPrénom,
      email,
      admin: req.user.id,
      company: company || '',
      position: position || 'employé',
      phone: phone || '',
      password: password
    });
    const userResponse = newUser.toObject();
    
    res.status(201).json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message // Pour le débogage
    });
  }
};
// Mettre à jour un utilisateur, y compris le mot de passe hashé
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Si mot de passe : le hacher
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur mis à jour avec succès", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour", error: error.message });
  }
};
// Supprimer un utilisateur par ID
const deleteUser = async (req, res) => {
  const {id} =req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression de l'utilisateur" });
  }
};
module.exports = { getAllUsers, getUserById, updateUser, addUser, deleteUser };