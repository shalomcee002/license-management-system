import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/dateUtils';
import './ExpiryCalculator.css';

const yearsBetween = (fromIso, toIso) => {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  return Math.max(0, (to - from) / (1000 * 60 * 60 * 24 * 365.25));
};

const ExpiryCalculator = () => {
  const { userRole } = useAuth();
  const [licenseId, setLicenseId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [validityYears, setValidityYears] = useState('');
  const [licenseType, setLicenseType] = useState('PRSL');
  const [result, setResult] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch licenses for dropdown
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

  const computeLocal = () => {
    if (!issueDate || !validityYears) return;
    
    setLoading(true);
    
    try {
      const expiry = new Date(issueDate);
      // If CTL, use fixed 15 years validity period
      const yearsToAdd = licenseType === 'CTL' ? 15 : Number(validityYears);
      expiry.setFullYear(expiry.getFullYear() + yearsToAdd);
      const nowIso = new Date().toISOString();
      const years = yearsBetween(nowIso, expiry.toISOString());
      
      setResult({ 
        expiryDate: expiry.toISOString().slice(0, 10), 
        yearsToExpiry: Number(years.toFixed(2)),
        licenseType: licenseType
      });
    } catch (error) {
      console.error('Error calculating expiry:', error);
    } finally {
      setLoading(false);
    }
  };

  const computeFromServer = async () => {
    if (!licenseId) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const res = await axios.get(`/api/licenses/${licenseId}/years-to-expiry`);
      setResult(res.data);
    } catch (error) {
      console.error('Error fetching expiry data:', error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expiry-calculator">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Time Before License Expires</h2>
        <div className={`role-indicator ${userRole === 'ADMIN' ? 'admin' : userRole === 'OFFICER' ? 'officer' : 'viewer'}`}>
          <span>Role: {userRole}</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: 24, maxWidth: 700 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Compute from License ID</h3>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <select 
              value={licenseId} 
              onChange={e => setLicenseId(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">Select a license...</option>
              {licenses.map(license => (
                <option key={license.id} value={license.id}>
                  {license.licenseID} - {license.company?.companyName || 'Unknown Company'}
                </option>
              ))}
            </select>
            <button 
              onClick={computeFromServer}
              disabled={loading || !licenseId}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#2196f3', 
                color: 'white', 
                border: 'none',
                borderRadius: '4px',
                cursor: loading || !licenseId ? 'not-allowed' : 'pointer',
                opacity: loading || !licenseId ? 0.7 : 1
              }}
            >
              {loading ? 'Computing...' : 'Compute'}
            </button>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Compute from Issue Date + Validity</h3>
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>License Type</label>
              <select 
                value={licenseType} 
                onChange={e => setLicenseType(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="CTL">Cellular Telecommunications License (CTL)</option>
                <option value="PRSL">Public Radio Station License (PRSL)</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Issue Date</label>
              <input 
                type="date" 
                value={issueDate} 
                onChange={e => setIssueDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>
                {licenseType === 'CTL' ? 'Validity Period (fixed 15 years)' : 'Validity Period (years)'}
              </label>
              <input 
                type="number" 
                placeholder="Validity (years)" 
                value={licenseType === 'CTL' ? '15' : validityYears} 
                onChange={e => setValidityYears(e.target.value)}
                disabled={licenseType === 'CTL'}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  backgroundColor: licenseType === 'CTL' ? '#f5f5f5' : 'white'
                }}
              />
            </div>
            
            <button 
              onClick={computeLocal}
              disabled={loading || !issueDate || (licenseType === 'PRSL' && !validityYears)}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#4caf50', 
                color: 'white', 
                border: 'none',
                borderRadius: '4px',
                cursor: loading || !issueDate || (licenseType === 'PRSL' && !validityYears) ? 'not-allowed' : 'pointer',
                opacity: loading || !issueDate || (licenseType === 'PRSL' && !validityYears) ? 0.7 : 1
              }}
            >
              {loading ? 'Computing...' : 'Compute'}
            </button>
          </div>
        </div>
      </div>
      
      {result && (
        <div style={{ 
          marginTop: 24, 
          padding: 24, 
          background: '#f0f9ff', 
          borderRadius: 8, 
          border: '1px solid #bae6fd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginTop: 0, color: '#0369a1' }}>License Expiry Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <p><strong>License Type:</strong> {result.licenseType || (licenseType === 'CTL' ? 'Cellular Telecommunications License' : 'Public Radio Station License')}</p>
              <p><strong>Expiry Date:</strong> {result.expiryDate}</p>
            </div>
            <div>
              <p><strong>Years Remaining:</strong> {result.yearsToExpiry}</p>
              <p><strong>Status:</strong> 
                <span style={{ 
                  color: result.yearsToExpiry <= 0 ? '#ef4444' : 
                         result.yearsToExpiry < 1 ? '#f97316' : '#22c55e',
                  fontWeight: 'bold'
                }}>
                  {result.yearsToExpiry <= 0 ? 'Expired' : 
                   result.yearsToExpiry < 1 ? 'Expiring Soon' : 'Active'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiryCalculator;