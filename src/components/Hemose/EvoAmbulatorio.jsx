import React, { useState, useEffect } from "react";
import '../../styles/Evo.css';


/**
 * Componente EvolucaoPaciente
 * Converte o HTML original de evolução do paciente para React.
 * Inclui lógicas de máscara de data, hora, seleção de permissão e histórico fixo de exemplo.
 */
const EvolucaoPaciente = () => {
  /* ----------------------------- estado ----------------------------- */
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
  });

  const handleRoleToggle = (novoRole) => {
    setRole(novoRole);
    setForm((prev) => ({ ...prev, conselho: novoRole === "medico" ? "crm" : "coren" }));
  };

  /* ----------------------- helpers de máscara ---------------------- */
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

  /* -------------------- submissão do formulário -------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Evolução registrada com sucesso!");

    // Limpa campos específicos
    setForm((prev) => ({
      ...prev,
      tipoEvolucao: "",
      evolucaoTexto: "",
      anexo: null,
    }));
  };

  /* ----------------- Histórico estático de exemplo ----------------- */
  const historico = [
    {
      tipo: "Consulta",
      data: "29/05/2025 - 14:30",
      profissional: "Dr. Carlos Silva - CRM 12345",
      texto:
        "Paciente relata melhora dos sintomas após início do tratamento. Mantém pressão arterial controlada (120x80 mmHg). Ausculta pulmonar sem alterações. Mantida prescrição atual por mais 15 dias.",
    },
    {
      tipo: "Avaliação",
      data: "25/05/2025 - 09:15",
      profissional: "Enf. Ana Paula - COREN 54321",
      texto:
        "Realizada aferição de sinais vitais. PA: 130x85 mmHg, FC: 78 bpm, FR: 16 irpm, Tax: 36.5°C. Paciente refere dor leve no local da aplicação da medicação. Orientado sobre cuidados locais.",
    },
    {
      tipo: "Procedimento",
      data: "20/05/2025 - 11:00",
      profissional: "Dr. Carlos Silva - CRM 12345",
      texto:
        "Realizada administração de medicação conforme prescrição. Paciente sem intercorrências durante o procedimento. Orientado sobre possíveis efeitos colaterais e retorno em 10 dias.",
    },
  ];

  /* --------------------------- render ------------------------------ */
  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar-fixed-left">
        {/* ... omiti o conteúdo do menu para brevidade ... */}
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <header className="main-header">
          <h1>
            Evolução do Paciente
            <span className="permission-badge permission-medico">Médico</span>
            <span className="permission-badge permission-enfermeiro">Enfermeiro</span>
          </h1>
          <button className="hamburger-button" id="hamburgerBtn">
            <img src="icons/menu_hamburger.png" alt="Menu" />
          </button>
        </header>

        {/* Seletor de permissão */}
        <div className="permission-selector">
          <button
            type="button"
            className={`permission-toggle ${role === "medico" ? "active" : ""}`}
            id="btnMedico"
            onClick={() => handleRoleToggle("medico")}
          >
            Médico
          </button>
          <button
            type="button"
            className={`permission-toggle ${role === "enfermeiro" ? "active" : ""}`}
            id="btnEnfermeiro"
            onClick={() => handleRoleToggle("enfermeiro")}
          >
            Enfermeiro
          </button>
        </div>

        {/* Formulário */}
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
                <button type="button" className="search-icon-button">
                  &#128269;
                </button>
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
                  <option value="consulta">Consulta</option>
                  <option value="avaliacao">Avaliação</option>
                  <option value="procedimento">Procedimento</option>
                  <option value="intercorrencia">Intercorrência</option>
                  <option value="outro">Outro</option>
                </select>
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
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #ced4da",
                    borderRadius: 4,
                    fontSize: "0.9em",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flexBasis: "100%" }}>
                <label htmlFor="anexoEvolucao">Anexar Documento:</label>
                <input
                  type="file"
                  id="anexoEvolucao"
                  onChange={handleInputChange}
                  style={{ padding: "8px 0" }}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button-main" id="btnRegistrarEvolucao">
                Registrar Evolução
              </button>
            </div>
          </form>

          {/* Histórico */}
          <h3 style={{ marginTop: 30, color: "#343a40" }}>Histórico de Evoluções</h3>
          <div className="historico-evolucao">
            {historico.map((h, idx) => (
              <div className="evolucao-item" key={idx}>
                <div className="evolucao-header">
                  <span className="evolucao-tipo">{h.tipo}</span>
                  <span className="evolucao-data">{h.data}</span>
                </div>
                <div className="evolucao-profissional">{h.profissional}</div>
                <div className="evolucao-conteudo">{h.texto}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
</div>)}

export default EvoAmbulatorio;

