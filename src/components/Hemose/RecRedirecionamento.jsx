import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/styles.css';

import logoFSPH from '../../assets/fsph_logo.png';
import menuIcon from '../../assets/menu_hamburger.png';
import cadIcon from '../../assets/icons/cadastros.png';
import recepIcon from '../../assets/icons/recepcao.png';
import ambIcon from '../../assets/icons/ambulatorio.png';
import labIcon from '../../assets/icons/laboratorio.png';
import logoutIcon from '../../assets/icons/logout_icon.png';

export default function RecRedirecionamento() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalDados, setModalDados] = useState(false);
  const [modalDir, setModalDir] = useState(false);

  return (
    <div className="container">
      {/* Sidebar fixa */}
      <aside className="sidebar-fixed-left">
        <div className="logo-container-fixed">
          <img src={logoFSPH} alt="Logo FSPH" className="logo-fundo-saude" />
        </div>
        <nav className="menu-navegacao-esquerda">
          <h2 className="menu-navegacao-titulo">2. Recepção</h2>
          <ul>
            <li><Link to="#">2.1 Lista de Pacientes</Link></li>
            <li><Link to="#">2.2 Agendamentos</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="main-header">
          <h1>Recepção e Redirecionamento</h1>
          <button className="hamburger-button" onClick={() => setMenuOpen(!menuOpen)}>
            <img src={menuIcon} alt="Menu" />
          </button>
        </header>

        <section className="form-cadastro-container">
          <p>💡 Aqui você renderiza busca de pacientes e tabela.</p>
          <button className="submit-button-main" onClick={() => setModalDados(true)}>Abrir Modal Dados</button>
        </section>
      </main>

      {/* Modal de Dados */}
      {modalDados && (
        <div className="modal-fsph">
          <div className="modal-fsph-content">
            <span className="modal-fsph-close" onClick={() => setModalDados(false)}>&times;</span>
            <h2>Dados do Paciente</h2>
            <p>Detalhes…</p>
          </div>
        </div>
      )}

      {/* Modal Direcionar */}
      {modalDir && (
        <div className="modal-fsph">
          Direcionar…
        </div>
      )}

      {/* Popup‑menu lateral */}
      <aside className={`popup-menu-right ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="#"><img src={cadIcon} alt="" /> Cadastros</Link></li>
          <li><Link to="/recepcao"><img src={recepIcon} alt="" /> Recepção</Link></li>
          <li><Link to="/evo-ambulatorio"><img src={ambIcon} alt="" /> Ambulatório</Link></li>
          <li><Link to="#"><img src={labIcon} alt="" /> Laboratório</Link></li>
        </ul>
        <ul>
          <li><Link to="/login"><img src={logoutIcon} alt="Sair" /> Sair</Link></li>
        </ul>
      </aside>

      {menuOpen && <div className="modal-fsph-overlay" onClick={() => setMenuOpen(false)}></div>}
    </div>
  );
}
