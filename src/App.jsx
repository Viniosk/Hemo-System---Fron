import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Hemose/Login';
import AdmMed from './components/Hemose/AdmMed';
import EvoAmbulatorio from './components/Hemose/EvoAmbulatorio';
import EvoVisualizacao from './components/Hemose/EvoVisualizacao';
import ProntEletronico from './components/Hemose/ProntEletronico';
import RecRedirecionamento from './components/Hemose/RecRedirecionamento';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/adm" element={<AdmMed />} />
        <Route path="/evo-ambulatorio" element={<EvoAmbulatorio />} />
        <Route path="/evo-visualizar" element={<EvoVisualizacao />} />
        <Route path="/prontuario" element={<ProntEletronico />} />
        <Route path="/recepcao" element={<RecRedirecionamento />} />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}