import React, { useState } from 'react';
import axios from 'axios';

const yearsBetween = (fromIso, toIso) => {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  return Math.max(0, (to - from) / (1000 * 60 * 60 * 24 * 365.25));
};

const ExpiryCalculator = () => {
  const [licenseId, setLicenseId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [validityYears, setValidityYears] = useState('');
  const [result, setResult] = useState(null);

  const computeLocal = () => {
    if (!issueDate || !validityYears) return;
    const expiry = new Date(issueDate);
    expiry.setFullYear(expiry.getFullYear() + Number(validityYears));
    const nowIso = new Date().toISOString();
    const years = yearsBetween(nowIso, expiry.toISOString());
    setResult({ expiryDate: expiry.toISOString().slice(0, 10), yearsToExpiry: Number(years.toFixed(2)) });
  };

  const computeFromServer = async () => {
    if (!licenseId) return;
    try {
      const res = await axios.get(`/api/licenses/${licenseId}/years-to-expiry`);
      setResult(res.data);
    } catch (e) {
      setResult(null);
    }
  };

  return (
    <div>
      <h2>Time Before License Expires</h2>
      <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h4>Compute from License ID</h4>
          <input placeholder="License ID" value={licenseId} onChange={e => setLicenseId(e.target.value)} />
          <button onClick={computeFromServer}>Compute</button>
        </div>
        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h4>Compute from Issue Date + Validity</h4>
          <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
          <input type="number" placeholder="Validity (years)" value={validityYears} onChange={e => setValidityYears(e.target.value)} />
          <button onClick={computeLocal}>Compute</button>
        </div>
      </div>
      {result && (
        <div style={{ marginTop: 16 }}>
          <strong>Expiry Date:</strong> {result.expiryDate} &nbsp; &nbsp;
          <strong>Years Remaining:</strong> {result.yearsToExpiry}
        </div>
      )}
    </div>
  );
};

export default ExpiryCalculator; 