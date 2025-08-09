import "../styles/dashboard.css"

export const DashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <div className="dashboard-header-content">
        <img src="/logo.png" alt="IntechGeeks Logo" className="dashboard-logo" />
        <div>
          <h1 className="dashboard-title">Dashboard API Monitoring</h1>
          <p className="dashboard-subtitle">Real-time API request supervision</p>
        </div>
      </div>
      <div className="dashboard-status">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span className="status-text">Active APIs - IntechGeeks</span>
        </div>
      </div>
    </div>
  )
}
