const express = require('express');
const router = express.Router();
const salaireController = require('../controllers/salaireController');

// Routes
router.post('/add', salaireController.createSalaire);
router.get('/all', salaireController.getAllSalaires);
router.delete('/delete/:id', salaireController.deleteSalaire);

module.exports = router;
