import React, {useState } from 'react';
import './DemandeConge.css';

const DemandeCongesPage = () => {
  const [newDemande, setNewDemande] = useState({
    nom: '',
    prenom:'',
    departement:'',
    sexe:'',
    dateDebut: '',
    dateFin: ''
  });
  const handleChange = e => {
    const { name, value } = e.target;
    setNewDemande({ ...newDemande, [name]: value });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/DemandeConge/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDemande)
      });
      if (res.ok) {
        
        setNewDemande({ nom: '',prenom: '',departement:'',sexe: '', dateDebut: '', dateFin: '' });
      }
    } catch (err) {
      console.error('Erreur ajout:', err);
    }
  };


  return (
    <div className="register-container">
      <h2 className="register-title">Demandes de Congés</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Nom</label>
          <input type="text" name="nom" value={newDemande.nom} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Prénom</label>
          <input type="text" name="prenom" value={newDemande.prenom} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Departement</label>
          <input type="text" name="departement" value={newDemande.departement} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Sexe</label>
          <select type="text" name="sexe" value={newDemande.sexe} onChange={handleChange} required >
            <option>Homme</option>
            <option>Femme</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date Début</label>
          <input type="date" name="dateDebut" value={newDemande.dateDebut} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date Fin</label>
          <input type="date" name="dateFin" value={newDemande.dateFin} onChange={handleChange} required />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">Ajouter</button>
        </div>
      </form>
    </div>
  );
};

export default DemandeCongesPage;
