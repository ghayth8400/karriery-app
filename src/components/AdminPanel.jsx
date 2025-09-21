import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dataStorage from '../utils/dataStorage.js';

const AdminPanel = ({ user }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const [courses] = useState([
    { id: 1, title: 'Advanced React Development', enrolled: 89, completed: 67, rating: 4.8 },
    { id: 2, title: 'Career Transition Mastery', enrolled: 156, completed: 134, rating: 4.9 },
    { id: 3, title: 'Interview Skills Bootcamp', enrolled: 203, completed: 178, rating: 4.7 },
    { id: 4, title: 'Leadership Development', enrolled: 78, completed: 45, rating: 4.6 }
  ]);

  // Load users and analytics on component mount
  useEffect(() => {
    loadUsers();
    loadAnalytics();
  }, []);

  const loadUsers = () => {
    const allUsers = dataStorage.getAllUsersForAdmin();
    setUsers(allUsers);
  };

  const loadAnalytics = () => {
    const stats = dataStorage.getStatistics();
    setAnalytics(stats);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filteredUsers = dataStorage.searchUsers(query);
      setUsers(filteredUsers);
    } else {
      loadUsers();
    }
  };

  const handleUserAction = (userId, action, value) => {
    switch (action) {
      case 'role':
        dataStorage.changeUserRole(userId, value);
        break;
      case 'status':
        dataStorage.changeUserStatus(userId, value);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this user?')) {
          dataStorage.deleteUser(userId);
        }
        break;
      default:
        break;
    }
    loadUsers();
    loadAnalytics();
  };

  const handleAddAdmin = () => {
    try {
              dataStorage.createUser(newAdminData);
      setNewAdminData({ name: '', email: '', password: '', role: 'admin' });
      setShowAddAdminModal(false);
      loadUsers();
      loadAnalytics();
    } catch (error) {
      alert('Error creating admin: ' + error.message);
    }
  };

  const filteredUsers = searchQuery.trim() 
            ? dataStorage.searchUsers(searchQuery)
    : users;

  if (user?.role !== 'admin') {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '4rem 0' }}
          >
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e5e5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>User Management</h3>
                  <motion.button
                    onClick={() => setShowAddAdminModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#8B1538',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    <i className="fas fa-plus"></i> Add Admin
                  </motion.button>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <i className="fas fa-search" style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#666'
                      }}></i>
                      <input
                        type="text"
                        placeholder="Search users by name, email, or company..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {filteredUsers.length} users found
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Joined</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {user.isGoogleUser && (
                              <i className="fab fa-google" style={{ color: '#4285f4' }}></i>
                            )}
                            {user.name}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>{user.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <select
                            value={user.role}
                            onChange={(e) => handleUserAction(user.id, 'role', e.target.value)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              background: user.role === 'admin' ? '#8B1538' : 'white',
                              color: user.role === 'admin' ? 'white' : '#666'
                            }}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <select
                            value={user.status}
                            onChange={(e) => handleUserAction(user.id, 'status', e.target.value)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              background: user.status === 'active' ? '#d4edda' : '#f8d7da',
                              color: user.status === 'active' ? '#155724' : '#721c24'
                            }}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#8B1538',
                                cursor: 'pointer',
                                padding: '0.25rem'
                              }}
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'delete')}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#dc3545',
                                cursor: 'pointer',
                                padding: '0.25rem'
                              }}
                              title="Delete User"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case 'analytics':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3>Total Users</h3>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8B1538' }}>
                  {analytics.totalUsers || 0}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  All registered users
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-user-check"></i>
                  </div>
                  <h3>Active Users</h3>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8B1538' }}>
                  {analytics.activeUsers || 0}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  Currently active accounts
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fab fa-google"></i>
                  </div>
                  <h3>Google Users</h3>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8B1538' }}>
                  {analytics.googleUsers || 0}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  Signed up with Google
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3>Administrators</h3>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8B1538' }}>
                  {analytics.adminUsers || 0}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  Platform administrators
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'courses':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ marginBottom: '2rem' }}>Course Management</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {courses.map((course) => (
                  <div key={course.id} style={{
                    padding: '1.5rem',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto',
                    gap: '1rem',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ marginBottom: '0.25rem' }}>{course.title}</h4>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {course.enrolled} enrolled • {course.completed} completed
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#8B1538' }}>
                        {course.rating}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>Rating</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#8B1538' }}>
                        {Math.round((course.completed / course.enrolled) * 100)}%
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>Completion</div>
                    </div>
                    <button style={{
                      background: '#8B1538',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Admin Panel</h1>
          <p>Manage users, courses, and platform analytics</p>
        </motion.div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            background: 'white',
            padding: '0.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
          }}>
            {[
              { key: 'users', label: 'Users', icon: 'fas fa-users' },
              { key: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' },
              { key: 'courses', label: 'Courses', icon: 'fas fa-graduation-cap' }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                className={`auth-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: activeTab === tab.key ? '#8B1538' : 'transparent',
                  color: activeTab === tab.key ? 'white' : '#666',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {renderTabContent()}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowUserModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <strong>Name:</strong> {selectedUser.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div>
                <strong>Role:</strong> {selectedUser.role}
              </div>
              <div>
                <strong>Status:</strong> {selectedUser.status}
              </div>
              <div>
                <strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Last Login:</strong> {new Date(selectedUser.lastLogin).toLocaleString()}
              </div>
              {selectedUser.isGoogleUser && (
                <div>
                  <strong>Sign-up Method:</strong> Google
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowAddAdminModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Add New Administrator</h2>
              <button
                onClick={() => setShowAddAdminModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAddAdmin(); }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newAdminData.name}
                    onChange={(e) => setNewAdminData({...newAdminData, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={newAdminData.email}
                    onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={newAdminData.password}
                    onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <motion.button
                    type="button"
                    onClick={() => setShowAddAdminModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      background: 'white',
                      color: '#666',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: 'none',
                      background: '#8B1538',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Create Admin
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanel;