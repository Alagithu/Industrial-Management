import React, { useState, useEffect, useCallback } from 'react';
import Modal from "react-modal";
import {AlertTriangle, Package, Menu, X, LogOut, Clock, DollarSign, Calendar, User, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import './DashboardAdmin.css';
Modal.setAppElement('#root');
// Composant pour les éléments de la sidebar
const SidebarItem = ({ icon, text, active, onClick,sidebarOpen }) => {
  return (
    <div
      className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}
      onClick={onClick}
    >
      <div className="sidebar-icon">{icon}</div>
      {sidebarOpen && <span className="sidebar-text">{text}</span>}
    </div>
  );
};
const logout=async () => {
  localStorage.removeItem('token'); 
  window.location.href = '/login';

}
// Composant pour la gestion des produits
const ProduitsPanel = () => {
    const [produits, setProduits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("edit");
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [searchCategory, setSearchCategory] = useState('');
    const [formData, setFormData] = useState({
      name: '',
      category: '',
      price: '',
      stock: '',
      rating: ''
    });
  
    const handleAddProduitClick = () => {
      setSelectedProduit(null);
      setModalType("add");
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        rating: ''
      });
      setIsModalOpen(true);
    };
  
    const editProduit = (produit) => {
      setSelectedProduit(produit);
      setFormData({
        name: produit.name,
        category: produit.category,
        price: produit.price,
        stock: produit.stock,
        rating: produit.rating
      });
      setModalType("edit");
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedProduit(null);
      setModalType(null);
    };
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSaveEdit = async () => {
      try {
        await axios.put(`http://localhost:5000/Products/updateProduct/${selectedProduit._id}`, formData);
        fetchProduits();
        closeModal();
      } catch (error) {
        console.error('Error updating produit:', error);
      }
    };
  
    const handleSaveAdd = async () => {
      try {
        await axios.post('http://localhost:5000/Products/addProduct', formData);
        fetchProduits();
        closeModal();
      } catch (error) {
        console.error('Error adding produit:', error);
      }
    };
  
    const fetchProduits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Products/all');
        setProduits(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };
  
    useEffect(() => {
      fetchProduits();
    }, []);
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:5000/Products/deleteProduct/${id}`);
        fetchProduits();
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
      }
    };
    const categories = [...new Set(produits.map(p => p.category))];
    const filteredProduits = searchCategory
      ? produits.filter(p => p.category === searchCategory)
      : produits;

    return (
      <div className="produits-list">
        <button className='btn-accept' onClick={handleAddProduitClick}>Ajouter Produit</button>
         <div style={{ margin: '10px 0' }}>
        <div style={{ margin: '10px 0' }}>
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="input-field"
            style={{ width: '250px', padding: '5px' }}
          >
            <option value="">Toutes catégories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel={"Modifier ou Ajouter un produit"}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2 className="modal-title">
            {modalType === "edit" ? "Modifier le produit" : "Ajouter un produit"}
          </h2>

          <div className="produit-modal-form">
            <div className="produit-modal-group">
              <label>Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="produit-modal-group">
              <label>Catégorie</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="produit-modal-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="produit-modal-group">
              <label>Note (rating)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
  
          <div className="modal-actions">
            <button className="btn-reject" onClick={closeModal}>Annuler</button>
            <button className="btn-accept" onClick={modalType === "edit" ? handleSaveEdit : handleSaveAdd}>
              {modalType === "edit" ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </Modal>
  
        <div className="data-table-container">
          <div className="table-header">
            <h3 className="table-title">Liste des Produits</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Stock</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProduits.length > 0 ? (
                  filteredProduits.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.stock}</td>
                      <td>{p.rating}</td>
                      <td className="action-buttons">
                        <button className='btn-edit' onClick={() => editProduit(p)}>Modifier</button>
                        <button className='btn-delete' onClick={() => handleDelete(p._id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>Aucun produit trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
// Composant pour la gestion des présences
const PresencesPanel = () => {
  const [users, setUsers] = useState([]);
  const [presences, setPresences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('present');
 
  const fetchUsers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get('http://localhost:5000/users/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
  }
};

  const fetchPresences = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/Presences/all", {
  headers: {
    Authorization: `Bearer ${token}`
  },
  });
      setPresences(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des présences:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPresences();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setStatus('present');
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const user = users.find(u => u._id === selectedUserId);
    setSelectedUser(user);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSavePresence = async () => {
    if (!selectedUser) return;
    const token = localStorage.getItem("token");
    try {
      const presenceData = {
        userId: selectedUser._id,
        userName: selectedUser.NomPrénom,
        role: selectedUser.position,
        date: selectedDate,
        status: status
      };

      await axios.post('http://localhost:5000/Presences/add', presenceData, {
  headers: {
    Authorization: `Bearer ${token}`
  }
  });
      fetchPresences();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la présence:', error);
    }
  };

  const handleDeletePresence = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/Presences/delete/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`
  },
  });
      fetchPresences();
    } catch (error) {
      console.error('Erreur lors de la suppression de la présence:', error);
    }
  };
  return (
    <div className="presences-list">
      <button className='btn-accept' onClick={handleOpenModal}>Marquer Présence</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={"Marquer une présence"}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className="modal-title">Marquer une présence</h2>

        <div className="presence-modal-form">
          <div className="presence-modal-group">
            <label>Employé</label>
            <select
              className="input-field"
              onChange={handleUserChange}
              value={selectedUser?._id || ''}
            >
              <option value="">Sélectionner un employé</option>
              {users.map(user => (
               <option key={user._id} value={user._id}>
                  {user.NomPrénom}
                </option>
              ))}
            </select>
          </div>
          <div className="presence-modal-group">
            <label>Date</label>
            <input
              type="date"
              className="input-field"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="presence-modal-group">
            <label>Statut</label>
            <select
              className="input-field"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="present">Présent</option>
              <option value="absent">Absent</option>
              <option value="retard">Retard</option>
              <option value="conge">Congé</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-reject" onClick={closeModal}>Annuler</button>
          <button className="btn-accept" onClick={handleSavePresence}>Enregistrer</button>
        </div>
      </Modal>

      <div className="data-table-container">
        <div className="table-header">
          <h3 className="table-title">Liste des Présences</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employé</th>
                <th>Poste</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {presences.length > 0 ? (
                presences.map((p) => (
                  <tr key={p._id}>
                    <td>{p.userName}</td>
                    <td>{p.role}</td>
                    <td>{new Date(p.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`statut-${p.status}`}>
                        {p.status === 'present' ? 'Présent' :
                         p.status === 'absent' ? 'Absent' :
                         p.status === 'retard' ? 'Retard' : 'Congé'}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button className='btn-delete' onClick={() => handleDeletePresence(p._id)}>Supprimer</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>Aucune présence enregistrée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
// Composant pour le calcul des salaires
const SalairesPanel = () => {
  const [users, setUsers] = useState([]);
  const [salaires, setSalaires] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mois, setMois] = useState(new Date().getMonth() + 1);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [tauxJournalier, setTauxJournalier] = useState(0);
  const [presences, setPresences] = useState([]);

 const fetchUsers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get('http://localhost:5000/users/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Utilisateurs récupérés :", response.data);
    setUsers(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
  }
};

  const fetchSalaires = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Salaires/all');
      setSalaires(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des salaires:', error);
    }
  };

  const fetchPresences = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Presences/all');
      setPresences(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des présences:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSalaires();
    fetchPresences();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setTauxJournalier(0);
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const user = users.find(u => u._id === selectedUserId);
    setSelectedUser(user);
  };

  const handleMoisChange = (e) => {
    setMois(parseInt(e.target.value));
  };

  const handleAnneeChange = (e) => {
    setAnnee(parseInt(e.target.value));
  };

  const handleTauxChange = (e) => {
    setTauxJournalier(parseFloat(e.target.value));
  };

  const calculerSalaire = async () => {
    if (!selectedUser || tauxJournalier <= 0) return;

    try {
      const userPresences = presences.filter(p => 
        p.userId === selectedUser._id && 
        new Date(p.date).getMonth() + 1 === mois &&
        new Date(p.date).getFullYear() === annee &&
        p.status === 'present'
      );

      const nombreJours = userPresences.length;
      const montantTotal = nombreJours * tauxJournalier;

      const salaireData = {
        userId: selectedUser._id,
        userName: `${selectedUser.NomPrénom}`,
        role: selectedUser.position,
        mois: mois,
        annee: annee,
        nombreJours: nombreJours,
        tauxJournalier: tauxJournalier,
        montantTotal: montantTotal
      };

      await axios.post('http://localhost:5000/Salaires/add', salaireData);
      fetchSalaires();
      closeModal();
    } catch (error) {
      console.error('Erreur lors du calcul du salaire:', error);
    }
  };

  const handleDeleteSalaire = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Salaires/delete/${id}`);
      fetchSalaires();
    } catch (error) {
      console.error('Erreur lors de la suppression du salaire:', error);
    }
  };

  // Générer les options pour les mois
  const moisOptions = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' }
  ];

  return (
    <div className="salaires-list">
      <button className='btn-accept' onClick={handleOpenModal}>Calculer Salaire</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={"Calculer un salaire"}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className="modal-title">Calculer un salaire</h2>

        <div className="salaire-modal-form">
          <div className="salaire-modal-group">
            <label>Employé</label>
            <select
              className="input-field"
              onChange={handleUserChange}
              value={selectedUser?._id || ''}
            >
              <option value="">Sélectionner un employé</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.NomPrénom} - {user.position}
                </option>
              ))}
            </select>
          </div>
          <div className="salaire-modal-group">
            <label>Mois</label>
            <select
              className="input-field"
              value={mois}
              onChange={handleMoisChange}
            >
              {moisOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="salaire-modal-group">
            <label>Année</label>
            <input
              type="number"
              className="input-field"
              value={annee}
              onChange={handleAnneeChange}
              min="2020"
              max="2030"
            />
          </div>
          <div className="salaire-modal-group">
            <label>Taux journalier (€)</label>
            <input
              type="number"
              className="input-field"
              value={tauxJournalier}
              onChange={handleTauxChange}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-reject" onClick={closeModal}>Annuler</button>
          <button className="btn-accept" onClick={calculerSalaire}>Calculer</button>
        </div>
      </Modal>

      <div className="data-table-container">
        <div className="table-header">
          <h3 className="table-title">Liste des Salaires</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employé</th>
                <th>Poste</th>
                <th>Mois/Année</th>
                <th>Jours présents</th>
                <th>Taux journalier</th>
                <th>Montant total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaires.length > 0 ? (
                salaires.map((s) => (
                  <tr key={s._id}>
                   <td>{users.find(u => u._id === s.userId)?.NomPrénom || s.userName}</td>
                    <td>{s.role}</td>
                    <td>{moisOptions.find(m => m.value === s.mois)?.label} {s.annee}</td>
                    <td>{s.nombreJours}</td>
                    <td>{s.tauxJournalier} €</td>
                    <td>{s.montantTotal} €</td>
                    <td className="action-buttons">
                      <button className='btn-delete' onClick={() => handleDeleteSalaire(s._id)}>Supprimer</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center' }}>Aucun salaire calculé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CongesPanel = () => {
  const [conges, setConges] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [Users, setUsers] = useState([]);
  const [,setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    NomPrenom: '',
    email: '',
    dateDebut: '',
    dateFin: '',
  });

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/users/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchConges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/DemandeConge/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConges(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des congés:', error);
    }
  };

  useEffect(() => {
    fetchConges();
  }, []);

  const envoyerEmail = async (email) => {
    try {
      await axios.post('http://localhost:5000/api/email/send', {
        distinationEmail: email,
        emailSubject: 'Congé accepté',
        emailBody: 'Votre demande de congé a été acceptée.',
      });
      console.log("Email envoyé à :", email);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserChange = (e) => {
    const selectedId = e.target.value;
    const selected = Users.find((u) => u._id === selectedId);

    if (selected) {
      setSelectedUser(selected);
      setFormData(prev => ({
        ...prev,
        NomPrenom: selectedId,
        email: selected.email,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/DemandeConge/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModalIsOpen(false);
      setFormData({ NomPrenom: '', email: '', dateDebut: '', dateFin: '' });
      setSelectedUser(null);
      fetchConges();
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
    }
    console.log("FormData envoyé :", formData);
  };

  const handleUpdate = async (_id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/DemandeConge/${_id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConges(prev => prev.map(d => d._id === _id ? { ...d, statut: 'accepté' } : d));
    } catch (err) {
      console.error("Erreur lors de l'acceptation :", err);
    }
  };

  const handleDelete = async (_id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/DemandeConge/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConges(prev => prev.filter(d => d._id !== _id));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  return (
    <>
      <button className="btn-accept" onClick={() => setModalIsOpen(true)}>Demande Congé</button>
      <div className="data-table-container">
        <div className="table-header">
          <h3 className="table-title">Liste des Congés</h3>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Demande Congé"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Nouvelle Demande de Congé</h2>
          <form onSubmit={handleSubmit} className="form-modal">
            <select
              value={formData.NomPrenom}
              onChange={handleUserChange}
              required
            >
              <option value="">Sélectionner un utilisateur</option>
              {Users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.NomPrénom}
                </option>
              ))}
            </select>
            <input
              type='email'
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder='Email'
            />
            <label>Date de début</label>
            <input
              type="date"
              name="dateDebut"
              value={formData.dateDebut}
              onChange={handleChange}
              required
            />
            <label>Date de fin</label>
            <input
              type="date"
              name="dateFin"
              value={formData.dateFin}
              onChange={handleChange}
              required
            />
             <div style={{display: 'flex' ,justifyContent:'space-between'}}>
              <button type="button" onClick={() => setModalIsOpen(false)} className="btn-reject" style={{marginTop:'10px'}}>Annuler</button>
              <button  type="submit" style={{backgroundColor: '#151621',width:'120px',color: 'white',padding: '10px ',border: 'none',borderRadius: '5px',cursor: 'pointer',fontWeight: 'bold',fontSize: '14px',
              }}>Enregistrer</button>
            </div>
          </form>
        </Modal>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom&Prénom</th>
                <th>Email</th>
                <th>Date Début</th>
                <th>Date Fin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conges.length > 0 ? (
                conges.map(conge => (
                  <tr key={conge._id}>
                    <td>{conge.NomPrenom?.NomPrénom}</td>
                    <td>{conge.email}</td>
                    <td>{conge.dateDebut?.split("T")[0]}</td>
                    <td>{conge.dateFin?.split("T")[0]}</td>
                    <td className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          handleUpdate(conge._id);
                          envoyerEmail(conge.email);
                        }}
                      >
                        Accepter
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(conge._id)}>Supprimer</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>Aucune demande trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

  const ReclamationsPanel = () => {
    const [reclamations, setReclamations] = useState([]);
    const [ModalIsOpen, setModalOpen] = useState(false);
    const [newReclamation, setNewReclamation] = useState({
      type: '',
      description: '',
      dateRec: '',
    });
  
    // Charger les réclamations
    useEffect(() => {
      fetchReclamations();
    }, []);
  
    const fetchReclamations = async () => {
      try {
         const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/Reclamations/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReclamations(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des réclamations :", error);
      }
    };
  
    const handleDelete = async (_id) => {
      try {
         const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/Reclamations/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        setReclamations(prev => prev.filter(r => r._id !== _id));
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    };
  
    const handleInputChange = (e) => {
      setNewReclamation({ ...newReclamation, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const token = localStorage.getItem("token");
        await axios.post('http://localhost:5000/Reclamations/add', newReclamation, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchReclamations();
        setModalOpen(false);
        setNewReclamation({ type: '', description: '', dateRec: '' });
      } catch (error) {
        console.error("Erreur lors de l'ajout de la réclamation :", error);
      }
    };
  
    return (
        <>
         <button className="btn-accept" onClick={() => setModalOpen(true)}>Passer une Réclamation</button>
      <div className="data-table-container">
        <div className="table-header">
          <h3 className="table-title">Liste des Réclamations</h3>
        </div>
  
  
        {/* Modal pour Ajouter Réclamation */}
        <Modal
          isOpen={ModalIsOpen}
          onRequestClose={() => setModalOpen(false)}
          contentLabel="Ajouter Réclamation"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Nouvelle Réclamation</h2>
          <form onSubmit={handleSubmit} className="modal-form">
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={newReclamation.type}
              onChange={handleInputChange}
              required
            />
            <label>Description</label>
            <textarea
              name="description"
              value={newReclamation.description}
              onChange={handleInputChange}
              required
            />
            <label>Date de réclamation</label>
            <input
              type="date"
              name="dateRec"
              value={newReclamation.dateRec}
              onChange={handleInputChange}
              required
            />
            <div className="modal-actions">
              <button className="btn-reject" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="btn-accept">Enregistrer</button>
            </div>
          </form>
        </Modal>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employé</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date de réclamation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reclamations.length > 0 ? (
                reclamations.map(reclamation => (
                  <tr key={reclamation._id}>
                    <td>{reclamation.employe?.NomPrénom}</td>
                    <td>{reclamation.type}</td>
                    <td>{reclamation.description}</td>
                    <td>{new Date(reclamation.dateRec).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button className="btn-delete" onClick={() => handleDelete(reclamation._id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>Aucune réclamation trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
    );
  };
const CommandesPanel = () => {
  const [commandes, setCommandes] = useState([]);

  const fetchCommandes = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:5000/Commandes/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setCommandes(response.data);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
  }
};

  useEffect(() => {
    fetchCommandes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Commandes/delete/${id}`);
      fetchCommandes();
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande :', error);
    }
  };

  return (
    <div className="commandes-list">
      <h3 className="table-title">Liste des Commandes</h3>
      {commandes.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produits (Nom / Quantité)</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((commande) => (
                <tr key={commande._id}>
                  <td>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                      {commande.produits.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.produit?.name || 'Produit inconnu'}</strong> — Qté: {item.quantite}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{new Date(commande.date).toLocaleDateString('fr-FR')}</td>
                  <td className="action-buttons">
                    <button className="btn-delete" onClick={() => handleDelete(commande._id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
// Composant principal du Dashboard
export default function DashboardResponsable() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("produits");
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h1 className="sidebar-title">Dashboard</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <SidebarItem icon={<Package size={20} />} text="Stock" active={activeTab === 'produits'} onClick={() => setActiveTab('produits')} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<Clock size={20} />} text="Présences" active={activeTab === 'presences'} onClick={() => setActiveTab('presences')} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<DollarSign size={20} />} text="Salaires" active={activeTab === 'salaires'} onClick={() => setActiveTab('salaires')} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<Calendar size={20} />} text="Congés" active={activeTab === 'conges'} onClick={() => setActiveTab('conges')} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<ShoppingCart size={20} />} text="Commandes" active={activeTab === 'commandes'} onClick={() => setActiveTab('commandes')} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<AlertTriangle size={20} />} text="Réclamations" active={activeTab === 'reclamations'} onClick={() => setActiveTab('reclamations')} sidebarOpen={sidebarOpen} />
          <div className="sidebar-footer">
            <SidebarItem icon={<LogOut size={20} />} text="Déconnexion" onClick={logout} sidebarOpen={sidebarOpen} active={false} />
          </div>
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="main-content">
        <header className="content-header">
          <div className="header-container">
            <h2 className="page-title">
              {{
                produits: 'Gestion des Produits',
                presences: 'Gestion des Présences',
                salaires: 'Calcul des Salaires',
                commandes: 'Gestion des Commandes',
                reclamations: 'Suivi des Réclamations',
                conges: 'Demandes de Congés',
              }[activeTab]}
            </h2>
            <div className="header-user-info">
              <div className="header-user">
                <User size={20} />
                <span>Responsable</span>
              </div>
            </div>
          </div>
        </header>
        <main className="content-body">
          {activeTab === 'produits' && <ProduitsPanel />}
          {activeTab === 'presences' && <PresencesPanel />}
          {activeTab === 'salaires' && <SalairesPanel />}
          {activeTab === 'commandes' && <CommandesPanel />}
          {activeTab === 'conges' && <CongesPanel />}
          {activeTab === 'reclamations' && <ReclamationsPanel />}
        </main>
      </div>
    </div>
  );
}


