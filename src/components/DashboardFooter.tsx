import React from "react";
import "../styles/dashboard.css";

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="dashboard-footer animate-fade-in">
      <div className="footer-branding">
        <img src="/logo.png" alt="IntechGeeks Logo" className="footer-logo" />
        <span className="footer-brand-text">IntechGeeks API Monitoring</span>
      </div>
      <p className="footer-sync-info">Last updated: {new Date().toLocaleString()}</p>
    </footer>
  );
};