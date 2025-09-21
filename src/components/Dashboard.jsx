import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext.jsx';
import dataStorage from '../utils/dataStorage.js';

const Dashboard = ({ user }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    
    // Load statistics
    const statistics = dataStorage.getStatistics();
    setStats(statistics);

    // Load user notifications
    const userNotifications = user.notifications || [];
    setNotifications(userNotifications.slice(0, 5)); // Show last 5

    // Generate recent activity
    const activity = generateRecentActivity();
    setRecentActivity(activity);

    // Set quick actions based on user role
    const actions = user.role === 'admin' ? getAdminQuickActions() : getUserQuickActions();
    setQuickActions(actions);

    setLoading(false);
  };

  const generateRecentActivity = () => {
    const activities = [];
    
    // Add login activity
    activities.push({
      id: 'login',
      type: 'login',
      title: 'Last Login',
      description: `Welcome back, ${user.name}!`,
      time: new Date(user.lastLogin).toLocaleString(),
      icon: 'fas fa-sign-in-alt',
      color: '#28a745'
    });

    // Add profile updates if any
    if (user.profile?.updatedAt) {
      activities.push({
        id: 'profile_update',
        type: 'profile',
        title: 'Profile Updated',
        description: 'Your profile information was updated',
        time: new Date(user.profile.updatedAt).toLocaleString(),
        icon: 'fas fa-user-edit',
        color: '#17a2b8'
      });
    }

    // Add recent tickets if any
    const userTickets = dataStorage.getAllTickets().filter(t => t.userId === user.id);
    const recentTickets = userTickets.slice(0, 3);
    recentTickets.forEach(ticket => {
      activities.push({
        id: ticket.id,
        type: 'ticket',
        title: `Support Ticket: ${ticket.subject}`,
        description: `Status: ${ticket.status}`,
        time: new Date(ticket.createdAt).toLocaleString(),
        icon: 'fas fa-ticket-alt',
        color: '#ffc107'
      });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  };

  const getAdminQuickActions = () => [
    {
      id: 'manage_users',
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: 'fas fa-users',
      color: '#8B1538',
      action: () => window.location.href = '#admin'
    },
    {
      id: 'support_tickets',
      title: 'Support Tickets',
      description: 'Handle support requests',
      icon: 'fas fa-headset',
      color: '#17a2b8',
      action: () => window.location.href = '#support'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View detailed statistics',
      icon: 'fas fa-chart-bar',
      color: '#28a745',
      action: () => window.location.href = '#analytics'
    },
    {
      id: 'export_data',
      title: 'Export Data',
      description: 'Export system data',
      icon: 'fas fa-download',
      color: '#fd7e14',
      action: () => exportSystemData()
    }
  ];

  const getUserQuickActions = () => [
    {
      id: 'edit_profile',
      title: 'Edit Profile',
      description: 'Update your profile information',
      icon: 'fas fa-user-edit',
      color: '#8B1538',
      action: () => window.location.href = '#profile'
    },
    {
      id: 'support_chat',
      title: 'Get Support',
      description: 'Contact support team',
      icon: 'fas fa-headset',
      color: '#17a2b8',
      action: () => window.location.href = '#support'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Manage your settings',
      icon: 'fas fa-cog',
      color: '#28a745',
      action: () => window.location.href = '#preferences'
    },
    {
      id: 'export_profile',
      title: 'Export Profile',
      description: 'Download your data',
      icon: 'fas fa-download',
      color: '#fd7e14',
      action: () => exportUserData()
    }
  ];

  const exportSystemData = () => {
    const data = dataStorage.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karriery-system-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportUserData = () => {
    const data = dataStorage.exportUserData(user.id);
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${user.name}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    dataStorage.markNotificationAsRead(user.id, notificationId);
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '50px', height: '50px', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#666' }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem 0'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `url(${user.profileImage || 'https://via.placeholder.com/80'}) center/cover`,
              border: '4px solid #8B1538'
            }} />
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                color: '#8B1538', 
                margin: '0 0 0.5rem 0',
                fontSize: '2.5rem',
                fontWeight: '700'
              }}>
                {getGreeting()}, {user.name}! 👋
              </h1>
              <p style={{ 
                color: '#666', 
                margin: '0 0 0.5rem 0',
                fontSize: '1.1rem'
              }}>
                {user.profile?.title || 'Professional'} at {user.profile?.company || 'Your Company'}
              </p>
              <p style={{ 
                color: '#888', 
                margin: 0,
                fontSize: '0.9rem'
              }}>
                Last login: {new Date(user.lastLogin).toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                padding: '0.5rem 1rem',
                background: user.role === 'admin' ? '#8B1538' : '#17a2b8',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {user.role === 'admin' ? 'Administrator' : 'User'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          {user.role === 'admin' ? (
            <>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #8B1538'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #8B1538, #a52a2a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}>
                    <i className="fas fa-users"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '2rem', fontWeight: '700' }}>
                      {stats.totalUsers || 0}
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Total Users</p>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #17a2b8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #17a2b8, #20c997)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}>
                    <i className="fas fa-headset"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '2rem', fontWeight: '700' }}>
                      {stats.totalTickets || 0}
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Support Tickets</p>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #28a745'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}>
                    <i className="fas fa-user-check"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '2rem', fontWeight: '700' }}>
                      {stats.activeUsers || 0}
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Active Users</p>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #ffc107'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}>
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '2rem', fontWeight: '700' }}>
                      {stats.openTickets || 0}
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Open Tickets</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #8B1538'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #8B1538, #a52a2a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}>
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '2rem', fontWeight: '700' }}>
                      {user.profile?.experience || '0-2 years'}
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Experience</p>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #17a2b8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #17a2b8, #20c997)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}>
                    <i className="fas fa-code"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '2rem', fontWeight: '700' }}>
                      {user.profile?.skills?.length || 0}
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Skills</p>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #28a745'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}>
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '2rem', fontWeight: '700' }}>
                      {user.profile?.education?.length || 0}
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Education</p>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #ffc107'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}>
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '2rem', fontWeight: '700' }}>
                      {user.profile?.experience_details?.length || 0}
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Work Experience</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h2 style={{ 
                color: '#8B1538', 
                margin: '0 0 1.5rem 0',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                Quick Actions
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    onClick={action.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: 'white',
                      border: '2px solid #f0f0f0',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = action.color;
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#f0f0f0';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: action.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem',
                      marginBottom: '1rem'
                    }}>
                      <i className={action.icon}></i>
                    </div>
                    <h3 style={{ 
                      margin: '0 0 0.5rem 0', 
                      color: '#333',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}>
                      {action.title}
                    </h3>
                    <p style={{ 
                      margin: 0, 
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      {action.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h2 style={{ 
                color: '#8B1538', 
                margin: '0 0 1.5rem 0',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                Recent Activity
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${activity.color}`
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: activity.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1rem'
                    }}>
                      <i className={activity.icon}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 0.25rem 0', 
                        color: '#333',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {activity.title}
                      </h4>
                      <p style={{ 
                        margin: '0 0 0.25rem 0', 
                        color: '#666',
                        fontSize: '0.9rem'
                      }}>
                        {activity.description}
                      </p>
                      <p style={{ 
                        margin: 0, 
                        color: '#888',
                        fontSize: '0.8rem'
                      }}>
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h2 style={{ 
                color: '#8B1538', 
                margin: '0 0 1.5rem 0',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                Notifications
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                    <i className="fas fa-bell" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      style={{
                        padding: '1rem',
                        background: notification.read ? '#f8f9fa' : '#e3f2fd',
                        borderRadius: '8px',
                        border: notification.read ? '1px solid #e9ecef' : '1px solid #bbdefb',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => markNotificationAsRead(notification.id)}
                      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ 
                          margin: 0, 
                          color: '#333',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#8B1538'
                          }}></div>
                        )}
                      </div>
                      <p style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: '#666',
                        fontSize: '0.9rem'
                      }}>
                        {notification.message}
                      </p>
                      <p style={{ 
                        margin: 0, 
                        color: '#888',
                        fontSize: '0.8rem'
                      }}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h2 style={{ 
                color: '#8B1538', 
                margin: '0 0 1.5rem 0',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                Profile Summary
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#8B1538' }}></i>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    {user.profile?.location || 'Location not set'}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <i className="fas fa-building" style={{ color: '#8B1538' }}></i>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    {user.profile?.company || 'Company not set'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <i className="fas fa-clock" style={{ color: '#8B1538' }}></i>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    {user.profile?.experience || 'Experience not set'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <i className="fas fa-calendar-alt" style={{ color: '#8B1538' }}></i>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;