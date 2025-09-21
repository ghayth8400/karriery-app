import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import './styles.css';
import './App.css';


// Google OAuth Client ID (demo purposes - this is a public test ID)
const GOOGLE_CLIENT_ID = "108598689966-5q0ksl8ac18v8j7sdb5d38f7d5j5qgaa.apps.googleusercontent.com";

const root = createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </GoogleOAuthProvider>
);

