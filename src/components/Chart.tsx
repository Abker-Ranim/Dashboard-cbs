import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useMemo, useCallback } from "react";
import "../styles/charts.css";
import {ChartProps } from "types/api";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Couleurs centralisées (définies une seule fois)
const COLORS = {
  httpStatus: ["#45a842", "#F59E0B", "#EF4444", "#6B7280"], // 2xx, 4xx, 5xx, Others
  apiUsage: ["#10B981", "#EF4444", "#F59E0B", "#3B82F6"],   // getaccount, getcustomer, gethistory, dotransfer
};

export const Chart: React.FC<ChartProps> = ({ stats, usageData }) => {
  // Configuration des données pour chaque type de graphique - optimisé avec useMemo
  const getChartDataConfig = useCallback((variant: "http-status" | "api-usage") => {
    if (variant === "http-status") {
      return {
        labels: ["2xx Success", "4xx Client", "5xx Server", "Others"],
        data: [
          stats.successfulRequests,
          stats.clientErrors,
          stats.serverErrors,
          stats.errorRequests - stats.clientErrors - stats.serverErrors,
        ],
        colors: COLORS.httpStatus,
      };
    } else {
      return {
        labels: usageData.map((item) => item.name),
        data: usageData.map((item) => item.count),
        colors: COLORS.apiUsage.slice(0, usageData.length), // Utilise les couleurs disponibles
      };
    }
  }, [stats, usageData]);

  // Options de configuration du graphique - optimisé avec useMemo
  const chartOptions = useCallback((variant: "http-status" | "api-usage") => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleFont: { family: "Inter, sans-serif", size: 12, weight: 600 },
        bodyFont: { family: "Inter, sans-serif", size: 11 },
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
            return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    cutout: variant === "http-status" ? "45%" : "0%", // Doughnut pour http-status, Pie pour api-usage
  }), []);

  // Configuration du type de graphique et des métadonnées - optimisé avec useMemo
  const getChartConfig = useCallback((variant: "http-status" | "api-usage") => ({
    chartType: variant === "http-status" ? "doughnut" : "pie",
    title: variant === "http-status" ? "HTTP Status Distribution" : "API Usage Distribution",
    description: variant === "http-status" ? "Distribution of response codes" : "Percentage of calls per API endpoint",
  }), []);

  // Mémorisation des données des graphiques pour éviter les re-renders inutiles
  const chartData = useMemo(() => {
    return (["http-status", "api-usage"] as const).map((variant) => {
      const { labels, data, colors } = getChartDataConfig(variant);
      const total = data.reduce((sum, val) => sum + val, 0);
      const config = getChartConfig(variant);
      
      return {
        variant,
        labels,
        data,
        colors,
        total,
        chartType: config.chartType,
        title: config.title,
        description: config.description,
      };
    });
  }, [getChartDataConfig, getChartConfig]);

  return (
    <div className="charts-grid">
      {chartData.map((chartInfo) => {
        const { variant, labels, data, colors, total, chartType, title, description } = chartInfo;

        return (
          <div key={variant} className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">{title}</h3>
              <p className="chart-description">{description}</p>
            </div>
            <div className="api-usage-container">
              <div className="api-chart-wrapper">
                {variant === "http-status" ? (
                  <Doughnut
                    data={{
                      labels,
                      datasets: [
                        {
                          data,
                          backgroundColor: colors,
                          borderColor: Array(data.length).fill("#ffffff"), // Bordure blanche
                          borderWidth: 2,
                          hoverOffset: 12,
                        },
                      ],
                    }}
                    options={chartOptions(variant)}
                  />
                ) : (
                  <Pie
                    data={{
                      labels,
                      datasets: [
                        {
                          data,
                          backgroundColor: colors,
                          borderColor: Array(data.length).fill("#ffffff"), // Bordure blanche
                          borderWidth: 2,
                          hoverOffset: 12,
                        },
                      ],
                    }}
                    options={chartOptions(variant)}
                  />
                )}
              </div>
              <div className="api-legend">
                {labels.map((label, index) => {
                  const value = data[index];
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
                  return (
                    <div key={index} className="legend">
                      <div className="legend-header">
                        <div
                          className="legend-indicator"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="legend-name">{label}</span>
                        <span className="legend-percentage">{percentage}%</span>
                      </div>
                      <div className="legend-details">
                        <span className="legend-count">
                          {value.toLocaleString()} {chartType === "pie" ? "calls" : "requests"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};