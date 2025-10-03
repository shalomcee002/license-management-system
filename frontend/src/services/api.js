import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Companies
export const fetchCompanies = () => api.get('/companies').then(r => r.data);
export const fetchCompaniesCount = () => api.get('/companies/count').then(r => r.data);
export const createCompany = (payload) => api.post('/companies', payload).then(r => r.data);
export const updateCompany = (id, payload) => api.put(`/companies/${id}`, payload).then(r => r.data);
export const deleteCompany = (id) => api.delete(`/companies/${id}`).then(r => r.data);

// Licenses
export const fetchLicenses = () => api.get('/licenses').then(r => r.data);
export const fetchLicensesCount = () => api.get('/licenses/count').then(r => r.data);
export const fetchLicensesTypeCount = () => api.get('/licenses/types/count').then(r => r.data);

// User
export const changePassword = (currentPassword, newPassword) => api.post('/users/change-password', { currentPassword, newPassword }).then(r => r.data);
export const fetchExpiringSoonCount = (days=90) => api.get(`/licenses/expiring-soon/count?days=${days}`).then(r => r.data);
export const createLicense = (payload) => api.post('/licenses', payload).then(r => r.data);
export const updateLicense = (id, payload) => api.put(`/licenses/${id}`, payload).then(r => r.data);
export const deleteLicense = (id) => api.delete(`/licenses/${id}`).then(r => r.data);
export const yearsToExpiry = (id) => api.get(`/licenses/${id}/years-to-expiry`).then(r => r.data);
export const compareLicenses = (a, b) => api.post('/licenses/compare', { a, b }).then(r => r.data);

// Fees
export const adjustFees = (licenseType, percent) => api.post('/fees/adjust', { licenseType, percent }).then(r => r.data);

// Reports
export const downloadLicensesReport = (format='csv') => api.get(`/reports/licenses?format=${format}`, { responseType: 'blob' }).then(r => r.data);
export const downloadCompaniesExcel = () => api.get('/reports/companies/excel', { responseType: 'blob' }).then(r => r.data);

// Notifications
export const sendExpiryNotifications = (days=90) => api.post('/notifications/expiring', { days }).then(r => r.data);

// Auth
export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  const role = (data.roles && data.roles[0]) || 'VIEWER';
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_role', role);
  return { token: data.token, role, roles: data.roles };
};

export const signup = async (name, email, password, role = 'VIEWER') => {
  const { data } = await api.post('/auth/signup', { name, email, password, role });
  const userRole = (data.roles && data.roles[0]) || role;
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_role', userRole);
  return { token: data.token, role: userRole };
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_role');
};

export default api;