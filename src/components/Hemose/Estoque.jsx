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
import { estoqueMock } from '../../data/mocks';

export default function Estoque() {
  const { setIsAuthenticated } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState(estoqueMock);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!quantity || isNaN(quantity) || quantity < 0) newErrors.quantity = 'Quantidade inválida';
    if (!expiryDate) newErrors.expiryDate = 'Data de validade é obrigatória';
    if (!category) newErrors.category = 'Categoria é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const checkExpiryStatus = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(date);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'expired', daysRemaining: diffDays };
    if (diffDays <= 30) return { status: 'expiring-soon', daysRemaining: diffDays };
    return { status: 'normal', daysRemaining: diffDays };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const newItem = {
      id: generateId(),
      name,
      quantity: parseInt(quantity, 10),
      expiryDate: new Date(expiryDate),
      category,
      createdAt: new Date(),
    };

    setItems([...items, newItem]);
    setName('');
    setQuantity('');
    setExpiryDate('');
    setCategory('');
    alert(`${name} adicionado com sucesso!`);
  };

  const removeItem = (id) => {
    const item = items.find(i => i.id === id);
    setItems(items.filter(i => i.id !== id));
    alert(`${item.name} removido do estoque.`);
  };

  const sortedItems = [...items].sort((a, b) => {
    const aStatus = checkExpiryStatus(a.expiryDate);
    const bStatus = checkExpiryStatus(b.expiryDate);
    const priority = { expired: 0, 'expiring-soon': 1, normal: 2 };
    return priority[aStatus.status] - priority[bStatus.status] || aStatus.daysRemaining - bStatus.daysRemaining;
  });

  const total = items.length;
  const expiring = items.filter(i => checkExpiryStatus(i.expiryDate).status === 'expiring-soon').length;
  const expired = items.filter(i => checkExpiryStatus(i.expiryDate).status === 'expired').length;

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
          <h2 className="menu-navegacao-titulo">4. Estoque</h2>
          <ul>
            <li><Link to="/estoque">4.1 Gerenciar Estoque</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Gerenciamento de Estoque</h1>
          <button className="hamburger-button" onClick={() => setMenuOpen(!menuOpen)}>
            <img src={menuIcon} alt="Menu" />
          </button>
        </header>

        <section className="form-cadastro-container">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="form-row">
              <div className="form-group">
                <label htmlFor="item-name">Nome:</label>
                <input
                  type="text"
                  id="item-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="item-quantity">Quantidade:</label>
                <input
                  type="number"
                  id="item-quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                {errors.quantity && <span className="error">{errors.quantity}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="item-expiry">Validade:</label>
                <input
                  type="date"
                  id="item-expiry"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="item-category">Categoria:</label>
                <select
                  id="item-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Medicamento">Medicamento</option>
                  <option value="Material">Material</option>
                </select>
                {errors.category && <span className="error">{errors.category}</span>}
              </div>
              <button type="submit" className="submit-button-main">Adicionar</button>
            </form>
          </div>

          <div className="stats">
            <div className="stat-card">
              <h3>{total}</h3>
              <p>Total de Itens</p>
            </div>
            <div className="stat-card">
              <h3>{expiring}</h3>
              <p>Itens Vencendo</p>
            </div>
            <div className="stat-card">
              <h3>{expired}</h3>
              <p>Itens Vencidos</p>
            </div>
          </div>

          <div className="items-container">
            <div className="items-list">
              {sortedItems.length === 0 ? (
                <div className="no-items"><p>Nenhum item cadastrado.</p></div>
              ) : (
                sortedItems.map(item => {
                  const { status, daysRemaining } = checkExpiryStatus(item.expiryDate);
                  const expiryText = status === 'expired' ? `Vencido há ${Math.abs(daysRemaining)} dias` : `Vence em ${daysRemaining} dias`;
                  const expiryClass = status === 'expired' ? 'expiry-danger' : status === 'expiring-soon' ? 'expiry-warning' : '';

                  return (
                    <div key={item.id} className={`item-card ${status}`}>
                      <div className="item-info">
                        <h3>{item.name}</h3>
                        <p><strong>Quantidade:</strong> {item.quantity}</p>
                        <p><strong>Categoria:</strong> {item.category}</p>
                        <p><strong>Validade:</strong> {formatDate(item.expiryDate)}</p>
                        <p className={expiryClass}>{expiryText}</p>
                      </div>
                      <div className="actions">
                        <button className="delete-btn" onClick={() => removeItem(item.id)}>Remover</button>
                      </div>
                    </div>
                  );
                })
              )}
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
    </div>
  );
}