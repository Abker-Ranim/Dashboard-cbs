import React from "react";
import { MetricsGrid } from "./MetricsGrid";
import { ApiTable } from "./ApiTable";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardFooter } from "./DashboardFooter";
import "../styles/dashboard.css";
import "../styles/charts.css";
import { DonutChart } from "./DonutChart";
import { useApiData } from "../hooks/useApiData";
import { RequestEvolutionChart } from "./RequestEvolutionChart";
import { ApiCorrelation2D } from "./ApiCorrelation2D";
import { ApiUsagePieChart } from "./ApiUsagePieChart";

const ApiSupervisionDashboard: React.FC = () => {
  const { apiCalls, stats, usageData, isLoading, error } = useApiData();

  if (isLoading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message" style={{ color: "red" }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-content">
        <DashboardHeader />
        <MetricsGrid stats={stats} />
        <RequestEvolutionChart />

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
              <h3 className="chart-title">API Usage Distribution</h3>
              <p className="chart-description">Percentage of calls per API endpoint</p>
            </div>
            <div className="chart-content">
              <ApiUsagePieChart data={usageData} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <ApiCorrelation2D />
        </div>
        <ApiTable apiCalls={apiCalls} />
        <DashboardFooter />
      </div>
    </div>
  );
};

export default ApiSupervisionDashboard;