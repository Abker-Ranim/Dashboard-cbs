import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles/charts.css";
import { ApiUsageData, ChartProps, StatsData } from "types/api";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export const Chart: React.FC<ChartProps> = ({ stats, usageData }) => {
  const getHttpStatusData = (stats: StatsData) => ({
    labels: ["2xx Success", "4xx Client", "5xx Server", "Others"],
    colors: ["#10b926", "#F59E0B", "#EF4444", "#6B7280"],
    data: [
      stats.successfulRequests,
      stats.clientErrors,
      stats.serverErrors,
      stats.errorRequests - stats.clientErrors - stats.serverErrors,
    ],
  });

  const getApiUsageData = (usageData: ApiUsageData[]) => ({
    labels: usageData.map((item) => item.name),
    colors: ["#160cc6", "#0f9e0a", "#f59e0b", "#fd4040fd"],
    data: usageData.map((item) => item.count),
  });

  const getChartData = (variant: "http-status" | "api-usage") => {
    if (variant === "http-status") {
      const config = getHttpStatusData(stats);
      return {
        labels: config.labels,
        datasets: [
          {
            data: config.data,
            backgroundColor: config.colors,
            borderColor: config.colors.map((color) => color.replace("0.8", "1")),
            borderWidth: 2,
            hoverOffset: 12,
          },
        ],
      };
    } else {
      const config = getApiUsageData(usageData);
      return {
        labels: config.labels,
        datasets: [
          {
            data: config.data,
            backgroundColor: config.colors,
            borderColor: config.colors.map((color) => color.replace("0.8", "1")),
            borderWidth: 2,
            hoverOffset: 12,
          },
        ],
      };
    }
  };

  const chartOptions = (variant: "http-status" | "api-usage") => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleFont: { 
          family: "Inter, sans-serif", 
          size: 12, 
          weight: 600 as const 
        },
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
    cutout: variant === "http-status" ? "45%" : "0%", // Doughnut for http-status, pie for api-usage
  });

  const getChartConfig = (variant: "http-status" | "api-usage") => {
    if (variant === "http-status") {
      return {
        chartType: "doughnut" as const,
        title: "HTTP Status Distribution",
        description: "Distribution of response codes",
      };
    } else {
      return {
        chartType: "pie" as const,
        title: "API Usage Distribution",
        description: "Percentage of calls per API endpoint",
      };
    }
  };

  return (
    <div className="charts-grid">
      {(["http-status", "api-usage"] as const).map((variant) => {
        const config = getChartConfig(variant);
        const chartData = getChartData(variant);
        const total = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0);
        const colors = variant === "http-status" 
          ? getHttpStatusData(stats).colors 
          : getApiUsageData(usageData).colors;

        return (
          <div key={variant} className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">{config.title}</h3>
              <p className="chart-description">{config.description}</p>
            </div>
            <div className="api-usage-container">
              <div className="api-chart-wrapper">
                <Doughnut data={getChartData(variant)} options={chartOptions(variant)} />
              </div>
              <div className="api-legend">
                {chartData.labels.map((label, index) => {
                  const value = chartData.datasets[0].data[index];
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
                          {value.toLocaleString()} {config.chartType === "pie" ? "appels" : "requests"}
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