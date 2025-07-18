import { useCallback, useEffect, useState} from 'react';
import Modal from "react-modal";
import { User, AlertTriangle, Menu, X,Plus,Trash2, LogOut, Calendar, ShoppingCart } from 'lucide-react';
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


const CongesPanel = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [Users, setUsers] = useState([]);
  const [,setSelectedUser] = useState(null);
  
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
  
  const [formData, setFormData] = useState({
    NomPrenom: '',
    email: '',
    dateDebut: '',
    dateFin: '',
  });

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
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
    }
    console.log("FormData envoyé :", formData);
  };
  return (
    <>
      <button className="btn-accept" onClick={() => setModalIsOpen(true)}>Demande Congé</button>
      <div className="data-table-container">


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
      </div>
    </>
  );
};
  const logout=async () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login';
  }
  const ReclamationsPanel = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [Reclamation, setNewReclamation] = useState({
      type: '',
      description: '',
      dateRec: '',
    });
  
    const handleInputChange = (e) => {
      setNewReclamation({ ...Reclamation, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem("token");
        await axios.post('http://localhost:5000/Reclamations/add', Reclamation, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        setModalIsOpen(false);
        setNewReclamation({ type: '', description: '', dateRec: '' });
        alert("La réclamation a été soumis avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'ajout de la réclamation :", error);
      }
    };
  
    return (
      <>
        <button className="btn-accept" onClick={() => setModalIsOpen(true)}>Passer une Réclamation</button>
  
        <div className="data-table-container">
          {/* Modal pour Ajouter Réclamation */}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
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
                value={Reclamation.type}
                onChange={handleInputChange}
                required
              />
              <label>Description</label>
              <textarea
                name="description"
                value={Reclamation.description}
                onChange={handleInputChange}
                required
              />
              <label>Date de réclamation</label>
              <input
                type="date"
                name="dateRec"
                value={Reclamation.dateRec}
                onChange={handleInputChange}
                required
              />
              <div className="modal-actions">
              <button className="btn-reject" onClick={() => setModalIsOpen(false)}>Annuler</button>
              <button className="btn-accept">Enregistrer</button>    
              </div>
            </form>
          </Modal>
        </div>
      </>
    );
  };

  const CommandesPanel = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [commande, setCommande] = useState({
      produits: [{ nomProduit: '', quantite: 1 }]
    });
  
    // Ajouter un nouveau produit à la commande
    const ajouterProduit = () => {
      setCommande({
        ...commande,
        produits: [...commande.produits, { nomProduit: '', quantite: 1 }]
      });
    };
  
    // Supprimer un produit de la commande
    const supprimerProduit = (index) => {
      const nouveauxProduits = [...commande.produits];
      nouveauxProduits.splice(index, 1);
      setCommande({
        ...commande,
        produits: nouveauxProduits
      });
    };
  
    // Mettre à jour les informations d'un produit
    const handleProduitChange = (index, field, value) => {
      const nouveauxProduits = [...commande.produits];
      nouveauxProduits[index][field] = value;
      setCommande({
        ...commande,
        produits: nouveauxProduits
      });
    };
  
    // Soumettre la commande
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:5000/Commandes/add', commande);
        setModalIsOpen(false);
        setCommande({ produits: [{ nomProduit: '', quantite: 1 }] });
        alert("La commande a été soumise avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'ajout de la commande:", error);
      }
    };
  
    return (
      <>
        <button className="btn-accept" onClick={() => setModalIsOpen(true)}>Passer une commande</button>
  
        <div className="data-table-container">
          {/* Modal pour Ajouter une Commande */}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Passer une commande"
            className="modal"
            overlayClassName="overlay"
          >
            <h2>Nouvelle Commande</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              {commande.produits.map((produit, index) => (
                <div key={index} className="produit-item">
                  <h3>Produit {index + 1}</h3>
                  <div className="produit-inputs">
                    <div className="input-group">
                      <label>Nom du produit</label>
                      <input
                        type="text"
                        value={produit.nomProduit}
                        onChange={(e) => handleProduitChange(index, 'nomProduit', e.target.value)}
                        placeholder="Entrez le nom du produit"
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Quantité</label>
                      <input
                        type="number"
                        min="1"
                        value={produit.quantite}
                        onChange={(e) => handleProduitChange(index, 'quantite', parseInt(e.target.value))}
                        placeholder="Quantité"
                        required
                      />
                    </div>
                    {commande.produits.length > 1 && (
                      <button 
                        type="button" 
                        className=".btn-delete-product" 
                        onClick={() => supprimerProduit(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
  
              <button 
                type="button" 
                className="btn-add-product" 
                onClick={ajouterProduit}
              >
                <Plus size={16} /> Ajouter un produit
              </button>
  
              <div className="modal-actions">
              <button  className="btn-reject" onClick={() => setModalIsOpen(false)}>Annuler</button>
              <button  className="btn-accept">Enregistrer</button>
            </div>
            </form>
          </Modal>
        </div>
      </>
    );
  };

// Composant principal du Dashboard
export default function DashboardResponsable() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("commandes");
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
          <SidebarItem icon={<Calendar size={20} />} text="Congés" active={activeTab === 'conges'} onClick={() => setActiveTab('conges')} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<AlertTriangle size={20} />} text="Réclamations" active={activeTab === 'reclamations'} onClick={() => setActiveTab('reclamations')} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<ShoppingCart size={20} />} text="Commandes" active={activeTab === 'commandes'} onClick={() => setActiveTab('commandes')} sidebarOpen={sidebarOpen} />
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
                reclamations: 'Passer Réclamations',
                conges: 'Demandes de Congés',
                commandes: 'Commandes de Produits',
              }[activeTab]}
            </h2>
            <div className="header-user-info">
              <div className="header-user">
                <User size={20} />
                <span>Téchnicien</span>
              </div>
            </div>
          </div>
        </header>
        <main className="content-body">
          {activeTab === 'conges' && <CongesPanel />}
          {activeTab === 'reclamations' && <ReclamationsPanel />}
          {activeTab === 'commandes' && <CommandesPanel />}
        </main>
      </div>
    </div>
  );
}