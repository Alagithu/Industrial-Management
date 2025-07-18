const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'retard', 'conge'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Presence', presenceSchema);
