const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
//Register
const register = async (req, res) => {
  const { firstName, lastName, email, company,position, phone, password ,confirmPassword } = req.body;
  if (!firstName || !lastName || !email|| !company  || !position || !phone ||  !password  || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const duplicatedEmail = await Admin.findOne({ email }).exec();
    if (duplicatedEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({
      firstName,
      lastName,
      email,
      phone,
      company,
      confirmPassword:hashedPassword,
      position:position || "admin", 
      password: hashedPassword,
    });
     return res.status(201).json({ message:"Administrateur créé avec succès"});
      
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
//Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    // Chercher dans la table Admin
    const foundAdmin = await Admin.findOne({ email }).exec();
    if (foundAdmin) {
      const isMatch = await bcrypt.compare(password, foundAdmin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe incorrect (admin)" });
      }

      const accessToken = jwt.sign(
        {
          id: foundAdmin._id,
          role: "admin",
          position: foundAdmin.position,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Connexion réussie (admin)",
        accessToken,
        id: foundAdmin._id,
        email: foundAdmin.email,
        role: "admin",
        position: foundAdmin.position,
      });
    }
    // Chercher dans la table User
    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
      // Comparaison simple (mots de passe non hachés)
      if (password !== foundUser.password) {
        return res.status(401).json({ message: "Mot de passe incorrect (utilisateur)" });
      }

      const accessToken = jwt.sign(
        {
          id: foundUser._id,
          role: foundUser.role, 
          position: foundUser.position,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        message: "Connexion réussie (utilisateur)",
        accessToken,
        id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role,
        position: foundUser.position,
      });
    }

    // Aucun compte trouvé
    return res.status(401).json({ message: "Utilisateur non trouvé" });

  } catch (error) {
    console.error("Erreur de connexion :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  register,
  login,
};
