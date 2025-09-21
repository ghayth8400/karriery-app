import React, { createContext, useState, useContext } from "react";
import { translations } from "../i18n.js";

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useTranslation = () => {
  return useContext(LanguageContext);
};

export { LanguageProvider, useTranslation };