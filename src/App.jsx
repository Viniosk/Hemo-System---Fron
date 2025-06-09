import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Hemose/Login';
import AdmMed from './components/Hemose/AdmMed';
import EvoAmbulatorio from './components/Hemose/EvoAmbulatorio';
import EvoVisualizacao from './components/Hemose/EvoVisualizacao';
import ProntEletronico from './components/Hemose/ProntEletronico';
import RecRedirecionamento from './components/Hemose/RecRedirecionamento';
import Estoque from './components/Hemose/Estoque';

export const AuthContext = React.createContext();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/adm" element={<PrivateRoute><AdmMed /></PrivateRoute>} />
          <Route path="/evo-ambulatorio" element={<PrivateRoute><EvoAmbulatorio /></PrivateRoute>} />
          <Route path="/evo-visualizar" element={<PrivateRoute><EvoVisualizacao /></PrivateRoute>} />
          <Route path="/prontuario" element={<PrivateRoute><ProntEletronico /></PrivateRoute>} />
          <Route path="/recepcao" element={<PrivateRoute><RecRedirecionamento /></PrivateRoute>} />
          <Route path="/estoque" element={<PrivateRoute><Estoque /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}