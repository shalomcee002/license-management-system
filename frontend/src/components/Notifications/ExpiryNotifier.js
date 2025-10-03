import React, { useState } from 'react';
import axios from 'axios';

const ExpiryNotifier = () => {
  const [days, setDays] = useState(90);
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);

  const send = async () => {
    setRunning(true);
    setStatus('');
    try {
      await axios.post('/api/notifications/expiring', { days: Number(days) });
      setStatus('Notifications sent.');
    } catch (e) {
      setStatus('Failed to send notifications.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <h2>Expiry Notifications</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="number" value={days} onChange={e => setDays(e.target.value)} />
        <span>days before expiry</span>
        <button onClick={send} disabled={running}>{running ? 'Sending...' : 'Send Emails'}</button>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
};

export default ExpiryNotifier; 