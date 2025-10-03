import React, { useState, useEffect, useMemo } from 'react';
import { fetchLicenses, createLicense, updateLicense, deleteLicense, yearsToExpiry } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const LicenseForm = ({ onSave, license, onCancel, userRole }) => {
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

  // Only ADMIN and OFFICER can edit all fields
  const isReadOnly = userRole === 'VIEWER';

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
      <input 
        name="licenseID" 
        value={form.licenseID} 
        onChange={handleChange} 
        placeholder="License ID" 
        required 
        readOnly={isReadOnly}
      />
      <input 
        name="licenseIssueDate" 
        value={form.licenseIssueDate} 
        onChange={handleChange} 
        placeholder="Issue Date" 
        type="date" 
        readOnly={isReadOnly}
      />
      <input 
        name="validityPeriod" 
        value={form.validityPeriod} 
        onChange={handleChange} 
        placeholder="Validity Period (years)" 
        type="number" 
        readOnly={isReadOnly}
      />
      <input 
        name="expiryDate" 
        value={form.expiryDate} 
        onChange={handleChange} 
        placeholder="Expiry Date" 
        type="date" 
        readOnly={isReadOnly}
      />
      <input 
        name="frequencyFee" 
        value={form.frequencyFee} 
        onChange={handleChange} 
        placeholder="Frequency Fee" 
        type="number" 
        readOnly={isReadOnly}
      />
      <input 
        name="companyId" 
        value={form.companyId} 
        onChange={handleChange} 
        placeholder="Company ID" 
        type="number" 
        readOnly={isReadOnly}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        {!isReadOnly && <button type="submit">Save</button>}
        {onCancel && <button onClick={onCancel} type="button">Cancel</button>}
      </div>
    </form>
  );
};

const RoleLicenseManagement = () => {
  const [licenses, setLicenses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('auth_role');
    if (!role) {
      // Redirect to login if no role found
      navigate('/login');
      return;
    }
    setUserRole(role);

    // Fetch licenses
    fetchLicenses().then(setLicenses);
  }, [navigate]);

  const onSave = async (license) => {
    // Only ADMIN and OFFICER can save
    if (userRole === 'VIEWER') return;

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
    // Only ADMIN can delete
    if (userRole !== 'ADMIN') return;

    await deleteLicense(id);
    setLicenses(prev => prev.filter(l => l.id !== id));
  };

  const onCheckYears = async (id) => {
    const r = await yearsToExpiry(id);
    alert(`Expiry: ${r.expiryDate}\nYears remaining: ${r.yearsToExpiry}`);
  };

  const filtered = useMemo(() => licenses.filter(l =>
    l.licenseID?.toLowerCase().includes(filter.toLowerCase()) ||
    String(l.company?.companyName || '').toLowerCase().includes(filter.toLowerCase())
  ), [licenses, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  // Determine what actions are available based on role
  const canEdit = userRole === 'ADMIN' || userRole === 'OFFICER';
  const canDelete = userRole === 'ADMIN';
  const canCreate = userRole === 'ADMIN' || userRole === 'OFFICER';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Licenses Management</h2>
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
      
      {canCreate && (
        <LicenseForm onSave={onSave} license={editing} onCancel={() => setEditing(null)} userRole={userRole} />
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input 
            placeholder="Search licenses..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          {canCreate && (
            <button 
              onClick={() => setEditing({ licenseID: '', licenseIssueDate: '', validityPeriod: '', expiryDate: '', frequencyFee: '' })}
              style={{ 
                backgroundColor: '#4caf50', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              + New License
            </button>
          )}
        </div>
        <div>Page {page} / {totalPages}</div>
      </div>
      
      <table width="100%" cellPadding="10" style={{ background: '#fff', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ textAlign: 'left' }}>License ID</th>
            <th style={{ textAlign: 'left' }}>Company</th>
            <th style={{ textAlign: 'left' }}>Issue Date</th>
            <th style={{ textAlign: 'left' }}>Expiry Date</th>
            <th style={{ textAlign: 'left' }}>License Type</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map(l => (
            <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{l.licenseID}</td>
              <td>{l.company ? l.company.companyName : l.companyId}</td>
              <td>{l.licenseIssueDate?.slice?.(0,10) || ''}</td>
              <td>{l.expiryDate?.slice?.(0,10) || ''}</td>
              <td>{l.constructor.name === 'CellularTelecomLicense' ? 'CTL' : 'PRSL'}</td>
              <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {canEdit && (
                  <button 
                    onClick={() => setEditing(l)} 
                    style={{ 
                      backgroundColor: '#2196f3', 
                      color: 'white', 
                      border: 'none', 
                      padding: '6px 12px', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button 
                    onClick={() => onDelete(l.id)} 
                    style={{ 
                      backgroundColor: '#f44336', 
                      color: 'white', 
                      border: 'none', 
                      padding: '6px 12px', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                )}
                <button 
                  onClick={() => onCheckYears(l.id)} 
                  style={{ 
                    backgroundColor: '#ff9800', 
                    color: 'white', 
                    border: 'none', 
                    padding: '6px 12px', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Expiry
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
        <button 
          disabled={page <= 1} 
          onClick={() => setPage(p => p - 1)}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: page <= 1 ? '#f5f5f5' : '#fff',
            cursor: page <= 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>
        <button 
          disabled={page >= totalPages} 
          onClick={() => setPage(p => p + 1)}
          style={{ 
            padding: '8px 16px', 
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: page >= totalPages ? '#f5f5f5' : '#fff',
            cursor: page >= totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RoleLicenseManagement;