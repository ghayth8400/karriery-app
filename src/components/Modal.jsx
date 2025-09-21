import React from 'react';

const Modal = ({ isModalOpen, setIsModalOpen, handleFormSubmit }) => {
  return (
    <div 
      className={`modal ${isModalOpen ? 'visible' : 'hidden'}`}
      onClick={(e) => {
        if (e.target.classList.contains('modal')) {
          setIsModalOpen(false);
        }
      }}
    >
      <div className="modal-content">
        <h2>Get in Touch</h2>
        <p>Ready to transform your career? Fill out the form below and our team will reach out.</p>
        <form onSubmit={handleFormSubmit}>
          <input type="text" placeholder="Your Full Name" required />
          <input type="email" placeholder="Your Email Address" required />
          <textarea rows="4" placeholder="Your Message"></textarea>
          <br />
          <button type="submit">Send Message</button>
          <button 
            type="button" 
            className="close-btn" 
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;