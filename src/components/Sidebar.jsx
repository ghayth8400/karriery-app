import React from "react";
import { FaUser, FaTachometerAlt, FaCog, FaCrown, FaSignOutAlt, FaUserCog } from 'react-icons/fa';
import { useTranslation } from '../contexts/LanguageContext.jsx';

const Sidebar = ({ user, activeSection, setActiveSection, onLogout }) => {
  const { t } = useTranslation();
  
  const menuItems = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: <FaTachometerAlt />,
      path: 'dashboard'
    },
    {
      id: 'profile',
      label: t('profile'),
      icon: <FaUser />,
      path: 'profile'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: <FaUserCog />,
      path: 'preferences'
    }
  ];

  // Add admin panel for admin users
  if (user?.role === 'admin') {
    menuItems.push({
      id: 'admin',
      label: 'Admin Panel',
      icon: <FaCrown />,
      path: 'admin'
    });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            {user?.profileImage || user?.profile_image ? (
              <img
                src={user.profileImage || user.profile_image}
                alt={user.name}
              />
            ) : (
              <div className="avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="user-details">
            <h3>{user?.name || user?.username}</h3>
            {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
              {user?.profile?.title || 'Professional'}
            </p>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.path ? 'active' : ''}`}
            onClick={() => setActiveSection(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <span className="nav-icon"><FaSignOutAlt /></span>
          <span className="nav-label">{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;