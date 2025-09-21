import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/header.jsx';
import Hero from './components/hero.jsx';
import Services from './components/Services.jsx';
import Results from './components/results.jsx';
import Info from './components/Info.jsx';
import Dashboard from './components/Dashboard.jsx';
import Profile from './components/Profile.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import UserPreferences from './components/UserPreferences.jsx';
import SupportChat from './components/SupportChat.jsx';
import Auth from './components/Auth.jsx';
import Sidebar from './components/Sidebar.jsx';
import { useTheme } from './hooks/useTheme.js';
import dataStorage from './utils/dataStorage.js';
import './App.css';
import './auth-styles.css';
import './preferences-styles.css';

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = "636445360979-l7rhiivqvf5rnju622uehpgs4uiohgbt.apps.googleusercontent.com";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Check for stored user data using data storage system
    const currentUser = dataStorage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    dataStorage.setCurrentUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    dataStorage.clearCurrentUser();
    setCurrentPage('home');
    setSidebarOpen(false);
  };
  
  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    
    // Handle scrolling to sections when on home page
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (['services', 'about'].includes(page)) {
      // If we're navigating to a section, scroll to it smoothly
      setTimeout(() => {
        const element = document.getElementById(page);
        if (element) {
          const headerHeight = 80; // Account for fixed header
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }

  const renderContent = () => {
    const pages = {
        'home': <><Hero onAuthClick={() => setCurrentPage('login')} /><Services /><Results /><Info /></>,
        'login': <Auth onLogin={handleLogin} onClose={() => setCurrentPage('home')} isPage={true} />,
        'signup': <Auth onLogin={handleLogin} onClose={() => setCurrentPage('home')} isPage={true} defaultTab="signup" />,
        'dashboard': <Dashboard user={user} />,
        'profile': <Profile user={user} />,
        'preferences': <UserPreferences user={user} />,
        'admin': <AdminPanel user={user} />,
        'services': <Services />,
        'about': <Info />,
    };

    return pages[currentPage] || pages['home'];
  };

  const isUserLoggedIn = !!user;
  const showSidebarForPage = ['dashboard', 'profile', 'preferences', 'admin'].includes(currentPage);
  const isAuthPage = ['login', 'signup'].includes(currentPage);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className={`App ${isUserLoggedIn && showSidebarForPage ? 'dashboard-view' : ''} ${isSidebarOpen ? 'sidebar-open' : ''} ${isAuthPage ? 'auth-page-view' : ''}`}>
         {isUserLoggedIn && showSidebarForPage && (
          <Sidebar 
              user={user}
              activeSection={currentPage}
              setActiveSection={handleNavigate}
              onLogout={handleLogout}
          />
         )}
        {!isAuthPage && (
          <Header 
            user={user} 
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onAuthClick={() => setCurrentPage('login')}
            onLogout={handleLogout}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
        <AnimatePresence mode="wait">
          <motion.main
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`main-content ${isAuthPage ? 'auth-page-content' : ''}`}
          >
            {renderContent()}
          </motion.main>
        </AnimatePresence>
        
        {/* Support Chat */}
        {isUserLoggedIn && (
          <SupportChat
            user={user}
            isOpen={isSupportChatOpen}
            onClose={() => setIsSupportChatOpen(false)}
          />
        )}
        
        {/* Support Chat Toggle Button */}
        {isUserLoggedIn && (
          <motion.button
            onClick={() => setIsSupportChatOpen(!isSupportChatOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#8B1538',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(139, 21, 56, 0.3)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}
          >
            <i className="fas fa-headset"></i>
          </motion.button>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;