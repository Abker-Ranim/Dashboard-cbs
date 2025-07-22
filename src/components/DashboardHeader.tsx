import React from "react";
import "../styles/dashboard.css"

export const DashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <div className="dashboard-header-content">
        <img src="/logo.png" alt="IntechGeeks Logo" className="dashboard-logo" />
        <div>
          <h1 className="dashboard-title">Dashboard API Monitoring</h1>
          <p className="dashboard-subtitle">Supervision en temps réel des requêtes API</p>
        </div>
      </div>
      <div className="dashboard-status">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span className="status-text">APIs actives - IntechGeeks</span>
        </div>
      </div>
    </div>
  )
}
