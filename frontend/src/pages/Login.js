import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (e) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <form onSubmit={submit} style={{ background: '#fff', padding: 24, borderRadius: 8, width: 360, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Sign In</button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
      </form>
    </div>
  );
};

export default Login; 