import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/Login.module.css';
import logoFSPH from '../../assets/fsph_logo.png';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simulação de envio de email para redefinição
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Email inválido.');
      }
      setSuccess('Instruções de redefinição enviadas para o seu email!');
      setEmail('');
      setTimeout(() => navigate('/login'), 2000); // Redireciona após 2 segundos
    } catch (err) {
      setError(err.message || 'Erro ao enviar o email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-box']}>
        <img src={logoFSPH} alt="Logo FSPH" className={styles.logoClass} />
        <h2>Recuperar Senha</h2>
        <p>Informe seu email para receber instruções de redefinição:</p>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles['success-color']}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles['input-group']}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email institucional"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={styles['login-button']}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        <Link to="/login" className={styles['forgot-password']}>
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}