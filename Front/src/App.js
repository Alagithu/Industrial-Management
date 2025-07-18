import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardAdmin from '../src/components/Dashboard/DashboardAdmin';
import DemandeConge from '../src/components/conge/DemandeConge';
import Reclamation from './components/Reclamations/Reclamation';
import DashboardResponsable from './components/Dashboard/DashboardResponsable';
import DashboardEmp from './components/Dashboard/DashboardEmp';
import DashboardTech from './components/Dashboard/DashboardTech';
import FactoryHomePage from './pages/Home';
function App() {
  return (
    <Router>
      <div className="app">
        <div >
          <Routes>
            <Route path="/" element={<FactoryHomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
            <Route path="/dashboardResp" element={<DashboardResponsable />} />
            <Route path="/dashboardEmp" element={<DashboardEmp />} />
            <Route path="/dashboardTech" element={<DashboardTech />} />
            <Route path="/demandeConge" element={<DemandeConge />} />
            <Route path="/reclamation" element={<Reclamation />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );}export default App;