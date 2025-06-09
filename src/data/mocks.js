export const pacientesMock = [
  {
    id: '1',
    nome: 'Ana Paula Lima',
    cpf: '12345678900',
    idade: '30',
    dataNasc: '15/03/1995',
    evolucao: 'Paciente estável.',
    data: '01/06/2025',
  },
  {
    id: '2',
    nome: 'Carlos Souza',
    cpf: '98765432111',
    idade: '45',
    dataNasc: '22/07/1979',
    evolucao: 'Melhora observada.',
    data: '02/06/2025',
  },
  {
    id: '3',
    nome: 'Fernanda Alves',
    cpf: '11122233344',
    idade: '28',
    dataNasc: '10/11/1996',
    evolucao: 'Sem alterações significativas.',
    data: '03/06/2025',
  },
];

export const evolucoesMock = [
  {
    tipo: 'consulta',
    tipoLabel: 'Consulta',
    dataCompleta: '29/05/2025 - 14:30',
    data: new Date(2025, 4, 29, 14, 30),
    profissional: 'Dr. Carlos Silva - CRM 12345',
    texto: 'Paciente relata melhora dos sintomas após início do tratamento. Mantém pressão arterial controlada (120x80 mmHg). Ausculta pulmonar sem alterações. Mantida prescrição atual por mais 15 dias.',
    cpfPaciente: '12345678900',
  },
  {
    tipo: 'avaliacao',
    tipoLabel: 'Avaliação',
    dataCompleta: '25/05/2025 - 09:15',
    data: new Date(2025, 4, 25, 9, 15),
    profissional: 'Enf. Ana Paula - COREN 54321',
    texto: 'Realizada aferição de sinais vitais. PA: 130x85 mmHg, FC: 78 bpm, FR: 16 irpm, Tax: 36.5°C. Paciente refere dor leve no local da aplicação da medicação. Orientado sobre cuidados locais.',
    cpfPaciente: '98765432111',
  },
  {
    tipo: 'procedimento',
    tipoLabel: 'Procedimento',
    dataCompleta: '20/05/2025 - 11:00',
    data: new Date(2025, 4, 20, 11, 0),
    profissional: 'Dr. Carlos Silva - CRM 12345',
    texto: 'Realizada administração de medicação conforme prescrição. Paciente sem intercorrências durante o procedimento. Orientado sobre possíveis efeitos colaterais e retorno em 10 dias.',
    cpfPaciente: '11122233344',
  },
];

export const estoqueMock = [
  {
    id: Math.random().toString(36).substr(2, 9),
    name: 'Dipirona 500mg',
    quantity: 50,
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 90)),
    category: 'Medicamento',
    createdAt: new Date(),
  },
  {
    id: Math.random().toString(36).substr(2, 9),
    name: 'Soro Fisiológico 100ml',
    quantity: 25,
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 20)),
    category: 'Medicamento',
    createdAt: new Date(),
  },
  {
    id: Math.random().toString(36).substr(2, 9),
    name: 'Luvas de Procedimento',
    quantity: 100,
    expiryDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    category: 'Material',
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Paracetamol',
    quantity: 100,
    expiryDate: '2025-12-31',
    category: 'Medicamento',
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'Seringa 5ml',
    quantity: 50,
    expiryDate: '2025-06-15',
    category: 'Material',
    createdAt: new Date(),
  },
];

export const cadastrosMock = [
  {
    id: '1',
    nome: 'Ana Costa',
    email: 'ana.costa@example.com',
    tipo: 'Paciente',
    dataCadastro: '01/06/2025',
  },
  {
    id: '2',
    nome: 'Dr. Pedro Almeida',
    email: 'pedro.almeida@example.com',
    tipo: 'Médico',
    dataCadastro: '02/06/2025',
  },
];