import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import vid1 from '../assets/KARRIERY.mp4';
import img1 from '../assets/website-background-image-for-service-provider-comp (2).jpg';
import img2 from '../assets/website-background-image-for-service-provider-comp (2).jpg';
import { useTranslation } from '../contexts/LanguageContext.jsx';

const Results = () => {
  const { t } = useTranslation();
  return (
    <section id="results" className="results-section">
      <div className="container">
        <h2 className="section-title">{t('seeTheResults')}</h2>
        <p className="section-subtitle">
          {t('resultsSubtitle')}
        </p>

        <div className="media-gallery">
          
          <div className="main-video">
            <video className="video-element" controls poster="/src/assets/website-poster.jpg">
              <source src={vid1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="side-images">
            <div className="image-container" style={{backgroundImage: `url(${img1})`}}>
              <div className="image-overlay">
                <span>{t('beforeAndAfter')}</span>
              </div>
            </div>
            <div className="image-container" style={{backgroundImage: `url(${img2})`}}>
              <div className="image-overlay">
                <span>{t('clientSuccess')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;

