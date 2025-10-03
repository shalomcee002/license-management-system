import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fetchCompaniesCount, fetchLicensesCount, fetchExpiringSoonCount, fetchLicensesTypeCount } from '../services/api';

const Card = ({ title, value, to }) => (
  <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
      <div style={{ fontSize: 12, color: '#64748b' }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  </Link>
);

const HomeDashboard = () => {
  const [stats, setStats] = useState({ companies: 0, licenses: 0, expiringSoon: 0, ctl: 0, prsl: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [companies, licenses, expiring, types] = await Promise.all([
          fetchCompaniesCount(),
          fetchLicensesCount(),
          fetchExpiringSoonCount(90),
          fetchLicensesTypeCount()
        ]);
        setStats({
          companies: companies || 0,
          licenses: licenses || 0,
          expiringSoon: expiring || 0,
          ctl: (types && types.CTL) || 0,
          prsl: (types && types.PRSL) || 0
        });
      } catch (e) {
        setStats(s => s);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
        <Card title="Companies" value={stats.companies} to="/companies" />
        <Card title="Licenses" value={stats.licenses} to="/licenses" />
        <Card title="Expiring Soon (90d)" value={stats.expiringSoon} to="/tools/expiry" />
        <Card title="CTL Licenses" value={stats.ctl} to="/licenses" />
        <Card title="PRSL Licenses" value={stats.prsl} to="/licenses" />
      </div>
      <div style={{ marginTop: 24 }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/settings/fees">Adjust Fees</Link>
          <Link to="/tools/compare">Compare Licenses</Link>
          <Link to="/reports">Generate Reports</Link>
          <Link to="/map">View Map</Link>
          <Link to="/notifications">Send Notifications</Link>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard; 