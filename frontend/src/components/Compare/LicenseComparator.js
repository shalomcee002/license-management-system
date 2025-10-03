import React, { useState } from 'react';
import axios from 'axios';

const LicenseComparator = () => {
  const [idA, setIdA] = useState('');
  const [idB, setIdB] = useState('');
  const [result, setResult] = useState(null);

  const compare = async () => {
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
        setResult({ error: 'Comparison failed' });
      }
    }
  };

  return (
    <div>
      <h2>Compare Two Licenses</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="License A ID" value={idA} onChange={e => setIdA(e.target.value)} />
        <input placeholder="License B ID" value={idB} onChange={e => setIdB(e.target.value)} />
        <button onClick={compare}>Compare</button>
      </div>
      {result && (
        <div style={{ marginTop: 12 }}>
          {'equal' in result ? (
            <div>
              <strong>Equal:</strong> {String(result.equal)}
            </div>
          ) : null}
          {result.error && <div style={{ color: 'red' }}>{result.error}</div>}
        </div>
      )}
    </div>
  );
};

export default LicenseComparator; 