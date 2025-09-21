import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext.jsx';
import dataStorage from '../utils/dataStorage.js';

const Profile = ({ user }) => {
  const { t } = useTranslation();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: '',
    company: '',
    location: '',
    experience: '',
    bio: '',
    skills: [],
    education: [],
    experience_details: [],
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: ''
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({ degree: '', school: '', year: '' });
  const [newExperience, setNewExperience] = useState({ title: '', company: '', period: '', description: '' });
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);

  // Load user profile data on component mount
  useEffect(() => {
    if (user && user.profile) {
      setProfileData({
        name: user.name,
        email: user.email,
        ...user.profile
      });
    }
  }, [user]);

  const handleEdit = () => {
    setEditing(!editing);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = dataStorage.updateUserProfile(user.id, profileData);
      if (updatedUser) {
        dataStorage.setCurrentUser(updatedUser);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (user && user.profile) {
      setProfileData({
        name: user.name,
        email: user.email,
        ...user.profile
      });
    }
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.school) {
      setProfileData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation }]
      }));
      setNewEducation({ degree: '', school: '', year: '' });
      setShowAddEducation(false);
    }
  };

  const removeEducation = (index) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      setProfileData(prev => ({
        ...prev,
        experience_details: [...prev.experience_details, { ...newExperience }]
      }));
      setNewExperience({ title: '', company: '', period: '', description: '' });
      setShowAddExperience(false);
    }
  };

  const removeExperience = (index) => {
    setProfileData(prev => ({
      ...prev,
      experience_details: prev.experience_details.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <motion.div 
          className="profile-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-header">
            <div className="profile-avatar">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <h2>{profileData.name}</h2>
            <p>{profileData.title} at {profileData.company}</p>
            <p><i className="fas fa-map-marker-alt"></i> {profileData.location}</p>
          </div>

          <div className="profile-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>{t('profileInformation')}</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {editing ? (
                <>
                  <motion.button 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    <i className="fas fa-times"></i>
                    Cancel
                  </motion.button>
                  <motion.button 
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                    {saving ? 'Saving...' : t('save')}
                  </motion.button>
                </>
              ) : (
                <motion.button 
                  className="btn btn-primary"
                  onClick={handleEdit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <i className="fas fa-edit"></i>
                  {t('edit')}
                </motion.button>
              )}
            </div>
          </div>

            <div className="profile-section">
              <h3>{t('aboutMe')}</h3>
              {editing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    resize: 'vertical'
                  }}
                  placeholder="Tell us about yourself, your professional background, and career goals..."
                />
              ) : (
                <p>{profileData.bio || 'No bio added yet.'}</p>
              )}
            </div>

            <div className="profile-section">
              <h3>Basic Information</h3>
              <div className="profile-info">
                <div className="info-item">
                  <div className="info-label">Name</div>
                  <div className="info-value">
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      profileData.name
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Email</div>
                  <div className="info-value">{profileData.email}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Professional Title</div>
                  <div className="info-value">
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Senior Developer, Marketing Manager"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      profileData.title || 'Not specified'
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Company</div>
                  <div className="info-value">
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Your current company"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      profileData.company || 'Not specified'
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">{t('location')}</div>
                  <div className="info-value">
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, Country"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      profileData.location || 'Not specified'
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">{t('experience')}</div>
                  <div className="info-value">
                    {editing ? (
                      <select
                        value={profileData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      >
                        <option value="">Select experience</option>
                        <option value="0-2 years">0-2 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="6-10 years">6-10 years</option>
                        <option value="10+ years">10+ years</option>
                      </select>
                    ) : (
                      profileData.experience || 'Not specified'
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Contact Information</h3>
              <div className="profile-info">
                <div className="info-item">
                  <div className="info-label">Phone</div>
                  <div className="info-value">
                    {editing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Your phone number"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      profileData.phone || 'Not provided'
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Website</div>
                  <div className="info-value">
                    {editing ? (
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://your-website.com"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      profileData.website ? (
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                          {profileData.website}
                        </a>
                      ) : (
                        'Not provided'
                      )
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">LinkedIn</div>
                  <div className="info-value">
                    {editing ? (
                      <input
                        type="url"
                        value={profileData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/your-profile"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      profileData.linkedin ? (
                        <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-linkedin"></i> LinkedIn Profile
                        </a>
                      ) : (
                        'Not provided'
                      )
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">GitHub</div>
                  <div className="info-value">
                    {editing ? (
                      <input
                        type="url"
                        value={profileData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        placeholder="https://github.com/your-username"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      profileData.github ? (
                        <a href={profileData.github} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-github"></i> GitHub Profile
                        </a>
                      ) : (
                        'Not provided'
                      )
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Twitter</div>
                  <div className="info-value">
                    {editing ? (
                      <input
                        type="url"
                        value={profileData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/your-handle"
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      profileData.twitter ? (
                        <a href={profileData.twitter} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-twitter"></i> Twitter Profile
                        </a>
                      ) : (
                        'Not provided'
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>{t('contactInformation')}</h3>
              <div className="profile-info">
                <div className="info-item">
                  <div className="info-label">Email</div>
                  <div className="info-value">{profileData.email}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">{t('experience')}</div>
                  <div className="info-value">{profileData.experience}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">{t('location')}</div>
                  <div className="info-value">{profileData.location}</div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>{t('skills')}</h3>
              {editing && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <motion.button
                      onClick={addSkill}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#8B1538',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </motion.button>
                  </div>
                </div>
              )}
              <div className="skills-tags">
                {profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => (
                    <motion.span 
                      key={index}
                      className="skill-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {skill}
                      {editing && (
                        <button
                          onClick={() => removeSkill(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </motion.span>
                  ))
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No skills added yet.</p>
                )}
              </div>
            </div>

            <div className="profile-section">
              <h3>{t('experience')}</h3>
              {editing && (
                <div style={{ marginBottom: '1rem' }}>
                  <motion.button
                    onClick={() => setShowAddExperience(!showAddExperience)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#8B1538',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginBottom: '1rem'
                    }}
                  >
                    <i className="fas fa-plus"></i> Add Experience
                  </motion.button>
                  
                  {showAddExperience && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        padding: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        background: '#f8f9fa',
                        marginBottom: '1rem'
                      }}
                    >
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={newExperience.title}
                          onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                          type="text"
                          placeholder="Company"
                          value={newExperience.company}
                          onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                          type="text"
                          placeholder="Period (e.g., 2020 - 2022)"
                          value={newExperience.period}
                          onChange={(e) => setNewExperience({...newExperience, period: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <textarea
                          placeholder="Description"
                          value={newExperience.description}
                          onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <motion.button
                            onClick={addExperience}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Add
                          </motion.button>
                          <motion.button
                            onClick={() => setShowAddExperience(false)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
              
              {profileData.experience_details.length > 0 ? (
                profileData.experience_details.map((exp, index) => (
                  <motion.div 
                    key={index}
                    className="info-item"
                    style={{ marginBottom: '1rem' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <div>
                        <div className="info-value" style={{ fontWeight: '600' }}>{exp.title}</div>
                        <div style={{ color: '#8B1538', fontWeight: '500' }}>{exp.company}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{exp.period}</div>
                        {editing && (
                          <button
                            onClick={() => removeExperience(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc3545',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                    <p style={{ color: '#666' }}>{exp.description}</p>
                  </motion.div>
                ))
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No experience added yet.</p>
              )}
            </div>

            <div className="profile-section">
              <h3>{t('education')}</h3>
              {editing && (
                <div style={{ marginBottom: '1rem' }}>
                  <motion.button
                    onClick={() => setShowAddEducation(!showAddEducation)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#8B1538',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginBottom: '1rem'
                    }}
                  >
                    <i className="fas fa-plus"></i> Add Education
                  </motion.button>
                  
                  {showAddEducation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        padding: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        background: '#f8f9fa',
                        marginBottom: '1rem'
                      }}
                    >
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Degree"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                          type="text"
                          placeholder="School/University"
                          value={newEducation.school}
                          onChange={(e) => setNewEducation({...newEducation, school: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                          type="text"
                          placeholder="Year"
                          value={newEducation.year}
                          onChange={(e) => setNewEducation({...newEducation, year: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <motion.button
                            onClick={addEducation}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Add
                          </motion.button>
                          <motion.button
                            onClick={() => setShowAddEducation(false)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
              
              {profileData.education.length > 0 ? (
                profileData.education.map((edu, index) => (
                  <motion.div 
                    key={index}
                    className="info-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}
                  >
                    <div>
                      <div className="info-value" style={{ fontWeight: '600' }}>{edu.degree}</div>
                      <div style={{ color: '#8B1538', fontWeight: '500' }}>{edu.school}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>{edu.year}</div>
                    </div>
                    {editing && (
                      <button
                        onClick={() => removeEducation(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </motion.div>
                ))
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No education added yet.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;