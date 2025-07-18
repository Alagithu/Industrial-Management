import { useState, useEffect, useCallback } from 'react';
import Modal from "react-modal";
import { User, AlertTriangle, Calendar, Menu, X, Users, LogOut,Building2 } from 'lucide-react';
import axios from 'axios';
import './DashboardAdmin.css';



// Composant pour les éléments de la sidebar
const SidebarItem = ({ icon, text, active, onClick, sidebarOpen }) => {
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
const DepartementsPanel = () => {
  const [users, setUsers] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [formData, setFormData] = useState({ nom: '', description: '',responsable:'', dateCreation: '' });

  const fetchDepartements = async () => {
    try {
       const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5000/Departements/all',{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
      setDepartements(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des départements:', err);
    }
  };
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5000/users/all',{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchDepartements();
  }, []);

  const openModalForEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({
      nom: dept.nom,
      description: dept.description,
      responsable:dept.responsable,
      dateCreation: dept.dateCreation ? dept.dateCreation.slice(0, 10) : ''
    });
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setSelectedDept(null);
    setFormData({ nom: '', description: '',responsable:'', dateCreation: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDept(null);
    setFormData({ nom: '', description: '',responsable:'', dateCreation: '' });
  };

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    if (selectedDept) {
      // Modifier un département
      await axios.put(
        `http://localhost:5000/Departements/update/${selectedDept._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      // Ajouter département
      const token = localStorage.getItem("token");
      console.log("Formulaire envoyé :", formData);
      await axios.post(
        "http://localhost:5000/Departements/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    fetchDepartements();
    closeModal(); 
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);

  }
};


  const handleDelete = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/Departements/delete/${_id}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
      fetchDepartements();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  return (
    <><button onClick={openModalForAdd} className="btn-accept">Ajouter Département</button>
    <div className="data-table-container">
      <div className="table-header">
        <h3 className="table-title">Liste des Départements</h3>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Responsable</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departements.length > 0 ? (
              departements.map((d) => (
                <tr key={d._id}>
                  <td>{d.nom}</td>
                  <td>{d.description}</td>
                  <td>{d.responsable}</td>
                  <td>{new Date(d.dateCreation).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <button className="btn-edit" onClick={() => openModalForEdit(d)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(d._id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4">Aucun département trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Modifier ou Ajouter un Département"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className="modal-title">{selectedDept ? "Modifier Département" : "Ajouter Département"}</h2>
        <div className="modal-form">
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Responsable</label>
            <select
              name="responsable"
              className="input-field"
              value={formData.responsable}
              onChange={handleChange}
            >
              <option value="">Sélectionner un responsable</option>
              {users
                .filter(user => user.position === "responsable")
                .map(user => (
                  <option key={user._id} value={user.NomPrénom}>
                    {user.NomPrénom}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date de Création</label>
            <input
              type="date"
              name="dateCreation"
              value={formData.dateCreation}
              onChange={handleChange}
            />
          </div>
          <div className="modal-actions">
            <button className="btn-reject-user" onClick={closeModal}>Annuler</button>
            <button className="btn-accept-user" onClick={handleSave}>Enregistrer</button>
          </div>
        </div>
      </Modal>
    </div>
    </>
  );
};

// Composant pour la liste des utilisateurs
const UsersPanel = () => {
  const [users, setUsers] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("edit");
  const [selectedUser, setSelectedUser] = useState(null);

  // Fonction pour ouvrir le modal d'ajout d'utilisateur
  const handleAddUserClick = () => {
    setSelectedUser(null); // Réinitialise selectedUser
    setModalType("add"); // Définit le modal à "add"
    setIsModalOpen(true); // Ouvre le modal
  };

  // Fonction pour modifier un utilisateur
  const editUser = (user) => {
    setSelectedUser(user);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalType(null);
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      setUsers(users.map((user) =>
        user._id === selectedUser._id ? selectedUser : user
      ));
       const token = localStorage.getItem("token");
      // Update user 
      axios.put(`http://localhost:5000/users/${selectedUser._id}`, selectedUser,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
        .catch(error => console.error('Error updating user:', error));
    }
    closeModal();
  };

  const handleSaveAdd = async () => {
    
  try {
    if (!selectedUser?.NomPrénom || !selectedUser?.email || !selectedUser?.password) {
      alert('Nom, email et mot de passe sont obligatoires');
      return;
    }
    const token = localStorage.getItem("token");
    const response = await axios.post('http://localhost:5000/users/add', {
      NomPrénom: selectedUser.NomPrénom,
      email: selectedUser.email,
      company: selectedUser.company || '',
      position: selectedUser.position || 'employé',
      phone: selectedUser.phone || '',
      password: selectedUser.password
    }, {
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      }
    });

    if (response.data.success) {
      setUsers([...users, response.data.user]);
      closeModal();
    } else {
      alert(response.data.message || 'Erreur lors de l\'ajout');
    }
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    alert(error.response?.data?.message || 'Erreur serveur');
  }
};

  const fetchUsers = async () => {
     const token = localStorage.getItem("token");
    try {
      const response = await axios.get('http://localhost:5000/users/all',{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (_id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/users/${_id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });;
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  return (
    <div className="users-list">
      <button className='btn-accept' onClick={handleAddUserClick}>Ajouter Utilisateur</button>
      
<Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  ariaHideApp={false}
  contentLabel={"Modifier ou Ajouter un utilisateur"}
  className="modal-content"
  overlayClassName="modal-overlay"
>
  <h2 className="modal-title">
    {modalType === "edit" ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
  </h2>

  <div className="user-modal-form">
    {[
      { label: "Nom & Prénom", key: "NomPrénom", type: "text" },
      { label: "Email", key: "email", type: "email" },
      { label: "Société", key: "company", type: "text" },
      { 
        label: "Poste", 
        key: "position", 
        type: "select",
        options: ["responsable", "technicien", "employé"]
      },
      { label: "Téléphone", key: "phone", type: "text" },
      { label: "Password", key: "password", type: "password" }
    ].map(({ label, key, type, options }) => (
      <div key={key} className="user-modal-group">
        <label>{label}</label>
        {type === "select" ? (
          <select
            value={selectedUser?.[key] || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, [key]: e.target.value })}
            className="input-field"
          >
            <option value="">Sélectionnez un poste</option>
            {options.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            placeholder={label}
            value={selectedUser?.[key] || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, [key]: e.target.value })}
            className="input-field"
          />
        )}
      </div>
    ))}
  </div>

  <div className="modal-actions">
    <button className="btn-reject-user" onClick={closeModal}>Annuler</button>
    <button className="btn-accept-user" onClick={modalType === "edit" ? handleSaveEdit : handleSaveAdd}>
      {modalType === "edit" ? "Enregistrer" : "Ajouter"}
    </button>
  </div>
</Modal>



<div className="data-table-container">
      <div className="table-header">
        <h3 className="table-title">Liste des Utilisateurs</h3>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom & Prénom</th>
              <th>Email</th>
              <th>Société</th>
              <th>Poste</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.NomPrénom}</td>
                <td>{u.email}</td>
                <td>{u.company}</td>
                <td>{u.position}</td>
                <td>{u.phone}</td>
                <td className="action-buttons">
                  <button className='btn-edit' onClick={() => editUser(u)}>Modifier</button>
                  <button className='btn-delete' onClick={() => handleDelete(u._id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};



// Composant pour la liste des conges
const CongesPanel = () => {
  const [conges, setConges] = useState([]);
  const [,setUsers] = useState([]);
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
    }},[]);

  useEffect(() => {
    fetchUsers();
  });

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
      <div className="data-table-container">
        <div className="table-header">
          <h3 className="table-title">Liste des Congés</h3>
        </div>
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

  // Charger les réclamations au montage
  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/reclamations/all', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
        setReclamations(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des réclamations :", error);
      }
    };

    fetchReclamations();
  }, []);

  // Supprimer une réclamation
  const handleDelete = async (_id) => {
    try {
       const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/Reclamations/${_id}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
      setReclamations(prev => prev.filter(r => r._id !== _id));
      console.log(`Réclamation ${_id} supprimée`);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h3 className="table-title">Liste des Réclamations</h3>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Type</th>
              <th>Description</th>
              <th>Date de reclamation</th>
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
  );
};

