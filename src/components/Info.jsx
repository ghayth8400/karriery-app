import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext.jsx';

const Info = () => {
  const { t } = useTranslation();
  const features = [
    {
      title: t('aiPoweredGuidance'),
      description: t('aiPoweredGuidanceDesc'),
      image: '/src/assets/industry-connections.jpg'
    },
    {
      title: t('industryConnections'),
      description: t('industryConnectionsDesc'),
      image: '/src/assets/skill-assessment.jpg'
    },
    {
      title: t('skillAssessment'),
      description: t('skillAssessmentDesc'),
      image: '/src/assets/future-proof-skills.jpg'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer at Google',
      content: 'Karriery helped me transition from a junior developer to a senior engineer in just 18 months. The personalized coaching was invaluable.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager at Microsoft',
      content: 'The networking opportunities and skill development programs at Karriery opened doors I never knew existed.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist at Tesla',
      content: 'From resume optimization to interview prep, Karriery provided comprehensive support throughout my job search.',
      rating: 5
    }
  ];

  return (
    <>
      {/* Features Section */}
      <section id="about" className="about-features-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>{t('whyChooseKarriery')}</h2>
            <p>
              {t('whyChooseSubtitle')}
            </p>
          </motion.div>

          <div style={{ display: 'grid', gap: '4rem' }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: index % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                  gap: '3rem',
                  alignItems: 'center'
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div style={{ order: index % 2 === 0 ? 1 : 2 }}>
                  <motion.img
                    src={feature.image}
                    alt={feature.title}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                    }}
                    whileHover={{ scale: 1.02 }}
                  />
                </div>
                <div style={{ order: index % 2 === 0 ? 2 : 1 }}>
                  <h3 className="about-feature-title">
                    {feature.title}
                  </h3>
                  <p style={{ 
                    fontSize: '1.1rem', 
                    color: 'var(--text-color-light)', 
                    lineHeight: '1.7',
                    marginBottom: '2rem'
                  }}>
                    {feature.description}
                  </p>
                  <motion.button 
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('learnMore')}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="about-testimonials-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>{t('successStories')}</h2>
            <p>
              {t('successStoriesSubtitle')}
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="about-testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="fas fa-star" style={{ color: '#ffc107' }}></i>
                  ))}
                </div>
                <p className="about-testimonial-content">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="about-testimonial-name">
                    {testimonial.name}
                  </div>
                  <div className="about-testimonial-role">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="about-contact-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              {t('readyToTransform')}
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
              {t('readyToTransformSubtitle')}
            </p>
            <motion.button 
              className="btn btn-primary"
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-rocket"></i>
              {t('getStartedToday')}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
};


export default Info;