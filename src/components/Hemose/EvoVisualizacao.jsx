import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Evo.css';
import logoFSPH from '../../assets/fsph_logo.png';
import menuIcon from '../../assets/menu_hamburger.png';
import cadIcon from '../../assets/icons/cadastros.png';
import recepIcon from '../../assets/icons/recepcao.png';
import ambIcon from '../../assets/icons/ambulatorio.png';
import labIcon from '../../assets/icons/laboratorio.png';
import logoutIcon from '../../assets/icons/logout_icon.png';
import { AuthContext } from '../../App';
import { evolucoesMock, pacientesMock } from '../../data/mocks';

export default function EvoVisualizacao() {
  const { setIsAuthenticated } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    tipoEvolucao: "",
    profissional: "",
  });
  const [form, setForm] = useState({
    prontuario: '',
    nomeUsuario: '',
    dataNasc: '',
    cpfPaciente: '',
  });
  const [historico, setHistorico] = useState(evolucoesMock);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cpf = params.get('cpf');
    if (cpf) {
      const paciente = pacientesMock.find(p => p.cpf === cpf);
      if (paciente) {
        setForm(prev => ({
          ...prev,
          nomeUsuario: paciente.nome,
          dataNasc: paciente.dataNasc,
          cpfPaciente: paciente.cpf,
        }));
        setHistorico(evolucoesMock.filter(h => h.cpfPaciente === cpf));
      }
    }
  }, [location]);

  const dateToBR = (d) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const maskDate = (val) => {
    const nums = val.replace(/\D/g, "");
    if (nums.length <= 2) return nums;
    if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
    return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 8)}`;
  };

  const handleFiltroChange = (e) => {
    const { id, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [id]: ["dataInicio", "dataFim"].includes(id) ? maskDate(value) : value,
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: id === 'dataNasc' ? maskDate(value) : value,
      cpfPaciente: id === 'nomeUsuario' ? (pacientesMock.find(p => p.nome === value)?.cpf || '') : prev.cpfPaciente,
    }));
    if (id === 'nomeUsuario') {
      const paciente = pacientesMock.find(p => p.nome === value);
      setHistorico(paciente ? evolucoesMock.filter(h => h.cpfPaciente === paciente.cpf) : evolucoesMock);
    }
  };

  const limparFiltros = () => {
    setFiltros({ dataInicio: "", dataFim: "", tipoEvolucao: "", profissional: "" });
    setHistorico(form.cpfPaciente ? evolucoesMock.filter(h => h.cpfPaciente === form.cpfPaciente) : evolucoesMock);
  };

  const aplicarFiltros = () => {
    let lista = form.cpfPaciente ? evolucoesMock.filter(h => h.cpfPaciente === form.cpfPaciente) : [...evolucoesMock];
    const { dataInicio, dataFim, tipoEvolucao, profissional } = filtros;

    if (dataInicio.length === 10) {
      const [d, m, a] = dataInicio.split("/");
      const ini = new Date(`${a}-${m}-${d}`);
      lista = lista.filter((h) => h.data >= ini);
    }
    if (dataFim.length === 10) {
      const [d, m, a] = dataFim.split("/");
      const fim = new Date(`${a}-${m}-${d}T23:59:59`);
      lista = lista.filter((h) => h.data <= fim);
    }
    if (tipoEvolucao) lista = lista.filter((h) => h.tipo === tipoEvolucao);
    if (profissional.trim())
      lista = lista.filter((h) =>
        h.profissional.toLowerCase().includes(profissional.trim().toLowerCase())
      );

    setHistorico(lista);
    alert("Filtros aplicados!");
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
          <h2 className="menu-navegacao-titulo">3. Ambulatório</h2>
          <ul>
            <li><Link to="/prontuario">3.1 Prontuário Eletrônico</Link></li>
            <li><Link to="/evo-ambulatorio">3.2 Evolução</Link></li>
            <li><Link to="/evo-visualizar">3.3 Visualizar Evoluções</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Visualizar Evolução do Paciente</h1>
          <button className="hamburger-button" onClick={() => setMenuOpen(!menuOpen)}>
            <img src={menuIcon} alt="Menu" />
          </button>
        </header>

        <div className="visualizacao-info">
          <p>Esta tela permite apenas a visualização do histórico de evoluções. Para registrar novas evoluções, acesse pelo menu Ambulatório.</p>
        </div>

        <section className="form-cadastro-container">
          <div className="form-row">
            <div className="form-group prontuario">
              <label htmlFor="prontuario">Prontuário:</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="prontuario"
                  value={form.prontuario}
                  onChange={handleInputChange}
                />
                <button type="button" className="search-icon-button">🔍</button>
              </div>
            </div>
            <div className="form-group nome-usuario">
              <label htmlFor="nomeUsuario">Nome Paciente:</label>
              <input
                type="text"
                id="nomeUsuario"
                value={form.nomeUsuario}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group data-nasc">
              <label htmlFor="dataNasc">Data Nasc:</label>
              <input
                type="text"
                id="dataNasc"
                placeholder="dd/mm/aa"
                maxLength={8}
                value={form.dataNasc}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="filtro-container">
            <div className="filtro-titulo">Filtros de Visualização</div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dataInicio">Data Início:</label>
                <input
                  type="text"
                  id="dataInicio"
                  maxLength={10}
                  value={filtros.dataInicio}
                  onChange={handleFiltroChange}
                  placeholder="dd/mm/aaaa"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dataFim">Data Fim:</label>
                <input
                  type="text"
                  id="dataFim"
                  maxLength={10}
                  value={filtros.dataFim}
                  onChange={handleFiltroChange}
                  placeholder="dd/mm/aaaa"
                />
              </div>
              <div className="form-group">
                <label htmlFor="tipoEvolucao">Tipo de Evolução:</label>
                <select
                  id="tipoEvolucao"
                  value={filtros.tipoEvolucao}
                  onChange={handleFiltroChange}
                >
                  <option value="">Todos</option>
                  <option value="consulta">Consulta</option>
                  <option value="avaliacao">Avaliação</option>
                  <option value="procedimento">Procedimento</option>
                  <option value="intercorrencia">Intercorrência</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="profissional">Profissional:</label>
                <input
                  type="text"
                  id="profissional"
                  value={filtros.profissional}
                  onChange={handleFiltroChange}
                />
              </div>
            </div>
            <div className="form-actions" style={{ textAlign: "right", marginTop: 10 }}>
              <button
                type="button"
                className="submit-button-secondary"
                onClick={limparFiltros}
              >
                Limpar
              </button>
              <button
                type="button"
                className="submit-button-main"
                onClick={aplicarFiltros}
                style={{ marginLeft: 10 }}
              >
                Filtrar
              </button>
            </div>
          </div>

          <h3 style={{ marginTop: 30, color: "#343a40" }}>Histórico de Evoluções</h3>
          <div className="historico-evolucao">
            {historico.length === 0 ? (
              <p style={{ textAlign: "center", color: "#888" }}>Nenhum registro encontrado.</p>
            ) : (
              historico.map((h, idx) => (
                <div className="evolucao-item" key={idx}>
                  <div className="evolucao-header">
                    <span className="evolucao-tipo">{h.tipoLabel}</span>
                    <span className="evolucao-data">{h.dataCompleta}</span>
                  </div>
                  <div className="evolucao-profissional">{h.profissional}</div>
                  <div className="evolucao-conteudo">{h.texto}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

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