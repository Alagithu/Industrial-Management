
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
NomPrénom:{
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
    enum:['responsable','technicien','employé']
},
phone:{
    type:String,
    required:true
},
admin: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Admin",
  required: true
}, 
password:{
    type:String,
    required:true
},},{timestamps:true});

module.exports = mongoose.model("User",userSchema);