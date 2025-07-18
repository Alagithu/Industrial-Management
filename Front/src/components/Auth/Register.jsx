import React, { useState } from 'react';
import axios from "axios";
import './register.css';

const Register = () => {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    position: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep === 0 && (!data.firstName || !data.lastName || !data.email || !data.company)) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (data.password !== data.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/register", data);
      console.log('Registration successful:', response.data);
      alert("Registration successful");
    } catch (err) {
      console.error('Error during registration:', err);
      setError(err.response ? err.response.data.message : 'Une erreur est survenue pendant l\'inscription.');
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Inscription à la plateforme industrielle</h1>
      <form onSubmit={currentStep === 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        {currentStep === 0 && (
          <>
            <div className="form-grid">
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" name="firstName" value={data.firstName} onChange={handleChange} required placeholder="Prénom" />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" name="lastName" value={data.lastName} onChange={handleChange} required placeholder="Nom" />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Email professionnel</label>
                <input type="email" name="email" value={data.email} onChange={handleChange} required placeholder="votre@gmail.com" />
              </div>
              <div className="form-group">
                <label>Entreprise/Usine</label>
                <input type="text" name="company" value={data.company} onChange={handleChange} required placeholder="Nom de votre entreprise" />
              </div>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <div className="form-grid">
              <div className="form-group">
                <label>Téléphone professionnel</label>
                <input type="tel" name="phone" value={data.phone} onChange={handleChange} required placeholder="+216 xx xxx xxx" />
              </div>
              <div className="form-group">
                <label>Poste occupé</label>
                <select 
                  name="position" 
                  value={data.position} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Votre poste</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Mot de passe</label>
                <input 
                  type="password" 
                  name="password" 
                  value={data.password} 
                  onChange={handleChange} 
                  placeholder="XXXXXXXX" 
                  required 
                  minLength="8" 
                />
              </div>

              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={data.confirmPassword} 
                  placeholder="XXXXXXXX" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </>
        )}

        <div className="button-group">
          {currentStep > 0 && (
            <button type="button" className="prev-button1" onClick={handlePrevious}>
              Précédent
            </button>
          )}
          {currentStep === 1 && (
            <button type="submit" className="submit-button">
              S'inscrire
            </button>
          )}
        </div>

        {currentStep === 0 && (
          <button type="button" className="next-button" onClick={handleNext}>
            Suivant
          </button>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="login-link">
          <p>
            Déjà inscrit ? <a href="/login">Se connecter</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;