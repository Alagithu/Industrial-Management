const express = require("express");
const Departement = require("../models/Departement");
const router = express.Router();
const departementController = require("../controllers/departementController");
const { verifyJWT } = require("../middelwares/verifyJWT");
router.use(verifyJWT);
router.route("/all").get(verifyJWT,departementController.getDepartement);
router.route("/add").post(verifyJWT,departementController.addDepartement);
router.route("/delete/:id").delete(verifyJWT,departementController.deleteDepartement);
router.route("/update/:id").put(verifyJWT,departementController.updateDepartement);

module.exports = router;