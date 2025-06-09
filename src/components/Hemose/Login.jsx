import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Login.module.css';
<img src="/fsph_logo.png" alt="Logo" className={styles.logo} />


export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id && senha) navigate('/recepcao'); // Redireciona para a recepção
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <img src={logoFSPH} alt="FSPH Logo" className={styles.logo} />
        <h2>Login</h2>
        <p>Digite seus dados de acesso nos campos abaixo:</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="identificacao">Identificação</label>
            <input
              type="text"
              id="identificacao"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Digite seu ID institucional"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha de acesso"
              required
            />
          </div>
          <a href="#" className={styles.forgotPassword}>Esqueci minha senha</a>
          <button type="submit" className={styles.loginButton}>Acessar</button>
        </form>
      </div>
    </div>
  );
}
