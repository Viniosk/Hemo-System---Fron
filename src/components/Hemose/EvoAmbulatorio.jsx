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
import { pacientesMock, evolucoesMock } from '../../data/mocks';

export default function EvoAmbulatorio() {
  const { setIsAuthenticated } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const hoje = new Date();
  const formatData = (d) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const formatHora = (d) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false });

  const [role, setRole] = useState("medico");
  const [form, setForm] = useState({
    prontuario: "",
    nomeUsuario: "",
    dataNasc: "",
    dataEvolucao: formatData(hoje),
    horaEvolucao: formatHora(hoje),
    tipoEvolucao: "",
    profissional: "",
    conselho: "crm",
    numeroConselho: "",
    evolucaoTexto: "",
    anexo: null,
    cpfPaciente: "",
  });
  const [errors, setErrors] = useState({});
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
      }
    }
  }, [location]);

  const handleRoleToggle = (novoRole) => {
    setRole(novoRole);
    setForm((prev) => ({ ...prev, conselho: novoRole === "medico" ? "crm" : "coren" }));
  };

  const mascaraDataCurta = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };

  const mascaraDataCompleta = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 4) return mascaraDataCurta(digits);
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const mascaraHora = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  };

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    let val = value;
    if (id === "dataNasc") val = mascaraDataCurta(value);
    if (id === "dataEvolucao") val = mascaraDataCompleta(value);
    if (id === "horaEvolucao") val = mascaraHora(value);
    if (id === "anexoEvolucao") {
      setForm((prev) => ({ ...prev, anexo: files?.[0] || null }));
      return;
    }
    setForm((prev) => ({ ...prev, [id]: val }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.prontuario) newErrors.prontuario = 'Prontuário é obrigatório';
    if (!form.nomeUsuario) newErrors.nomeUsuario = 'Nome é obrigatório';
    if (!form.dataNasc || !/^\d{2}\/\d{2}\/\d{2}$/.test(form.dataNasc)) newErrors.dataNasc = 'Data de nascimento inválida';
    if (!form.tipoEvolucao) newErrors.tipoEvolucao = 'Tipo de evolução é obrigatório';
    if (!form.profissional) newErrors.profissional = 'Profissional é obrigatório';
    if (!form.conselho) newErrors.conselho = 'Conselho é obrigatório';
    if (!form.evolucaoTexto) newErrors.evolucaoTexto = 'Texto da evolução é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const novaEvolucao = {
      tipo: form.tipoEvolucao.toLowerCase(),
      tipoLabel: form.tipoEvolucao,
      dataCompleta: `${form.dataEvolucao} - ${form.horaEvolucao}`,
      data: new Date(`${form.dataEvolucao.split('/').reverse().join('-')}T${form.horaEvolucao}`),
      profissional: `${form.profissional} - ${form.conselho.toUpperCase()} ${form.numeroConselho}`,
      texto: form.evolucaoTexto,
      cpfPaciente: form.cpfPaciente,
    };

    setHistorico([novaEvolucao, ...historico]);
    alert("Evolução registrada com sucesso!");

    setForm((prev) => ({
      ...prev,
      tipoEvolucao: "",
      evolucaoTexto: "",
      anexo: null,
    }));
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
          <h1>Evolução do Paciente</h1>
          <button className="hamburger-button" onClick={() => setMenuOpen(!menuOpen)}>
            <img src={menuIcon} alt="Menu" />
          </button>
        </header>

        <div className="permission-selector">
          <button
            type="button"
            className={`permission-toggle ${role === "medico" ? "active" : ""}`}
            onClick={() => handleRoleToggle("medico")}
          >
            Médico
          </button>
          <button
            type="button"
            className={`permission-toggle ${role === "enfermeiro" ? "active" : ""}`}
            onClick={() => handleRoleToggle("enfermeiro")}
          >
            Enfermeiro
          </button>
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
              {errors.prontuario && <span className="error">{errors.prontuario}</span>}
            </div>
            <div className="form-group nome-usuario">
              <label htmlFor="nomeUsuario">Nome Paciente:</label>
              <input
                type="text"
                id="nomeUsuario"
                value={form.nomeUsuario}
                onChange={handleInputChange}
              />
              {errors.nomeUsuario && <span className="error">{errors.nomeUsuario}</span>}
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
              {errors.dataNasc && <span className="error">{errors.dataNasc}</span>}
            </div>
          </div>

          <form id="formEvolucao" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group data-evolucao">
                <label htmlFor="dataEvolucao">Data:</label>
                <input
                  type="text"
                  id="dataEvolucao"
                  maxLength={10}
                  value={form.dataEvolucao}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group hora">
                <label htmlFor="horaEvolucao">Hora:</label>
                <input
                  type="text"
                  id="horaEvolucao"
                  maxLength={5}
                  value={form.horaEvolucao}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group tipo-evolucao">
                <label htmlFor="tipoEvolucao">Tipo de Evolução:</label>
                <select
                  id="tipoEvolucao"
                  value={form.tipoEvolucao}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Avaliação">Avaliação</option>
                  <option value="Procedimento">Procedimento</option>
                  <option value="Intercorrência">Intercorrência</option>
                  <option value="Outro">Outro</option>
                </select>
                {errors.tipoEvolucao && <span className="error">{errors.tipoEvolucao}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group profissional">
                <label htmlFor="profissional">Profissional:</label>
                <input
                  type="text"
                  id="profissional"
                  value={form.profissional}
                  onChange={handleInputChange}
                />
                {errors.profissional && <span className="error">{errors.profissional}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="conselho">Conselho:</label>
                <select
                  id="conselho"
                  value={form.conselho}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione</option>
                  <option value="crm">CRM</option>
                  <option value="coren">COREN</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.conselho && <span className="error">{errors.conselho}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="numeroConselho">Número:</label>
                <input
                  type="text"
                  id="numeroConselho"
                  value={form.numeroConselho}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flexBasis: "100%" }}>
                <label htmlFor="evolucaoTexto">Evolução:</label>
                <textarea
                  id="evolucaoTexto"
                  rows={6}
                  value={form.evolucaoTexto}
                  onChange={handleInputChange}
                />
                {errors.evolucaoTexto && <span className="error">{errors.evolucaoTexto}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flexBasis: "100%" }}>
                <label htmlFor="anexoEvolucao">Anexar Documento:</label>
                <input
                  type="file"
                  id="anexoEvolucao"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button-main">Registrar Evolução</button>
            </div>
          </form>

          <h3 style={{ marginTop: 30, color: "#343a40" }}>Histórico de Evoluções</h3>
          <div className="historico-evolucao">
            {historico.filter(h => h.cpfPaciente === form.cpfPaciente).map((h, idx) => (
              <div className="evolucao-item" key={idx}>
                <div className="evolucao-header">
                  <span className="evolucao-tipo">{h.tipoLabel}</span>
                  <span className="evolucao-data">{h.dataCompleta}</span>
                </div>
                <div className="evolucao-profissional">{h.profissional}</div>
                <div className="evolucao-conteudo">{h.texto}</div>
              </div>
            ))}
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