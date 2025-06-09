import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/Login.module.css';
import logoFSPH from '../../assets/fsph_logo.png';
import { AuthContext } from '../../App';

export default function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [id, setId] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (id === 'admin' && senha === '123') {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/recepcao');
      } else {
        setError('Credenciais inválidas.');
      }
    } catch (err) {
      setError('Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-box']}>
        <img src={logoFSPH} alt="Logo FSPH" className={styles.logo} />
        <h2>Login</h2>
        <p>Digite seus dados de acesso nos campos abaixo:</p>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles['input-group']}>
            <label htmlFor="identificacao">Identificação</label>
            <input
              type="text"
              id="identificacao"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Digite seu ID institucional"
              required
              disabled={loading}
            />
          </div>
          <div className={styles['input-group']}>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder=""
              required
              disabled={loading}
            />
          </div>
          <Link to="/resetpassword" className={styles['forgot-password']}>Esqueceu a senha?</Link>
          <button
            type="submit"
            className={styles['login-button']}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Acessar'}
          </button>
        </form>
      </div>
    </div>
  );
}