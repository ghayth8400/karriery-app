import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext.jsx';

const Hero = ({ onAuthClick }) => {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-grid">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>{t('empowerYourCareer')}</h1>
            <p>
              {t('heroSubtitle')}
            </p>
            <div className="hero-cta">
              <motion.button
                className="btn btn-primary"
                onClick={onAuthClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-rocket"></i>
                {t('startYourJourney')}
              </motion.button>
              <motion.a
                href="#services"
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-play"></i>
                {t('learnMore')}
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="hero-video"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/src/assets/website-poster.jpg"
            >
              <source src="/src/assets/KARRIERY.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;