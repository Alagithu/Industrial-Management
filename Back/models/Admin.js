const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const adminSchema = new mongoose.Schema({
firstName:{
    type:String,
    required:true
},
lastName:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
company:{
    type:String,
    required:true
},
position:{
    type:String,
    default: 'admin'
},
phone:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
confirmPassword:{
    type:String,
    required:true
},
// Références aux utilisateurs et départements
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  departements: [{ type: Schema.Types.ObjectId, ref: 'Departement' }]

},{timestamps:true});

module.exports = mongoose.model("Admin",adminSchema);