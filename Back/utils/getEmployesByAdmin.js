const User = require("../models/User");

const getEmployesByAdmin = async (currentUser) => {
  const role = currentUser.position || currentUser.role;
  const userId = currentUser._id || currentUser.id;

  if (role === 'admin') {
    return [userId];
  }

  if (role === 'responsable') {
    const responsable = await User.findById(userId);
    if (!responsable || !responsable.admin) return [];

    const employes = await User.find({ admin: responsable.admin }).select('_id');
    return employes.map(e => e._id);
  }

  return [];
};

module.exports = getEmployesByAdmin;
