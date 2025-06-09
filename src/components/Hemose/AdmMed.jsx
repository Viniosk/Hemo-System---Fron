import React, { useState, useEffect } from "react";
import '../../styles/Adm.med.css';


const normalizarTexto = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const formatarStatus = (status) => {
  switch (status) {
    case "aguardando":
      return "Aguardando";
    case "triagem":
      return "Em Triagem";
    case "consulta":
      return "Em Consulta";
    default:
      return status;
  }
};

const pacientesIniciais = [
  {
    nome: "Ana Paula Lima",
    cpf: "123.456.789-00",
    status: "aguardando",
    tipoAtendimento: "Consulta",
    horario: "08:30",
  },
  {
    nome: "Carlos Souza",
    cpf: "987.654.321-11",
    status: "triagem",
    tipoAtendimento: "Triagem",
    horario: "08:45",
  },
  {
    nome: "Fernanda Alves",
    cpf: "111.222.333-44",
    status: "consulta",
    tipoAtendimento: "Consulta",
    horario: "09:00",
  },
];

const RecepcaoRedirecionamento = () => {
  const [popupMenuAberto, setPopupMenuAberto] = useState(false);
  const [overlayAberto, setOverlayAberto] = useState(false);
  const [pacientes, setPacientes] = useState(pacientesIniciais);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [pacientesFiltrados, setPacientesFiltrados] = useState(pacientesIniciais);
  const [modalVerDadosAberto, setModalVerDadosAberto] = useState(false);
  const [modalDirecionarAberto, setModalDirecionarAberto] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [idxPacienteDirecionar, setIdxPacienteDirecionar] = useState(null);

  const alternarPopupMenu = () => {
    setPopupMenuAberto((prev) => !prev);
    setOverlayAberto((prev) => !prev);
  };

  const fecharOverlay = () => {
    setPopupMenuAberto(false);
    setOverlayAberto(false);
  };

  const filtrarPacientes = () => {
    const textoBusca = normalizarTexto(busca);
    const buscaNumeros = textoBusca.replace(/\D/g, "");

    return pacientes.filter((p) => {
      const nomeNorm = normalizarTexto(p.nome);
      const cpfNorm = p.cpf.replace(/\D/g, "");

      if (!textoBusca) return !statusFiltro || p.status === statusFiltro;

      if (buscaNumeros && !isNaN(Number(buscaNumeros)))
        return (
          cpfNorm.includes(buscaNumeros) && (!statusFiltro || p.status === statusFiltro)
        );

      return nomeNorm.includes(textoBusca) && (!statusFiltro || p.status === statusFiltro);
    });
  };

  useEffect(() => {
    setPacientesFiltrados(filtrarPacientes());
  }, [busca, statusFiltro, pacientes]);

  const abrirModalVerDados = (paciente) => {
    setPacienteSelecionado(paciente);
    setModalVerDadosAberto(true);
    setOverlayAberto(true);
  };

  const abrirModalDirecionar = (idx) => {
    setIdxPacienteDirecionar(idx);
    setPacienteSelecionado(pacientes[idx]);
    setModalDirecionarAberto(true);
    setOverlayAberto(true);
  };

  const fecharModais = () => {
    setModalVerDadosAberto(false);
    setModalDirecionarAberto(false);
    setOverlayAberto(false);
  };

  const handleDirecionarSubmit = (e) => {
    e.preventDefault();
    if (idxPacienteDirecionar === null) return;

    const form = new FormData(e.target);
    const novoStatus = form.get("setorDestino");
    const novaPrioridade = form.get("prioridadeDestino");

    setPacientes((prev) =>
      prev.map((p, i) =>
        i === idxPacienteDirecionar ? { ...p, status: novoStatus, prioridade: novaPrioridade } : p
      )
    );

    alert("Paciente direcionado com sucesso!");
    fecharModais();
  };

  return (
    <div className="container">
      {/* Restante do componente permanece igual... */}
    </div>
  );
};

export default RecepcaoRedirecionamento;
