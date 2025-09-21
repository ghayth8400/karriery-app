import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext.jsx';

const GoogleSignupComplete = ({ googleUser, onComplete, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    title: '',
    company: '',
    location: '',
    experience: '0-2 years',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const experienceOptions = [
    '0-2 years',
    '3-5 years',
    '6-10 years',
    '10+ years'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create complete user data
      const completeUserData = {
        name: googleUser.name,
        email: googleUser.email,
        password: formData.password,
        isGoogleUser: true,
        googleId: googleUser.id,
        profileImage: googleUser.picture,
        title: formData.title,
        company: formData.company,
        location: formData.location,
        experience: formData.experience,
        phone: formData.phone,
        website: formData.website,
        linkedin: formData.linkedin,
        github: formData.github,
        twitter: formData.twitter
      };

      onComplete(completeUserData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="google-signup-complete"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
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
    >
      <motion.div 
        className="google-signup-modal"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            background: `url(${googleUser.picture}) center/cover`,
            border: '3px solid #8B1538'
          }} />
          <h2 style={{ color: '#8B1538', marginBottom: '0.5rem' }}>
            Complete Your Profile
          </h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Welcome, {googleUser.name}! Please provide some additional information to complete your account setup.
          </p>
        </div>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {/* Password Fields */}
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-lock"></i>
                Create Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Create a password for your account"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-lock"></i>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Professional Information */}
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-briefcase"></i>
                Professional Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Developer, Marketing Manager"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-building"></i>
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Your current company"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-map-marker-alt"></i>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-clock"></i>
                Years of Experience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'white'
                }}
              >
                {experienceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Contact Information */}
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-phone"></i>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Your phone number"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-globe"></i>
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://your-website.com"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Social Media */}
            <div className="form-group">
              <label className="form-label">
                <i className="fab fa-linkedin"></i>
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/your-profile"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fab fa-github"></i>
                GitHub
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="https://github.com/your-username"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fab fa-twitter"></i>
                Twitter
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/your-handle"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '2rem',
            justifyContent: 'center'
          }}>
            <motion.button
              type="button"
              onClick={onCancel}
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
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: '#8B1538',
                color: 'white',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                  Creating Account...
                </div>
              ) : (
                'Complete Setup'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GoogleSignupComplete;
