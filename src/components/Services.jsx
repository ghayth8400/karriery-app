import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext.jsx';

const Services = () => {
  const { t } = useTranslation();
  const serviceItems = [
    {
      icon: 'fas fa-user-tie',
      title: t('careerCoaching'),
      description: t('careerCoachingDesc')
    },
    {
      icon: 'fas fa-file-alt',
      title: t('resumeOptimization'),
      description: t('resumeOptimizationDesc')
    },
    {
      icon: 'fas fa-comments',
      title: t('interviewPreparation'),
      description: t('interviewPreparationDesc')
    },
    {
      icon: 'fas fa-graduation-cap',
      title: t('skillDevelopment'),
      description: t('skillDevelopmentDesc')
    },
    {
      icon: 'fas fa-users',
      title: t('professionalNetworking'),
      description: t('professionalNetworkingDesc')
    },
    {
      icon: 'fas fa-chart-line',
      title: t('careerAnalytics'),
      description: t('careerAnalyticsDesc')
    }
  ];

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <section id="services" className="services">
      <div className="services-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>{t('ourServices')}</h2>
          <p>{t('servicesSubtitle')}</p>
        </motion.div>

        <div className="services-grid">
          {serviceItems.map((service, index) => (
            <motion.div
              className="service-card"
              key={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
            >
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;