// logout
const logout=async () => {
  localStorage.removeItem('token'); 
  window.location.href = '/login';
  
}
// Composant de la barre de navigation
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          <SidebarItem icon={<Users size={20} />} text="Utilisateurs" active={activeTab === 'users'} onClick={() => setActiveTab('users')} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<Building2 size={20} />} text="Départements" active={activeTab === 'departements'} onClick={() => setActiveTab('departements')} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<AlertTriangle size={20} />} text="Réclamations" active={activeTab === 'reclamations'} onClick={() => setActiveTab('reclamations')} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<Calendar size={20} />} text="Congés" active={activeTab === 'conges'} onClick={() => setActiveTab('conges')} sidebarOpen={sidebarOpen} />

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
                users: 'Gestion des Utilisateurs',
                departements: 'Gestion des Départements',
                reclamations: 'Suivi des Réclamations',
                conges: 'Demandes de Congés',
              }[activeTab]}
            </h2>
            <div className="header-user-info">
              <div className="header-user">
                <User size={20} />
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="content-body">
          {activeTab === 'users' && <UsersPanel />}
          {activeTab === 'departements' && <DepartementsPanel />}
          {activeTab === 'reclamations' && <ReclamationsPanel />}
          {activeTab === 'conges' && <CongesPanel />}
        </main>
      </div>
    </div>
  );
}