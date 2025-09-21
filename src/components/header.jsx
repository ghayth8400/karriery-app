import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../contexts/LanguageContext.jsx";

const Header = ({
  user,
  currentPage,
  onNavigate,
  onAuthClick,
  onLogout,
  isSidebarOpen,
  toggleSidebar,
  theme,
  toggleTheme,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const navItems = user
    ? [
      { key: "dashboard", label: t("dashboard"), icon: "fas fa-chart-line" },
      { key: "profile", label: t("profile"), icon: "fas fa-user" },
      ...(user?.role === "admin"
        ? [{ key: "admin", label: "Admin", icon: "fas fa-cog" }]
        : []),
    ]
    : [
      { key: "home", label: t("home"), icon: "fas fa-home" },
      { key: "services", label: t("services"), icon: "fas fa-briefcase" },
      { key: "about", label: t("about"), icon: "fas fa-info-circle" },
    ];

  const isLoggedInWithSidebar =
    user && ["dashboard", "profile", "admin"].includes(currentPage);

  return (
    <motion.header
      className={`header ${user ? "user-logged-in" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-container">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isLoggedInWithSidebar && (
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className={isSidebarOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          )}
          <motion.a
            href="#"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(user ? "dashboard" : "home");
            }}
            whileHover={{ scale: 1.05 }}
          >
            <img src="/src/assets/logo.png" alt="Karriery" />
            Karriery
          </motion.a>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <motion.a
              key={item.key}
              href={`#${item.key}`}
              className={`nav-link ${currentPage === item.key ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.key);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </motion.a>
          ))}
        </nav>

        <div className="right-menu">
          <button onClick={toggleTheme} className="theme-toggle">
            <i className={theme === "light" ? "fas fa-moon" : "fas fa-sun"}></i>
          </button>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select">
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>

          {user ? (
            <div className="user-menu">
              <motion.div
                className="user-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </motion.div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        onNavigate("profile");
                        setShowDropdown(false);
                      }}
                    >
                      <i className="fas fa-user"></i> {t("profile")}
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        onLogout();
                        setShowDropdown(false);
                      }}
                    >
                      <i className="fas fa-sign-out-alt"></i> {t("logout")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              className="auth-btn"
              onClick={onAuthClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("getStarted")}
            </motion.button>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
