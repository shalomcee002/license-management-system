import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  
  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle role selection for a user
  const handleRoleChange = (roleName) => {
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles(selectedRoles.filter(role => role !== roleName));
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
  };

  // Start editing a user's roles
  const startEditing = (user) => {
    setEditingUser(user);
    setSelectedRoles(user.roles || []);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUser(null);
    setSelectedRoles([]);
  };

  // Save user role changes
  const saveUserRoles = async () => {
    if (!editingUser) return;
    
    try {
      await axios.put(`/api/users/${editingUser.id}/roles`, { roles: selectedRoles });
      fetchUsers(); // Refresh the user list
      cancelEditing();
    } catch (err) {
      setError('Failed to update user roles. Please try again.');
      console.error('Error updating user roles:', err);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`/api/users/${userId}`);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2>User Management</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Roles</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{user.name}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {editingUser && editingUser.id === user.id ? (
                  <div>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={selectedRoles.includes('ROLE_ADMIN')} 
                        onChange={() => handleRoleChange('ROLE_ADMIN')} 
                      /> Admin
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedRoles.includes('ROLE_OFFICER')} 
                        onChange={() => handleRoleChange('ROLE_OFFICER')} 
                      /> Officer
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedRoles.includes('ROLE_VIEWER')} 
                        onChange={() => handleRoleChange('ROLE_VIEWER')} 
                      /> Viewer
                    </label>
                  </div>
                ) : (
                  <span>{(user.roles || []).join(', ')}</span>
                )}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {editingUser && editingUser.id === user.id ? (
                  <div>
                    <button onClick={saveUserRoles} style={{ marginRight: '5px' }}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => startEditing(user)} style={{ marginRight: '5px' }}>Edit Roles</button>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;