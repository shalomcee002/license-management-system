import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import '../styles/Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('ROLE_VIEWER');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const availableRoles = [
    { value: 'ROLE_VIEWER', label: 'Viewer' },
    { value: 'ROLE_OFFICER', label: 'Officer' },
    { value: 'ROLE_ADMIN', label: 'Administrator' }
  ];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await signup(name, email, password, selectedRole);
      navigate('/');
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error) {
        setError(e.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };
  
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="auth-form">
        <h2 className="auth-title">Create Your Account</h2>
        <div className="auth-form-group">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="auth-input"
            required 
          />
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
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            className="auth-input"
            required 
          />
          
          <div>
            <label htmlFor="role-select" className="auth-label">Select Role:</label>
            <select 
              id="role-select"
              value={selectedRole} 
              onChange={handleRoleChange}
              className="auth-select"
            >
              {availableRoles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="auth-button">Create Account</button>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <div className="auth-link-container">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;