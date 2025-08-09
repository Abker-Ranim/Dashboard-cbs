import React from "react"
import { MetricsGrid } from "./MetricsGrid"
import { ApiTable } from "./ApiTable"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardFooter } from "./DashboardFooter"
import "../styles/dashboard.css"
import "../styles/charts.css"
import { Chart } from "./Chart"
import { useApiData } from "../hooks/useApiData"
import { RequestEvolutionChart } from "./RequestEvolutionChart"
import { ApiCorrelation2D } from "./ApiCorrelation2D"

const ApiSupervisionDashboard: React.FC = () => {
  const { apiCalls, stats, usageData, isLoading, error } = useApiData()

  if (isLoading) {
    return <div className="dashboard-container">Loading...</div>
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message" style={{ color: "red" }}>
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-content">
        <DashboardHeader />
        <MetricsGrid stats={stats} />
        <RequestEvolutionChart />
        <Chart stats={stats} usageData={usageData} />
        <div className="grid grid-cols-1 gap-6">
          <ApiCorrelation2D />
        </div>
        <ApiTable apiCalls={apiCalls} />
        <DashboardFooter />
      </div>
    </div>
  )
}

export default ApiSupervisionDashboard