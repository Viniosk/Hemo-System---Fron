import React, { useState } from "react";
import '../../styles/styles.css';


const ProntuarioEletronico = () => {
  const [imagemPreview, setImagemPreview] = useState(null);
  const [nomeDocumento, setNomeDocumento] = useState("");

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagemPreview(imageUrl);
    }
  };

  const handleDocumentoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNomeDocumento(file.name);
    }
  };

  const handleVoltar = () => {
    window.history.back();
  };

  const apenasNumeros = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  return (
    <div className="container">
      {/* Sidebar fixa à esquerda */}
      <aside className="sidebar-fixed-left">
        <div className="logo-container-fixed">
          <img src="/styles/fsph_logo.png" alt="Logo FSPH" className="logo-fundo-saude" />
        </div>
        <nav className="menu-navegacao-esquerda">
          <h2 className="menu-navegacao-titulo">3. Ambulatório</h2>
          <ul>
            <li><a href="#">3.1 Prontuário Eletrônico</a></li>
            <li><a href="#">3.2 Consultas Realizadas</a></li>
            <li><a href="#">3.3 Encaminhamentos</a></li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="main-header">
          <h1>Prontuário Eletrônico</h1>
          <button className="hamburger-button" id="hamburgerBtn">
            <img src="/styles/icons/menu_hamburger.png" alt="Menu" />
          </button>
        </header>

        <section className="form-cadastro-container">
          {/* Dados do Paciente */}
          <div className="form-row">
            <div className="form-group nome-usuario">
              <label htmlFor="nomePaciente">Nome do Paciente:</label>
              <input type="text" id="nomePaciente" name="nomePaciente" placeholder="Digite o nome do paciente" maxLength="100" />
            </div>
            <div className="form-group data-nasc">
              <label htmlFor="idadePaciente">Idade:</label>
              <input type="text" id="idadePaciente" name="idadePaciente" placeholder="Digite sua Idade" maxLength="3" onInput={apenasNumeros} />
            </div>
            <div className="form-group cpf">
              <label htmlFor="cpf">CPF:</label>
              <input type="text" id="cpf" name="cpfPaciente" placeholder="000.000.000-00" maxLength="11" onInput={apenasNumeros} />
            </div>
          </div>

          {/* Anamnese */}
          <div className="form-row">
            <div className="form-group" style={{ flexBasis: "100%" }}>
              <label htmlFor="anamnese">Anamnese:</label>
              <textarea id="anamnese" name="anamnese" rows="3"></textarea>
            </div>
          </div>

          {/* Diagnóstico */}
          <div className="form-row">
            <div className="form-group" style={{ flexBasis: "100%" }}>
              <label htmlFor="diagnostico">Diagnóstico:</label>
              <textarea id="diagnostico" name="diagnostico" rows="2"></textarea>
            </div>
          </div>

          {/* Prescrição */}
          <div className="form-row">
            <div className="form-group" style={{ flexBasis: "100%" }}>
              <label htmlFor="prescricao">Prescrição:</label>
              <textarea id="prescricao" name="prescricao" rows="2"></textarea>
            </div>
          </div>

          {/* Encaminhamento */}
          <div className="form-row">
            <div className="form-group" style={{ flexBasis: "100%" }}>
              <label htmlFor="encaminhamento">Encaminhamento (Exames/Enfermagem):</label>
              <textarea id="encaminhamento" name="encaminhamento" rows="2"></textarea>
            </div>
          </div>

          {/* Botões */}
          <div className="form-actions">
            <button type="button" className="submit-button-main">Salvar</button>
            <button type="button" className="submit-button-main" style={{ background: "#6c757d", marginLeft: "10px" }} onClick={handleVoltar}>Voltar</button>

            <label htmlFor="anexoExame" className="submit-button-main" style={{ background: "#1e3a8a", marginLeft: "10px", cursor: "pointer" }}>
              Anexar Imagem
              <input type="file" id="anexoExame" name="anexoExame" accept="image/*" style={{ display: "none" }} onChange={handleImagemChange} />
            </label>

            {imagemPreview && (
              <img src={imagemPreview} alt="Prévia do exame" style={{ width: 48, height: 48, objectFit: "cover", marginLeft: "10px", borderRadius: 4, border: "1px solid #ccc" }} />
            )}

            <label htmlFor="anexoDocumento" className="submit-button-main" style={{ background: "#2563eb", marginLeft: "10px", cursor: "pointer" }}>
              Anexar Documento
              <input type="file" id="anexoDocumento" name="anexoDocumento" accept=".pdf,.doc,.docx,.txt,.odt" style={{ display: "none" }} onChange={handleDocumentoChange} />
            </label>
          </div>

          {nomeDocumento && (
            <div style={{ marginTop: "10px", marginLeft: "10px", color: "#1e3a8a", fontWeight: "bold" }}>{nomeDocumento}</div>
          )}
        </section>
      </main>

      {/* Menu pop-up lateral */}
      <aside className="popup-menu-right" id="popupMenu">
        <ul>
          <li><a href="#"><img src="/styles/icons/cadastros.png" alt="" /> Cadastros</a></li>
          <li><a href="#"><img src="/styles/icons/recepcao.png" alt="" /> Recepção</a></li>
          <li><a href="#"><img src="/styles/icons/ambulatorio.png" alt="" /> Ambulatório</a></li>
          <li><a href="#"><img src="/styles/icons/laboratorio.png" alt="" /> Laboratório</a></li>
        </ul>
        <ul>
          <li><a href="#"><img src="/styles/icons/logout_icon.png" alt="Sair" /> Sair</a></li>
        </ul>
      </aside>
      <div className="overlay" id="overlay"></div>
    </div>
  );
};

export default ProntuarioEletronico;
