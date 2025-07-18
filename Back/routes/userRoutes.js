const express = require("express");
const User=require("../models/Admin");
router = express.Router();
const userController = require("../controllers/userControllers");
const { verifyJWT } = require("../middelwares/verifyJWT");
//const {verifyRoles}= require("../middelwares/verifyRoles");
router.use(verifyJWT);
router.get("/all",verifyJWT,userController.getAllUsers);
router.post("/add",verifyJWT,userController.addUser);
//router.route("/all").get(verifyRoles(),userController.getAllUsers);
router.route("/:id").get(userController.getUserById);
router.route("/:id").put(userController.updateUser);
router.route("/:id").delete(userController.deleteUser);
router.get('/role/:role', async (req, res) => {
    try {
      const { position } = req.params;
      if (!['technicien', 'responsable', 'employé'].includes(position)) {
        return res.status(400).json({ message: "Rôle invalide" });
      }
      const users = await User.find({ position });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  });
module.exports = router;