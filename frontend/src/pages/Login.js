import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login(email, password);
      if (result.roles && result.roles.length > 0) {
        setAvailableRoles(result.roles);
        if (!selectedRole) {
          setSelectedRole(result.roles[0]);
        } else {
          // Store the selected role and navigate
          localStorage.setItem('auth_role', selectedRole);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (e) {
      setError('Invalid credentials');
    }
  };
  
  // When a role is selected from dropdown, update localStorage and navigate
  const handleRoleSelect = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    localStorage.setItem('auth_role', role);
    navigate('/');
  };

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="auth-form">
        <h2 className="auth-title">Login to Your Account</h2>
        <div className="auth-form-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="auth-input"
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="auth-input"
            required 
          />
          
          {availableRoles.length > 0 && (
            <div>
              <label htmlFor="role-select" className="auth-label">Select Role:</label>
              <select 
                id="role-select"
                value={selectedRole} 
                onChange={handleRoleSelect}
                className="auth-select"
              >
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {role.replace('ROLE_', '')}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <button type="submit" className="auth-button">
            {availableRoles.length > 0 ? 'Switch Role' : 'Sign In'}
          </button>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <div className="auth-link-container">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;