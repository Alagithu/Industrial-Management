const express = require('express');
const router = express.Router();
const reclamationController = require('../controllers/reclamationController');
const { verifyJWT } = require('../middelwares/verifyJWT');


router.post('/add', verifyJWT, reclamationController.addReclamation);
router.route('/all').get(verifyJWT,reclamationController.getAllReclamations);
router.route('/:id').delete(verifyJWT,reclamationController.deleteReclamation);
module.exports = router;