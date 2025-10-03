import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './FeeAdjuster.css';

const FeeAdjuster = () => {
  const { userRole } = useAuth();
  const [percent, setPercent] = useState(0);
  const [licenseType, setLicenseType] = useState('CTL');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [currentFees, setCurrentFees] = useState({
    CTL: { application: 800, license: 100000000 },
    PRSL: { application: 350, license: 2000000 }
  });
  const [previewFees, setPreviewFees] = useState(null);
  
  // Check if user has permission to adjust fees
  const canAdjustFees = userRole === 'ADMIN';

  // Calculate preview of adjusted fees
  useEffect(() => {
    if (percent) {
      const factor = 1 + (Number(percent) / 100);
      setPreviewFees({
        application: Math.round(currentFees[licenseType].application * factor * 100) / 100,
        license: Math.round(currentFees[licenseType].license * factor * 100) / 100
      });
    } else {
      setPreviewFees(null);
    }
  }, [percent, licenseType, currentFees]);

  const submit = async e => {
    e.preventDefault();
    if (!canAdjustFees) {
      setMessage('You do not have permission to adjust fees.');
      return;
    }
    
    setSaving(true);
    setMessage('');
    try {
      await axios.post(`/api/fees/adjust`, { licenseType, percent: Number(percent) });
      
      // Update current fees after successful adjustment
      setCurrentFees(prev => ({
        ...prev,
        [licenseType]: {
          application: previewFees.application,
          license: previewFees.license
        }
      }));
      
      setMessage(`Fees for ${licenseType} adjusted successfully by ${percent}%.`);
      setPercent(0); // Reset percent after successful adjustment
      setPreviewFees(null);
    } catch (error) {
      console.error('Error adjusting fees:', error);
      setMessage('Failed to adjust fees. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Adjust Application Fees</h2>
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
      
      <div style={{ display: 'grid', gap: 24, maxWidth: 700 }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Current Fee Structure</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <h4 style={{ margin: '0 0 12px 0' }}>Cellular Telecommunications License (CTL)</h4>
              <p><strong>Application Fee:</strong> US${currentFees.CTL.application.toLocaleString()}</p>
              <p><strong>License Fee:</strong> US${currentFees.CTL.license.toLocaleString()}</p>
              <p><strong>Annual Frequency Fee:</strong> US$0</p>
              <p><strong>Universal Services Fund:</strong> US$3,000</p>
            </div>
            <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <h4 style={{ margin: '0 0 12px 0' }}>Public Radio Station License (PRSL)</h4>
              <p><strong>Application Fee:</strong> US${currentFees.PRSL.application.toLocaleString()}</p>
              <p><strong>License Fee:</strong> US${currentFees.PRSL.license.toLocaleString()}</p>
              <p><strong>Annual Frequency Fee:</strong> US$2,000</p>
              <p><strong>Universal Services Fund:</strong> US$0</p>
            </div>
          </div>
        </div>
        
        <div style={{ 
          background: '#fff', 
          padding: 24, 
          borderRadius: 8, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          opacity: canAdjustFees ? 1 : 0.7
        }}>
          <h3 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: 8 }}>
            Fee Adjustment
            {!canAdjustFees && (
              <span style={{ 
                fontSize: '0.8rem', 
                backgroundColor: '#ef4444', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontWeight: 'normal'
              }}>
                Admin Only
              </span>
            )}
          </h3>
          
          <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>License Type</label>
              <select 
                value={licenseType} 
                onChange={e => setLicenseType(e.target.value)}
                disabled={!canAdjustFees || saving}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  backgroundColor: !canAdjustFees ? '#f5f5f5' : 'white'
                }}
              >
                <option value="CTL">Cellular Telecommunications License (CTL)</option>
                <option value="PRSL">Public Radio Station License (PRSL)</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Percentage Change (%)</label>
              <input 
                type="number" 
                step="0.01" 
                value={percent} 
                onChange={e => setPercent(e.target.value)} 
                required
                disabled={!canAdjustFees || saving}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  backgroundColor: !canAdjustFees ? '#f5f5f5' : 'white'
                }}
              />
            </div>
            
            {previewFees && (
              <div style={{ 
                padding: 16, 
                backgroundColor: '#f0f9ff', 
                borderRadius: 8, 
                border: '1px solid #bae6fd'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#0369a1' }}>Preview of Adjusted Fees</h4>
                <p><strong>Application Fee:</strong> US${previewFees.application.toLocaleString()} 
                  <span style={{ color: percent > 0 ? '#16a34a' : '#dc2626' }}>
                    ({percent > 0 ? '+' : ''}{percent}%)
                  </span>
                </p>
                <p><strong>License Fee:</strong> US${previewFees.license.toLocaleString()} 
                  <span style={{ color: percent > 0 ? '#16a34a' : '#dc2626' }}>
                    ({percent > 0 ? '+' : ''}{percent}%)
                  </span>
                </p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={!canAdjustFees || saving || !percent}
              style={{ 
                padding: '12px 20px', 
                backgroundColor: canAdjustFees ? '#2196f3' : '#9ca3af', 
                color: 'white', 
                border: 'none',
                borderRadius: '4px',
                cursor: !canAdjustFees || saving || !percent ? 'not-allowed' : 'pointer',
                marginTop: 8
              }}
            >
              {saving ? 'Applying Changes...' : 'Apply Fee Adjustment'}
            </button>
          </form>
          
          {message && (
            <div style={{ 
              marginTop: 16, 
              padding: 12, 
              backgroundColor: message.includes('success') ? '#f0fdf4' : '#fef2f2', 
              borderRadius: 4,
              border: `1px solid ${message.includes('success') ? '#86efac' : '#fecaca'}`,
              color: message.includes('success') ? '#166534' : '#b91c1c'
            }}>
              {message}
            </div>
          )}
          
          {!canAdjustFees && (
            <div style={{ 
              marginTop: 16, 
              padding: 12, 
              backgroundColor: '#fef2f2', 
              borderRadius: 4,
              border: '1px solid #fecaca',
              color: '#b91c1c'
            }}>
              You must have ADMIN role to adjust fees.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeAdjuster;