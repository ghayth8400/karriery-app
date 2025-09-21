import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext.jsx';
import dataStorage from '../utils/dataStorage.js';

const UserPreferences = ({ user }) => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: true,
      showPhone: false
    },
    display: {
      compactMode: false,
      showAvatars: true,
      autoSave: true
    }
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  const handlePreferenceChange = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = dataStorage.updateUserPreferences(user.id, preferences);
      if (updatedUser) {
        dataStorage.setCurrentUser(updatedUser);
        setMessage('Preferences saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error saving preferences. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (user && user.preferences) {
      setPreferences(user.preferences);
    }
  };

  return (
    <div className="user-preferences">
      <div className="preferences-container">
        <motion.div 
          className="preferences-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="preferences-header">
            <h2>User Preferences & Settings</h2>
            <p>Customize your experience and manage your account settings</p>
          </div>

          {message && (
            <motion.div 
              className="message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                background: message.includes('Error') ? '#f8d7da' : '#d4edda',
                color: message.includes('Error') ? '#721c24' : '#155724',
                textAlign: 'center'
              }}
            >
              {message}
            </motion.div>
          )}

          <div className="preferences-sections">
            {/* Theme & Language */}
            <div className="preferences-section">
              <h3>Appearance & Language</h3>
              <div className="preferences-grid">
                <div className="preference-item">
                  <label>Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', 'theme', e.target.value)}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  >
                    <option value="light">Light Theme</option>
                    <option value="dark">Dark Theme</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label>Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', 'language', e.target.value)}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="preferences-section">
              <h3>Notifications</h3>
              <div className="preferences-grid">
                <div className="preference-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.email}
                      onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                    />
                    Email Notifications
                  </label>
                  <small>Receive updates and important information via email</small>
                </div>

                <div className="preference-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.push}
                      onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                    />
                    Push Notifications
                  </label>
                  <small>Get real-time notifications in your browser</small>
                </div>

                <div className="preference-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.sms}
                      onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                    />
                    SMS Notifications
                  </label>
                  <small>Receive text messages for urgent updates</small>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="preferences-section">
              <h3>Privacy & Visibility</h3>
              <div className="preferences-grid">
                <div className="preference-item">
                  <label>Profile Visibility</label>
                  <select
                    value={preferences.privacy.profileVisibility}
                    onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="registered">Registered Users Only</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.showEmail}
                      onChange={(e) => handlePreferenceChange('privacy', 'showEmail', e.target.checked)}
                    />
                    Show Email Address
                  </label>
                  <small>Display your email on your public profile</small>
                </div>

                <div className="preference-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.showPhone}
                      onChange={(e) => handlePreferenceChange('privacy', 'showPhone', e.target.checked)}
                    />
                    Show Phone Number
                  </label>
                  <small>Display your phone number on your public profile</small>
                </div>
              </div>
            </div>

            {/* Display Options */}
            <div className="preferences-section">
              <h3>Display Options</h3>
              <div className="preferences-grid">
                <div className="preference-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={preferences.display.compactMode}
                      onChange={(e) => handlePreferenceChange('display', 'compactMode', e.target.checked)}
                    />
                    Compact Mode
                  </label>
                  <small>Use a more condensed layout for better space utilization</small>
                </div>

                <div className="preference-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={preferences.display.showAvatars}
                      onChange={(e) => handlePreferenceChange('display', 'showAvatars', e.target.checked)}
                    />
                    Show Avatars
                  </label>
                  <small>Display user profile pictures throughout the interface</small>
                </div>

                <div className="preference-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={preferences.display.autoSave}
                      onChange={(e) => handlePreferenceChange('display', 'autoSave', e.target.checked)}
                    />
                    Auto-Save
                  </label>
                  <small>Automatically save changes as you type</small>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="preferences-section">
              <h3>Account Actions</h3>
              <div className="preferences-grid">
                <div className="preference-item">
                  <button
                    onClick={() => {
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
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      background: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    <i className="fas fa-download"></i> Export My Data
                  </button>
                  <small>Download all your data in JSON format</small>
                </div>

                <div className="preference-item">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        // Handle account deletion
                        console.log('Account deletion requested');
                      }
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    <i className="fas fa-trash"></i> Delete Account
                  </button>
                  <small>Permanently delete your account and all data</small>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '2rem',
            justifyContent: 'center'
          }}>
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #ddd',
                background: 'white',
                color: '#666',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              <i className="fas fa-undo"></i> Reset to Default
            </motion.button>
            
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: '#8B1538',
                color: 'white',
                borderRadius: '8px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                opacity: saving ? 0.7 : 1
              }}
            >
              <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
              {saving ? 'Saving...' : 'Save Preferences'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserPreferences;
