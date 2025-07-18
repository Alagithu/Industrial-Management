const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/presenceContoller');
const { getAllPresences } = require("../controllers/presenceContoller");
const { verifyJWT } = require('../middelwares/verifyJWT');
router.post('/add',verifyJWT, presenceController.createPresence);
router.get('/all', verifyJWT ,getAllPresences);
router.delete('/delete/:id',verifyJWT, presenceController.deletePresence);

module.exports = router;
