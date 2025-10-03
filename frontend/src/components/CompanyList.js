import React, { useState, useEffect, useMemo } from "react";
import { fetchCompanies, createCompany, updateCompany, deleteCompany } from "../services/api";

const PAGE_SIZE = 10;

const CompanyForm = ({ onSave, company, onCancel }) => {
  const [form, setForm] = useState({
    companyName: "",
    gpsCoordinates: "",
    email: "",
    applicationFee: "",
    licenseFee: "",
    annualContribution: ""
  });

  useEffect(() => {
    if (company) setForm(company);
  }, [company]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
      <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" required />
      <input name="gpsCoordinates" value={form.gpsCoordinates} onChange={handleChange} placeholder="GPS Coordinates (lat,lng)" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
      <input name="applicationFee" value={form.applicationFee} onChange={handleChange} placeholder="Application Fee" type="number" />
      <input name="licenseFee" value={form.licenseFee} onChange={handleChange} placeholder="License Fee" type="number" />
      <input name="annualContribution" value={form.annualContribution} onChange={handleChange} placeholder="Annual Contribution" type="number" />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Save</button>
        {onCancel && <button onClick={onCancel} type="button">Cancel</button>}
      </div>
    </form>
  );
};

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCompanies().then(setCompanies);
  }, []);

  const onSave = async (company) => {
    if (company.id) {
      const updated = await updateCompany(company.id, company);
      setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
      setEditing(null);
    } else {
      const created = await createCompany(company);
      setCompanies(prev => [created, ...prev]);
    }
  };

  const onDelete = async (id) => {
    await deleteCompany(id);
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const filtered = useMemo(() => companies.filter(c =>
    c.companyName?.toLowerCase().includes(filter.toLowerCase()) ||
    c.email?.toLowerCase().includes(filter.toLowerCase())
  ), [companies, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  return (
    <div>
      <h2>Companies</h2>
      <CompanyForm onSave={onSave} company={editing} onCancel={() => setEditing(null)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <input placeholder="Search companies..." value={filter} onChange={e => setFilter(e.target.value)} />
        <div>Page {page} / {totalPages}</div>
      </div>
      <table width="100%" cellPadding="6" style={{ background: '#fff' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>GPS</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map(c => (
            <tr key={c.id}>
              <td>{c.companyName}</td>
              <td>{c.email}</td>
              <td>{c.gpsCoordinates}</td>
              <td>
                <button onClick={() => setEditing(c)}>Edit</button>
                <button onClick={() => onDelete(c.id)}>Delete</button>
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

export default CompanyList;
