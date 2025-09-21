import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from '../contexts/LanguageContext.jsx';
import dataStorage from '../utils/dataStorage.js';
import GoogleSignupComplete from './GoogleSignupComplete.jsx';

const Auth = ({ onLogin, onClose, isPage = false, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleSignup, setShowGoogleSignup] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (activeTab === 'login') {
        // Real login logic using user storage
              const user = dataStorage.authenticateUser(formData.email, formData.password);
      dataStorage.setCurrentUser(user);
        onLogin(user);
      } else {
        // Real signup logic
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        
        const newUser = dataStorage.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        dataStorage.setCurrentUser(newUser);
        onLogin(newUser);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');
        
        // Get user info from Google
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user information from Google');
        }
        
        const googleUser = await response.json();
        
        // Check if user already exists
        const existingUser = dataStorage.getAllUsers().find(u => 
          u.googleId === googleUser.id || u.email === googleUser.email
        );
        
        if (existingUser) {
          // User exists, log them in
          existingUser.lastLogin = new Date().toISOString();
          dataStorage.updateUser(existingUser);
          dataStorage.setCurrentUser(existingUser);
          onLogin(existingUser);
        } else {
          // New Google user, show completion form
          setGoogleUserData(googleUser);
          setShowGoogleSignup(true);
        }
      } catch (error) {
        console.error('Google login error:', error);
        setError('Google login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    }
  });

  const handleGoogleSignupComplete = (completeUserData) => {
    try {
      const newUser = dataStorage.createUser(completeUserData);
      dataStorage.setCurrentUser(newUser);
      setShowGoogleSignup(false);
      setGoogleUserData(null);
      onLogin(newUser);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignupCancel = () => {
    setShowGoogleSignup(false);
    setGoogleUserData(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  if (showGoogleSignup && googleUserData) {
    return (
      <GoogleSignupComplete
        googleUser={googleUserData}
        onComplete={handleGoogleSignupComplete}
        onCancel={handleGoogleSignupCancel}
      />
    );
  }

  if (isPage) {
    return (
      <div className="auth-page">
        <div className="auth-page-container">
          <div className="auth-page-header">
            <button 
              className="auth-back-btn" 
              onClick={onClose}
              aria-label="Go back to home"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back to Home</span>
            </button>
          </div>

          <div className="auth-page-content">
            <div className="auth-page-card">
              <div className="auth-header">
                <h1 className="auth-title">
                  {activeTab === 'login' ? t('welcomeBack') : t('createAccount')}
                </h1>
                <p className="auth-subtitle">
                  {activeTab === 'login' 
                    ? 'Sign in to your account to continue' 
                    : 'Create a new account to get started'
                  }
                </p>
              </div>

              <div className="auth-tabs">
                <button 
                  className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => handleTabChange('login')}
                  aria-pressed={activeTab === 'login'}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span>{t('login')}</span>
                </button>
                <button 
                  className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => handleTabChange('signup')}
                  aria-pressed={activeTab === 'signup'}
                >
                  <i className="fas fa-user-plus"></i>
                  <span>{t('signUp')}</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="auth-form"
                >
                  {error && (
                    <motion.div 
                      className="error-message"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <button 
                    className="google-btn" 
                    onClick={() => googleLogin()}
                    type="button"
                    disabled={loading}
                    aria-label="Continue with Google"
                  >
                    {loading ? (
                      <div className="spinner"></div>
                    ) : (
                      <>
                        <i className="fab fa-google"></i>
                        <span>{t('continueWithGoogle')}</span>
                      </>
                    )}
                  </button>

                  <div className="divider">
                    <span>{t('or')}</span>
                  </div>

                  <form onSubmit={handleSubmit} className="auth-form-fields">
                    {activeTab === 'signup' && (
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          <i className="fas fa-user"></i>
                          {t('fullName')}
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                          className="form-input"
                          autoComplete="name"
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        <i className="fas fa-envelope"></i>
                        {t('emailUsername')}
                      </label>
                      <input
                        id="email"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder={activeTab === 'login' ? "Enter your email" : "Enter your email"}
                        className="form-input"
                        autoComplete={activeTab === 'login' ? 'username' : 'email'}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        <i className="fas fa-lock"></i>
                        {t('password')}
                      </label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder={activeTab === 'login' ? "Enter your password" : "Create a password"}
                        className="form-input"
                        autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                      />
                    </div>

                    {activeTab === 'signup' && (
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                          <i className="fas fa-lock"></i>
                          {t('confirmPassword')}
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          placeholder="Confirm your password"
                          className="form-input"
                          autoComplete="new-password"
                        />
                      </div>
                    )}

                    <motion.button 
                      type="submit" 
                      className="auth-submit-btn"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label={activeTab === 'login' ? 'Sign in' : 'Create account'}
                    >
                      {loading ? (
                        <div className="spinner"></div>
                      ) : (
                        <>
                          <i className={`fas ${activeTab === 'login' ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                          <span>{activeTab === 'login' ? t('signIn') : t('createAccount')}</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original modal version (kept for backward compatibility)
  return (
    <motion.div 
      className="auth-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="auth-modal"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="auth-close" 
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="auth-header">
          <h1 className="auth-title">
            {activeTab === 'login' ? t('welcomeBack') : t('createAccount')}
          </h1>
          <p className="auth-subtitle">
            {activeTab === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Create a new account to get started'
            }
          </p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
            aria-pressed={activeTab === 'login'}
          >
            <i className="fas fa-sign-in-alt"></i>
            <span>{t('login')}</span>
          </button>
          <button 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabChange('signup')}
            aria-pressed={activeTab === 'signup'}
          >
            <i className="fas fa-user-plus"></i>
            <span>{t('signUp')}</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="auth-form"
          >
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <i className="fas fa-exclamation-triangle"></i>
                <span>{error}</span>
              </motion.div>
            )}

            <button 
              className="google-btn" 
              onClick={() => googleLogin()}
              type="button"
              disabled={loading}
              aria-label="Continue with Google"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <i className="fab fa-google"></i>
                  <span>{t('continueWithGoogle')}</span>
                </>
              )}
            </button>

            <div className="divider">
              <span>{t('or')}</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-fields">
              {activeTab === 'signup' && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <i className="fas fa-user"></i>
                    {t('fullName')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="form-input"
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <i className="fas fa-envelope"></i>
                  {t('emailUsername')}
                </label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={activeTab === 'login' ? "Try: user or admin" : "Enter your email"}
                  className="form-input"
                  autoComplete={activeTab === 'login' ? 'username' : 'email'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <i className="fas fa-lock"></i>
                  {t('password')}
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder={activeTab === 'login' ? "Try: user or admin" : "Create a password"}
                  className="form-input"
                  autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                />
              </div>

              {activeTab === 'signup' && (
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    <i className="fas fa-lock"></i>
                    {t('confirmPassword')}
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    placeholder="Confirm your password"
                    className="form-input"
                    autoComplete="new-password"
                  />
                </div>
              )}

              <motion.button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={activeTab === 'login' ? 'Sign in' : 'Create account'}
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <i className={`fas ${activeTab === 'login' ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                    <span>{activeTab === 'login' ? t('signIn') : t('createAccount')}</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Auth;