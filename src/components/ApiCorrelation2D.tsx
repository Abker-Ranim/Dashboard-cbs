import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, PointElement, LineElement, Tooltip, LinearScale, CategoryScale } from "chart.js";
import { Activity} from "lucide-react";
import "../styles/ApiCorrelation2D.css";
import { fetchEndpointCalls } from "../services/endpointCallService";
import { ApiCorrelation2DProps, EndpointData } from "types/api";

// Register Chart.js components
ChartJS.register(BarElement, PointElement, LineElement, Tooltip, LinearScale, CategoryScale);

export function ApiCorrelation2D({ className = "" }: ApiCorrelation2DProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d">("24h");
  const [selectedApi, setSelectedApi] = useState<string>("all");
  const [data, setData] = useState<EndpointData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchEndpointCalls(selectedPeriod);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedPeriod]);

  // Format value for display
  const formatValue = (value: number): string => {
    if (!isFinite(value) || isNaN(value)) return "0";
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  // Prepare chart data
  const prepareChartData = () => {
    const apiData = data.map((item, index) => ({
      name: item.name,
      color: ["#10B981", "#EF4444", "#F59E0B", "#3B82F6"][index % 4],
      total: item.total,
    }));

    const filteredData = selectedApi === "all" ? apiData : apiData.filter((api) => api.name === selectedApi);

    return {
      labels: filteredData.map((api) => api.name),
      datasets: [
        {
          label: "", // Empty label to remove title
          data: filteredData.map((api) => api.total),
          backgroundColor: filteredData.map((api) => api.color),
          borderColor: filteredData.map((api) => api.color.replace(/0\.\d+/, "1")),
          borderWidth: 1,
          barPercentage: 0.8,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Disable legend to remove the orange rectangle
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleFont: { family: "Inter, sans-serif", size: 13, weight: "bold" as const },
        bodyFont: { family: "Inter, sans-serif", size: 12 },
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${formatValue(context.raw)} calls`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Endpoints", color: "rgba(203, 213, 225, 0.9)", font: { family: "Inter, sans-serif", size: 14 } },
        grid: { display: false },
        ticks: { color: "rgba(203, 213, 225, 0.9)", font: { family: "Inter, sans-serif", size: 12 } },
      },
      y: {
        title: { display: true, text: "Total number of calls", color: "rgba(203, 213, 225, 0.9)", font: { family: "Inter, sans-serif", size: 14 } },
        grid: { color: "rgba(148, 163, 184, 0.13)" },
        ticks: {
          color: "rgba(203, 213, 225, 0.85)",
          font: { family: "Inter, sans-serif", size: 12 },
          callback: function (tickValue: string | number) {
            const value = typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
            return formatValue(Math.round(value));
          },
        },
      },
    },
  };

  const totalCalls = data.reduce((sum, d) => sum + d.total, 0);

  if (isLoading) {
    return (
      <div className={`api-correlation-2d ${className}`}>
        <div className="correlation-header">
          <div className="header-content">
            <h3 className="chart-title">
              <Activity className="h-5 w-5" />
              API Analysis
            </h3>
            <p className="correlation-description">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`api-correlation-2d ${className}`}>
        <div className="correlation-header">
          <div className="header-content">
            <h3 className="chart-title">
              <Activity className="h-5 w-5" />
              API Analysis
            </h3>
            <p className="correlation-description" style={{ color: "red" }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`api-correlation-2d ${className}`}>
      <div className="correlation-header">
        <div className="header-content">
                      <h3 className="chart-title">
              <Activity className="h-5 w-5" />
              API Analysis
            </h3>
                      <p className="correlation-description">API calls visualization by period</p>
        </div>
        <div className="controls-section">
          <div className="period-selector">
            {["24h", "7d", "30d"].map((period) => (
              <button
                key={period}
                className={`period-btn ${selectedPeriod === period ? "active" : ""}`}
                onClick={() => setSelectedPeriod(period as "24h" | "7d" | "30d")}
              >
                {period}
              </button>
            ))}
          </div>
        
        </div>
      </div>
      <div className="chart-container">
        <Bar data={prepareChartData()} options={chartOptions} />
      </div>
      <div className="correlation-footer">
        <div className="api-legend">
          <div className="legend-title">Monitored endpoints</div>
          <div className="legend-items">
            <button
              className={`legend-item ${selectedApi === "all" ? "active" : ""}`}
              onClick={() => setSelectedApi("all")}
            >
              <span className="legend-dot all"></span>
              All endpoints
            </button>
            {prepareChartData().labels.map((name, index) => (
              <button
                key={name}
                className={`legend-item ${selectedApi === name ? "active" : ""}`}
                onClick={() => setSelectedApi(name)}
              >
                <span className="legend-dot" style={{ backgroundColor: prepareChartData().datasets[0].backgroundColor[index] }}></span>
                {name}
                <div className="legend-bar">
                  <div
                    className="legend-fill"
                    style={{
                      width: `${totalCalls > 0 ? (Number(prepareChartData().datasets[0].data[index]) / totalCalls) * 100 : 0}%`,
                      backgroundColor: prepareChartData().datasets[0].backgroundColor[index],
                    }}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}