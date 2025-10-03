import React, { useState } from 'react';
import axios from 'axios';

const FeeAdjuster = () => {
  const [percent, setPercent] = useState(0);
  const [licenseType, setLicenseType] = useState('CTL');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await axios.post(`/api/fees/adjust`, { licenseType, percent: Number(percent) });
      setMessage('Fees adjusted successfully.');
    } catch (e) {
      setMessage('Failed to adjust fees.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Adjust Application Fees</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <label>
          License Type
          <select value={licenseType} onChange={e => setLicenseType(e.target.value)}>
            <option value="CTL">Cellular Telecommunications License (CTL)</option>
            <option value="PRSL">Public Radio Station License (PRSL)</option>
          </select>
        </label>
        <label>
          Percentage Change (%)
          <input type="number" step="0.01" value={percent} onChange={e => setPercent(e.target.value)} required />
        </label>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Apply Adjustment'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FeeAdjuster; 