import React from "react";
import { MetricsGrid } from "./MetricsGrid";
import { ChartsGrid } from "./ChartsGrid";
import { ApiTable } from "./ApiTable";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardFooter } from "./DashboardFooter";


import "../styles/dashboard.css";
import "../styles/charts.css";
import { DonutChart } from "./DonutChart";
import { useApiData } from "../hooks/useApiData";

const ApiSupervisionDashboard: React.FC = () => {
  const { apiCalls, stats, chartData, isLoading, error } = useApiData();

  if (isLoading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-content">
        <DashboardHeader />
        <MetricsGrid stats={stats} />
        <ChartsGrid chartData={chartData} />
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">HTTP Status Distribution</h3>
              <p className="chart-description">Distribution of response codes</p>
            </div>
            <div className="chart-content">
              <DonutChart
                data={[
                  stats.successfulRequests,
                  stats.clientErrors,
                  stats.serverErrors,
                  stats.errorRequests - stats.clientErrors - stats.serverErrors,
                ]}
                colors={["#10B981", "#F59E0B", "#EF4444", "#6B7280"]}
                labels={["2xx Success", "4xx Client", "5xx Server", "Others"]}
              />
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Performance Metrics</h3>
              <p className="chart-description">Key performance indicators</p>
            </div>
            <div className="chart-content">
              <div style={{ padding: "1rem 0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "white" }}>
                      {stats.requestsPerSecond}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>Req/sec</p>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "white" }}>
                      {((stats.errorRequests / Math.max(stats.totalRequests, 1)) * 100).toFixed(1)}%
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>Error Rate</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#cbd5e1" }}>Availability</span>
                    <span style={{ color: "#10b981", fontWeight: "600" }}>
                      {stats.availability?.toFixed(1) || "99.9"}%
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#cbd5e1" }}>P95 Response Time</span>
                    <span style={{ color: "#3b82f6", fontWeight: "600" }}>
                      {stats.p95ResponseTime || 150}ms
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#cbd5e1" }}>Throughput</span>
                    <span style={{ color: "#8b5cf6", fontWeight: "600" }}>
                      {stats.throughput || 500} req/min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ApiTable apiCalls={apiCalls} />
        <DashboardFooter />
      </div>
    </div>
  );
};

export default ApiSupervisionDashboard;