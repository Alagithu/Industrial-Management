const Departement = require('../models/Departement');
const bcrypt=require('bcrypt');
const fs=require('fs');

//********************************************** */
const getDepartement = async(req,res)=>{
  const adminId = req.user.id || req.user._id; 
const departements = await Departement.find({  admin: adminId });
if (!departements.length){
    return res.status(400).json({message: "No Departement found"});
}
res.json(departements);
}
//********************************************************** */
const addDepartement = async (req, res) => {
    const { nom, description,responsable,dateCreation} = req.body;
    
    if (!nom || !description ||!responsable || !dateCreation  ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const duplicatedName = await Departement.findOne({ nom }).exec();
      if (duplicatedName) {
        return res.status(409).json({ message: "departement already exists" });
      }
      await Departement.create({
        nom,
        description,
        admin: req.user.id,
        responsable,
        dateCreation
      });
      return res.status(201).json({ message: "departement created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  //************************************************************** */
  const updateDepartement = async (req, res) => {
    try {
      const { nom, description,responsable, dateCreation } = req.body;
  
      const update = {
        nom,
        description,
        responsable
      };
  
      if (dateCreation) {
        update.dateCreation = new Date(dateCreation); 
      }
  
      const updated = await Departement.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true, runValidators: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: 'Département non trouvé' });
      }
  
      res.json(updated);
    } catch (err) {
      console.error('Erreur dans updateDepartement:', err);
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  };
  
  //*************************************************************** */
  const deleteDepartement = async (req, res) => {
    const { id } = req.params;  
    try {
        const departement = await Departement.findByIdAndDelete(id);  
        if (!departement)  return res.json({ message: 'Departement not found' });
        res.json({ message: 'Departement removed successfully' });
    }catch (error) {
      res.status(500).json({ message: "Erreur serveur lors de la suppression de Departement" });
    }
};
 module.exports = {getDepartement,addDepartement,updateDepartement,deleteDepartement};