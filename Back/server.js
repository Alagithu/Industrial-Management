require('dotenv').config()
const fs = require('fs');
const mongoose  = require('mongoose');
//console.log(process.env.NODE_ENV);
const jwt = require('jsonwebtoken');
const express = require ("express");
const app = express();
const connectDB = require("./config/db.config");

connectDB();

const PORT = process.env.PORT || 5000;

const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(cookieParser());

app.use(express.json());
const emailRoutes = require('./routes/email');
app.use('/api/email', emailRoutes);

app.use("/", require('./routes/root'));
app.use("/auth", require('./routes/authRoutes'));
app.use("/users", require('./routes/userRoutes'));
app.use("/Products",require('./routes/productRoutes'));
app.use("/Departements",require('./routes/departementRoutes'));
app.use("/DemandeConge",require('./routes/congeRoutes'));
app.use("/Reclamations",require('./routes/reclamationRouter'));
app.use("/Presences",require('./routes/presenceRoutes'));
app.use("/Salaires",require('./routes/salaireRoutes'));
app.use('/Commandes', require('./routes/temp'));


mongoose.connection.once('open', ()=>{
console.log('connected to the database');
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);

});

})





