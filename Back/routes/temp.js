// routes/commandes.js
const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');
const { verifyJWT } = require('../middelwares/verifyJWT');

router.post('/add', commandeController.addCommande);
router.get('/all',verifyJWT, commandeController.getCommandes);
router.delete('/delete/:id', commandeController.deleteCommande);

module.exports = router;
