import React, { useState, useEffect } from 'react';
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

const normalizarTexto = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const formatarStatus = (status) => {
  switch (status) {
    case "aguardando": return "Aguardando";
    case "triagem": return "Em Triagem";
    case "consulta": return "Em Consulta";
    default: return status;
  }
};

export default function RecRedirecionamento() {
  const { setIsAuthenticated } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalDados, setModalDados] = useState(false);
  const [modalDir, setModalDir] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [pacientes, setPacientes] = useState(pacientesMock.map(p => ({
    ...p,
    status: p.status || 'aguardando',
    tipoAtendimento: p.tipoAtendimento || 'Consulta',
    horario: p.horario || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  })));
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [pacientesFiltrados, setPacientesFiltrados] = useState(pacientes);

  const filtrarPacientes = () => {
    const textoBusca = normalizarTexto(busca);
    const buscaNumeros = textoBusca.replace(/\D/g, "");

    return pacientes.filter((p) => {
      const nomeNorm = normalizarTexto(p.nome);
      const cpfNorm = p.cpf.replace(/\D/g, "");

      if (!textoBusca) return !statusFiltro || p.status === statusFiltro;

      if (buscaNumeros && !isNaN(Number(buscaNumeros)))
        return cpfNorm.includes(buscaNumeros) && (!statusFiltro || p.status === statusFiltro);

      return nomeNorm.includes(textoBusca) && (!statusFiltro || p.status === statusFiltro);
    });
  };

  useEffect(() => {
    setPacientesFiltrados(filtrarPacientes());
  }, [busca, statusFiltro, pacientes]);

  const abrirModalVerDados = (paciente) => {
    setPacienteSelecionado(paciente);
    setModalDados(true);
  };

  const abrirModalDirecionar = (paciente) => {
    setPacienteSelecionado(paciente);
    setModalDir(true);
  };

  const handleDirecionarSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const novoStatus = form.get("setorDestino");
    const novaPrioridade = form.get("prioridadeDestino");

    setPacientes((prev) =>
      prev.map((p) =>
        p.cpf === pacienteSelecionado.cpf ? { ...p, status: novoStatus, prioridade: novaPrioridade } : p
      )
    );
    alert("Paciente direcionado com sucesso!");
    setModalDir(false);
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
          <h2 className="menu-navegacao-titulo">2. Recepção</h2>
          <ul>
            <li><Link to="/recepcao">2.1 Lista de Pacientes</Link></li>
            <li><Link to="#">2.2 Agendamentos</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Recepção e Redirecionamento</h1>
          <button className="hamburger-button" onClick={() => setMenuOpen(!menuOpen)}>
            <img src={menuIcon} alt="Menu" />
          </button>
        </header>

        <section className="form-cadastro-container">
          <div className="filtro-container">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="busca">Buscar:</label>
                <input
                  type="text"
                  id="busca"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Nome ou CPF"
                />
              </div>
              <div className="form-group">
                <label htmlFor="statusFiltro">Status:</label>
                <select
                  id="statusFiltro"
                  value={statusFiltro}
                  onChange={(e) => setStatusFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="aguardando">Aguardando</option>
                  <option value="triagem">Em Triagem</option>
                  <option value="consulta">Em Consulta</option>
                </select>
              </div>
            </div>
          </div>

          <div className="items-container">
            <table className="tabela-pacientes">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Status</th>
                  <th>Tipo de Atendimento</th>
                  <th>Horário</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map((paciente, idx) => (
                  <tr key={idx}>
                    <td>{paciente.nome}</td>
                    <td>{paciente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</td>
                    <td>{formatarStatus(paciente.status)}</td>
                    <td>{paciente.tipoAtendimento}</td>
                    <td>{paciente.horario}</td>
                    <td className="actions">
                      <button onClick={() => abrirModalVerDados(paciente)}>Ver Dados</button>
                      <button onClick={() => abrirModalDirecionar(paciente)}>Direcionar</button>
                      <button onClick={() => navigate(`/prontuario?cpf=${paciente.cpf}`)}>Prontuário</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {modalDados && (
        <div className="modal-fsph">
          <div className="modal-fsph-content">
            <span className="modal-fsph-close" onClick={() => setModalDados(false)}>×</span>
            <h2>Dados do Paciente</h2>
            <p><strong>Nome:</strong> {pacienteSelecionado?.nome}</p>
            <p><strong>CPF:</strong> {pacienteSelecionado?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</p>
            <p><strong>Status:</strong> {formatarStatus(pacienteSelecionado?.status)}</p>
            <p><strong>Tipo de Atendimento:</strong> {pacienteSelecionado?.tipoAtendimento}</p>
            <p><strong>Horário:</strong> {pacienteSelecionado?.horario}</p>
          </div>
        </div>
      )}

      {modalDir && (
        <div className="modal-fsph">
          <div className="modal-fsph-content">
            <span className="modal-fsph-close" onClick={() => setModalDir(false)}>×</span>
            <h2>Direcionar Paciente</h2>
            <form onSubmit={handleDirecionarSubmit}>
              <div className="form-group">
                <label htmlFor="setorDestino">Setor Destino:</label>
                <select id="setorDestino" name="setorDestino" required>
                  <option value="aguardando">Aguardando</option>
                  <option value="triagem">Triagem</option>
                  <option value="consulta">Consulta</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="prioridadeDestino">Prioridade:</label>
                <select id="prioridadeDestino" name="prioridadeDestino" required>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <button type="submit" className="submit-button-main">Confirmar</button>
            </form>
          </div>
        </div>
      )}

      <aside className={`popup-menu-right ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="#"><img src={cadIcon} alt="" /> Cadastros</Link></li>
          <li><Link to="/recepcao"><img src={recepIcon} alt="" /> Recepção</Link></li>
          <li><Link to="/evo-ambulatorio"><img src={ambIcon} alt="" /> Ambulatório</Link></li>
          <li><Link to="/estoque"><img src={labIcon} alt="" /> Estoque</Link></li>
        </ul>
        <ul>
          <li><Link to="/login" onClick={handleLogout}><img src={logoutIcon} alt="Sair" /> Sair</Link></li>
        </ul>
      </aside>

      {menuOpen && <div className="modal-fsph-overlay" onClick={() => setMenuOpen(false)}></div>}
    </div>
  );
}