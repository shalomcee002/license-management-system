import React, { useState } from 'react';
import axios from 'axios';

const ExportReports = () => {
  const [format, setFormat] = useState('csv');
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    setDownloading(true);
    try {
      const res = await axios.get(`/api/reports/licenses?format=${format}`, { responseType: 'blob' });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `licenses.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      // noop
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h2>Reports</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <select value={format} onChange={e => setFormat(e.target.value)}>
          <option value="csv">CSV</option>
          <option value="xlsx">Excel</option>
          <option value="pdf">PDF</option>
          <option value="docx">Word</option>
        </select>
        <button onClick={download} disabled={downloading}>{downloading ? 'Generating...' : 'Download'}</button>
      </div>
    </div>
  );
};

export default ExportReports; 