const mongoose = require('mongoose');
const reclamationSchema = new mongoose.Schema({
  employe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true, 
  },
  description:{
    type:String,
    required:true,
  },
  dateRec: {
    type: Date,
    required: true
  },
});

module.exports = mongoose.model('Reclamation', reclamationSchema);