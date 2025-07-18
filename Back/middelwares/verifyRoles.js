const allowedRoles=["employé","user","admin","responsable","technicien"];

/*const afficherRoles=(...roles)=>{
    console.log(roles)
}
afficherRoles('admin','manager','user');*/
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user?.role) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    
    const rolesArray = [...allowedRoles];
    const result = rolesArray.includes(req.user.role);
    
    if (!result) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    
    next();
  };
};

module.exports={verifyRoles,allowedRoles};