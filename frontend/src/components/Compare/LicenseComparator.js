import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './LicenseComparator.css';

const LicenseComparator = () => {
  const { userRole } = useAuth();
  const [idA, setIdA] = useState('');
  const [idB, setIdB] = useState('');
  const [result, setResult] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch licenses for dropdown
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await axios.get('/api/licenses');
        setLicenses(response.data);
      } catch (error) {
        console.error('Error fetching licenses:', error);
      }
    };
    
    fetchLicenses();
  }, []);

  const compare = async () => {
    if (!idA || !idB) {
      setResult({ error: 'Please select both licenses to compare' });
      return;
    }
    
    if (idA === idB) {
      setResult({ error: 'Please select two different licenses to compare', equal: true });
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const res = await axios.post('/api/licenses/compare', { a: idA, b: idB });
      setResult(res.data);
    } catch (e) {
      try {
        const [a, b] = await Promise.all([
          axios.get(`/api/licenses/${idA}`),
          axios.get(`/api/licenses/${idB}`)
        ]);
        const eq = JSON.stringify(a.data) === JSON.stringify(b.data);
        setResult({ equal: eq, a: a.data, b: b.data });
      } catch (err) {
        setResult({ error: 'Comparison failed. Please check if the license IDs are valid.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Compare Two Licenses</h2>
        <div className="role-indicator" style={{ 
          padding: '8px 15px', 
          backgroundColor: userRole === 'ADMIN' ? '#4caf50' : userRole === 'OFFICER' ? '#2196f3' : '#ff9800', 
          color: 'white', 
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          <span>Role: {userRole}</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: 24, maxWidth: 800 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Select Licenses to Compare</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>License A</label>
              <select 
                value={idA} 
                onChange={e => setIdA(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="">Select first license...</option>
                {licenses.map(license => (
                  <option key={`a-${license.id}`} value={license.id}>
                    {license.licenseID} - {license.company?.companyName || 'Unknown Company'}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>License B</label>
              <select 
                value={idB} 
                onChange={e => setIdB(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="">Select second license...</option>
                {licenses.map(license => (
                  <option key={`b-${license.id}`} value={license.id}>
                    {license.licenseID} - {license.company?.companyName || 'Unknown Company'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            onClick={compare}
            disabled={loading || !idA || !idB}
            style={{ 
              marginTop: 16,
              padding: '10px 20px', 
              backgroundColor: '#2196f3', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !idA || !idB ? 'not-allowed' : 'pointer',
              opacity: loading || !idA || !idB ? 0.7 : 1
            }}
          >
            {loading ? 'Comparing...' : 'Compare Licenses'}
          </button>
        </div>
        
        {result && (
          <div style={{ 
            padding: 24, 
            background: 'equal' in result ? 
              (result.equal ? '#f0fdf4' : '#fef2f2') : 
              '#f0f9ff', 
            borderRadius: 8, 
            border: 'equal' in result ? 
              (result.equal ? '1px solid #86efac' : '1px solid #fecaca') : 
              '1px solid #bae6fd',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ 
              marginTop: 0, 
              color: 'equal' in result ? 
                (result.equal ? '#166534' : '#b91c1c') : 
                '#0369a1'
            }}>
              Comparison Results
            </h3>
            
            {'equal' in result ? (
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  padding: '12px 16px',
                  backgroundColor: result.equal ? '#dcfce7' : '#fee2e2',
                  borderRadius: 4,
                  marginBottom: 16
                }}>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    color: result.equal ? '#16a34a' : '#dc2626'
                  }}>
                    {result.equal ? '✓' : '✗'}
                  </span>
                  <span style={{ fontWeight: 'bold' }}>
                    Licenses are {result.equal ? 'identical' : 'different'}
                  </span>
                </div>
                
                {result.a && result.b && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <h4 style={{ marginTop: 0 }}>License A Details</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li><strong>ID:</strong> {result.a.licenseID || result.a.id}</li>
                        <li><strong>Company:</strong> {result.a.company?.companyName || 'N/A'}</li>
                        <li><strong>Issue Date:</strong> {result.a.licenseIssueDate ? new Date(result.a.licenseIssueDate).toLocaleDateString() : 'N/A'}</li>
                        <li><strong>Expiry Date:</strong> {result.a.expiryDate ? new Date(result.a.expiryDate).toLocaleDateString() : 'N/A'}</li>
                        <li><strong>Type:</strong> {result.a.constructor?.name || (result.a.annualFrequencyFee ? 'PRSL' : 'CTL')}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ marginTop: 0 }}>License B Details</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li><strong>ID:</strong> {result.b.licenseID || result.b.id}</li>
                        <li><strong>Company:</strong> {result.b.company?.companyName || 'N/A'}</li>
                        <li><strong>Issue Date:</strong> {result.b.licenseIssueDate ? new Date(result.b.licenseIssueDate).toLocaleDateString() : 'N/A'}</li>
                        <li><strong>Expiry Date:</strong> {result.b.expiryDate ? new Date(result.b.expiryDate).toLocaleDateString() : 'N/A'}</li>
                        <li><strong>Type:</strong> {result.b.constructor?.name || (result.b.annualFrequencyFee ? 'PRSL' : 'CTL')}</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
            
            {result.error && (
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#fee2e2',
                borderRadius: 4,
                color: '#b91c1c'
              }}>
                <strong>Error:</strong> {result.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LicenseComparator;