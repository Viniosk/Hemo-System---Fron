import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/styles.css';
import logoFSPH from '../../assets/fsph_logo.png';
import menuIcon from '../../assets/menu_hamburger.png';
import cadIcon from '../../assets/icons/cadastros.png';
import recepIcon from '../../assets/icons/recepcao.png';
import ambIcon from '../../assets/icons/ambulatorio.png';
import labIcon from '../../assets/icons/laboratorio.png';
import logoutIcon from '../../assets/icons/logout_icon.png';
import { AuthContext } from '../../App';
import { pacientesMock } from '../../data/mocks';

export default function ProntuarioEletronico() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pacientes, setPacientes] = useState(pacientesMock);
  const [nome, setNome] = useState('');
  const [evolucao, setEvolucao] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!nome) newErrors.nome = 'Nome é obrigatório';
    if (!evolucao) newErrors.evolucao = 'Evolução é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const novoPaciente = {
      id: Math.random().toString(36).substr(2, 9),
      nome,
      evolucao,
      data: new Date().toLocaleDateString('pt-BR'),
    };

    setPacientes([...pacientes, novoPaciente]);
    setNome('');
    setEvolucao('');
    setModalOpen(false);
    alert('Evolução registrada com sucesso!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="container">
      <aside className="sidebar-fixed-left">
        <div className="logo-container-fixed">
          <img src={logoFSPH} alt="Logo FSPH" className="logo-fundo-saude" />
        </div>
        <nav className="menu-navegacao-esquerda">
          <h2 className="menu-navegacao-titulo">3. Prontuário</h2>
          <ul>
            <li><Link to="/prontuario">3.1 Gerenciar Prontuário</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Prontuário Eletrônico</h1>
          <button className="hamburger-button" onClick={() => setMenuOpen(!menuOpen)}>
            <img src={menuIcon} alt="Menu" />
          </button>
        </header>

        <section className="form-cadastro-container">
          <div className="form-container">
            <button className="submit-button-main" onClick={() => setModalOpen(true)}>
              Adicionar Evolução
            </button>
            <div className="items-container">
              <table className="tabela-pacientes">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Evolução</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="no-items">
                        Nenhum paciente registrado.
                      </td>
                    </tr>
                  ) : (
                    pacientes.map((paciente) => (
                      <tr key={paciente.id}>
                        <td>{paciente.nome}</td>
                        <td>{paciente.evolucao}</td>
                        <td>{paciente.data}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <aside className={`popup-menu-right ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="#"><img src={cadIcon} alt="Cadastros" /> Cadastros</Link></li>
          <li><Link to="/recepcao"><img src={recepIcon} alt="Recepção" /> Recepção</Link></li>
          <li><Link to="/evo-ambulatorio"><img src={ambIcon} alt="Ambulatório" /> Ambulatório</Link></li>
          <li><Link to="/estoque"><img src={labIcon} alt="Estoque" /> Estoque</Link></li>
        </ul>
        <ul>
          <li><Link to="/login" onClick={handleLogout}><img src={logoutIcon} alt="Sair" /> Sair</Link></li>
        </ul>
      </aside>

      {menuOpen && <div className="modal-fsph-overlay open" onClick={() => setMenuOpen(false)}></div>}

      {modalOpen && (
        <>
          <div className="modal-fsph-overlay open" onClick={() => setModalOpen(false)}></div>
          <div className="modal-fsph">
            <div className="modal-fsph-content">
              <span className="modal-fsph-close" onClick={() => setModalOpen(false)}>
                &times;
              </span>
              <h2>Adicionar Evolução</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nome">Nome do Paciente:</label>
                  <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                  {errors.nome && <span className="error">{errors.nome}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="evolucao">Evolução:</label>
                  <textarea
                    id="evolucao"
                    value={evolucao}
                    onChange={(e) => setEvolucao(e.target.value)}
                    rows="5"
                  />
                  {errors.evolucao && <span className="error">{errors.evolucao}</span>}
                </div>
                <button type="submit" className="submit-button-main">
                  Salvar
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}