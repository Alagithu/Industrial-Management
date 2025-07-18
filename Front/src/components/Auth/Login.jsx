import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {email,password,});
      const { accessToken, position } = response.data;
       // Stocker le token si nécessaire
      localStorage.setItem("token", accessToken);
      // Redirection en fonction du rôle
      switch (position) {
        case 'admin':
          navigate('/dashboardAdmin');
          break;
        case 'responsable':
          navigate('/dashboardResp');
          break;
        case 'employé':
          navigate('/dashboardEmp');
          break;
        case 'technicien':
          navigate('/dashboardTech');
          break;
        default:
          navigate('/login');
      }
     } catch (error) {
      alert(error.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Connexion à la plateforme industrielle</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email professionnel</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@gmail.com" />
        </div>
        
        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>

        <button type="submit" >Se connecter</button>
        {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
        <div className="login-link">
          <p>
            Nouveau sur la plateforme ? <a href="/register">Créer un compte</a>
          </p>
        </div>
      </form>
    </div>
  );
};
export default Login;
