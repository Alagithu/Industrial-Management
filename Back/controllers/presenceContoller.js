const Presence = require('../models/Presence');
const getEmployesByAdmin = require("../utils/getEmployesByAdmin");
exports.createPresence = async (req, res) => {
  try {
    const presence = new Presence(req.body);
    await presence.save();
    res.status(201).json(presence);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getAllPresences = async (req, res) => {
  try {
    // Vérifie que req.user existe
    if (!req.user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const employeIds = await getEmployesByAdmin(req.user); 
    const presences = await Presence.find({ userId: { $in: employeIds } }).sort({ date: -1 });

    res.status(200).json(presences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePresence = async (req, res) => {
  try {
    await Presence.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Présence supprimée.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
