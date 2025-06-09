import React, { useState } from "react";
import '../../styles/Evo.css';




const historiasMock = [
  {
    tipo: "consulta",
    tipoLabel: "Consulta",
    dataCompleta: "29/05/2025 - 14:30",
    data: new Date(2025, 4, 29, 14, 30),
    profissional: "Dr. Carlos Silva - CRM 12345",
    texto:
      "Paciente relata melhora dos sintomas após início do tratamento. Mantém pressão arterial controlada (120x80 mmHg). Ausculta pulmonar sem alterações. Mantida prescrição atual por mais 15 dias.",
  },
  {
    tipo: "avaliacao",
    tipoLabel: "Avaliação",
    dataCompleta: "25/05/2025 - 09:15",
    data: new Date(2025, 4, 25, 9, 15),
    profissional: "Enf. Ana Paula - COREN 54321",
    texto:
      "Realizada aferição de sinais vitais. PA: 130x85 mmHg, FC: 78 bpm, FR: 16 irpm, Tax: 36.5°C. Paciente refere dor leve no local da aplicação da medicação. Orientado sobre cuidados locais.",
  },
  {
    tipo: "procedimento",
    tipoLabel: "Procedimento",
    dataCompleta: "20/05/2025 - 11:00",
    data: new Date(2025, 4, 20, 11, 0),
    profissional: "Dr. Carlos Silva - CRM 12345",
    texto:
      "Realizada administração de medicação conforme prescrição. Paciente sem intercorrências durante o procedimento. Orientado sobre possíveis efeitos colaterais e retorno em 10 dias.",
  },
  {
    tipo: "intercorrencia",
    tipoLabel: "Intercorrência",
    dataCompleta: "15/05/2025 - 16:45",
    data: new Date(2025, 4, 15, 16, 45),
    profissional: "Enf. Ana Paula - COREN 54321",
    texto:
      "Paciente compareceu à unidade relatando reação alérgica leve após uso da medicação prescrita. Apresenta eritema e prurido em região de tronco. Comunicado médico responsável, que orientou suspensão da medicação e prescrição de anti-histamínico.",
  },
  {
    tipo: "consulta",
    tipoLabel: "Consulta",
    dataCompleta: "10/05/2025 - 10:00",
    data: new Date(2025, 4, 10, 10, 0),
    profissional: "Dr. Carlos Silva - CRM 12345",
    texto:
      "Primeira consulta. Paciente relata quadro de hipertensão arterial há 5 anos, em uso irregular de medicação. PA atual: 150x95 mmHg. Solicitados exames laboratoriais e ECG. Iniciado tratamento com Losartana 50mg 1x/dia e orientações sobre dieta hipossódica e atividade física regular.",
  },
];

const dateToBR = (d) =>
  d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

const maskDate = (val) => {
  const nums = val.replace(/\D/g, "");
  if (nums.length <= 2) return nums;
  if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
  return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 8)}`;
};

const VisualizarEvolucaoPaciente = () => {
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    tipoEvolucao: "",
    profissional: "",
  });
  const [historico, setHistorico] = useState(historiasMock);

  const handleFiltroChange = (e) => {
    const { id, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [id]: ["dataInicio", "dataFim"].includes(id) ? maskDate(value) : value,
    }));
  };

  const limparFiltros = () => {
    setFiltros({ dataInicio: "", dataFim: "", tipoEvolucao: "", profissional: "" });
    setHistorico(historiasMock);
  };

  const aplicarFiltros = () => {
    let lista = [...historiasMock];
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

  return (
    <div className="container">
      {/* Sidebar omitida para brevidade */}
      <main className="main-content">
        <header className="main-header">
          <h1>Visualizar Evolução do Paciente</h1>
          <button className="hamburger-button" id="hamburgerBtn">
            <img src="icons/menu_hamburger.png" alt="Menu" />
          </button>
        </header>

        <div className="visualizacao-info">
          <p>
            Esta tela permite apenas a visualização do histórico de evoluções. Para
            registrar novas evoluções, acesse pelo menu Ambulatório.
          </p>
        </div>

        <section className="form-cadastro-container">
          {/* Dados básicos do paciente */}
          <div className="form-row">
            <div className="form-group prontuario">
              <label htmlFor="prontuario">Prontuário:</label>
              <div className="input-with-icon">
                <input type="text" id="prontuario" name="prontuario" />
                <button type="button" className="search-icon-button">
                  &#128269;
                </button>
              </div>
            </div>
            <div className="form-group nome-usuario">
              <label htmlFor="nomeUsuario">Nome Paciente:</label>
              <input type="text" id="nomeUsuario" name="nomeUsuario" />
            </div>
            <div className="form-group data-nasc">
              <label htmlFor="dataNasc">Data Nasc:</label>
              <input
                type="text"
                id="dataNasc"
                name="dataNasc"
                placeholder="dd/mm/aa"
                maxLength={8}
              />
            </div>
          </div>

          {/* Filtros */}
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

          {/* Histórico */}
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
    </div>
  );
};

export default VisualizarEvolucaoPaciente;
