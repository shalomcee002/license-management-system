import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeDashboard from './pages/HomeDashboard';
import CompanyList from './components/CompanyList';
import LicenseList from './components/LicenseList';
import FeeAdjuster from './components/Fees/FeeAdjuster';
import ExpiryCalculator from './components/Expiry/ExpiryCalculator';
import LicenseComparator from './components/Compare/LicenseComparator';
import ExportReports from './components/Reports/ExportReports';
import MapView from './components/Map/MapView';
import ExpiryNotifier from './components/Notifications/ExpiryNotifier';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: 240, background: '#0f172a', color: '#fff', padding: 16 }}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>License Manager</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link style={{ color: '#fff' }} to="/">Home</Link>
            <Link style={{ color: '#fff' }} to="/companies">Companies</Link>
            <Link style={{ color: '#fff' }} to="/licenses">Licenses</Link>
            <Link style={{ color: '#fff' }} to="/settings/fees">Adjust Fees</Link>
            <Link style={{ color: '#fff' }} to="/tools/expiry">Time To Expiry</Link>
            <Link style={{ color: '#fff' }} to="/tools/compare">Compare Licenses</Link>
            <Link style={{ color: '#fff' }} to="/reports">Reports</Link>
            <Link style={{ color: '#fff' }} to="/map">Map</Link>
            <Link style={{ color: '#fff' }} to="/notifications">Notifications</Link>
            <Link style={{ color: '#fff' }} to="/login">Login</Link>
          </nav>
        </aside>
        <main style={{ flex: 1, padding: 24, background: '#f8fafc' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/companies" element={<ProtectedRoute roles={["ADMIN","OFFICER"]}><CompanyList /></ProtectedRoute>} />
            <Route path="/licenses" element={<ProtectedRoute roles={["ADMIN","OFFICER"]}><LicenseList /></ProtectedRoute>} />
            <Route path="/settings/fees" element={<ProtectedRoute roles={["ADMIN"]}><FeeAdjuster /></ProtectedRoute>} />
            <Route path="/tools/expiry" element={<ProtectedRoute roles={["ADMIN","OFFICER","VIEWER"]}><ExpiryCalculator /></ProtectedRoute>} />
            <Route path="/tools/compare" element={<ProtectedRoute roles={["ADMIN","OFFICER","VIEWER"]}><LicenseComparator /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute roles={["ADMIN","OFFICER"]}><ExportReports /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute roles={["ADMIN","OFFICER","VIEWER"]}><MapView /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute roles={["ADMIN"]}><ExpiryNotifier /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;