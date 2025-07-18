const express = require('express');
const router = express.Router();
const demandeCongeController = require('../controllers/demandeCongeControlleur');
const { verifyJWT } = require('../middelwares/verifyJWT');


router.route('/create').post(verifyJWT,demandeCongeController.createDemande);
router.route('/all').get(verifyJWT,demandeCongeController.getAllDemandes);
router.route('/:id').get(verifyJWT,demandeCongeController.getDemandeById);
router.route('/:id').put(verifyJWT,demandeCongeController.updateDemande);
router.route('/:id').delete(verifyJWT,demandeCongeController.deleteDemande);
module.exports = router;
