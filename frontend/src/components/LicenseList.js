import React, { useState, useEffect, useMemo } from "react";
import { fetchLicenses, createLicense, updateLicense, deleteLicense, yearsToExpiry, compareLicenses } from "../services/api";

const PAGE_SIZE = 10;

const LicenseForm = ({ onSave, license, onCancel }) => {
  const [form, setForm] = useState({
    licenseID: "",
    licenseIssueDate: "",
    validityPeriod: "",
    expiryDate: "",
    frequencyFee: "",
    company: null,
    companyId: ""
  });

  useEffect(() => {
    if (license) setForm({ ...license, companyId: license.company?.id || license.companyId });
  }, [license]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.company && payload.companyId) payload.company = { id: Number(payload.companyId) };
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
      <input name="licenseID" value={form.licenseID} onChange={handleChange} placeholder="License ID" required />
      <input name="licenseIssueDate" value={form.licenseIssueDate} onChange={handleChange} placeholder="Issue Date" type="date" />
      <input name="validityPeriod" value={form.validityPeriod} onChange={handleChange} placeholder="Validity Period (years)" type="number" />
      <input name="expiryDate" value={form.expiryDate} onChange={handleChange} placeholder="Expiry Date" type="date" />
      <input name="frequencyFee" value={form.frequencyFee} onChange={handleChange} placeholder="Frequency Fee" type="number" />
      <input name="companyId" value={form.companyId} onChange={handleChange} placeholder="Company ID" type="number" />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Save</button>
        {onCancel && <button onClick={onCancel} type="button">Cancel</button>}
      </div>
    </form>
  );
};

const LicenseList = () => {
  const [licenses, setLicenses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [compareResult, setCompareResult] = useState(null);

  useEffect(() => {
    fetchLicenses().then(setLicenses);
  }, []);

  const onSave = async (license) => {
    if (license.id) {
      const updated = await updateLicense(license.id, license);
      setLicenses(prev => prev.map(l => l.id === updated.id ? updated : l));
      setEditing(null);
    } else {
      const created = await createLicense(license);
      setLicenses(prev => [created, ...prev]);
    }
  };

  const onDelete = async (id) => {
    await deleteLicense(id);
    setLicenses(prev => prev.filter(l => l.id !== id));
  };

  const onCheckYears = async (id) => {
    const r = await yearsToExpiry(id);
    alert(`Expiry: ${r.expiryDate}\nYears remaining: ${r.yearsToExpiry}`);
  };

  const onCompare = async () => {
    const r = await compareLicenses(compareA, compareB);
    setCompareResult(r);
  };

  const filtered = useMemo(() => licenses.filter(l =>
    l.licenseID?.toLowerCase().includes(filter.toLowerCase()) ||
    String(l.company?.companyName || '').toLowerCase().includes(filter.toLowerCase())
  ), [licenses, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  return (
    <div>
      <h2>Licenses</h2>
      <LicenseForm onSave={onSave} license={editing} onCancel={() => setEditing(null)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <input placeholder="Search licenses..." value={filter} onChange={e => setFilter(e.target.value)} />
        <div>Page {page} / {totalPages}</div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <input placeholder="License A ID" value={compareA} onChange={e => setCompareA(e.target.value)} />
        <input placeholder="License B ID" value={compareB} onChange={e => setCompareB(e.target.value)} />
        <button onClick={onCompare}>Compare</button>
        {compareResult && <span>Equal: {String(compareResult.equal)}</span>}
      </div>
      <table width="100%" cellPadding="6" style={{ background: '#fff' }}>
        <thead>
          <tr>
            <th>License ID</th>
            <th>Company</th>
            <th>Issue Date</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map(l => (
            <tr key={l.id}>
              <td>{l.licenseID}</td>
              <td>{l.company ? l.company.companyName : l.companyId}</td>
              <td>{l.licenseIssueDate?.slice?.(0,10) || ''}</td>
              <td>{l.expiryDate?.slice?.(0,10) || ''}</td>
              <td>
                <button onClick={() => setEditing(l)}>Edit</button>
                <button onClick={() => onDelete(l.id)}>Delete</button>
                <button onClick={() => onCheckYears(l.id)}>Years To Expiry</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default LicenseList;
