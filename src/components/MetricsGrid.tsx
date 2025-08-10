import { Globe, Clock, TrendingUp } from "lucide-react";
import type { ApiStats } from "../types/api";
import "../styles/metrics-grid.css";

const formatResponseTime = (ms: number): string => {
  return `${ms.toFixed(3)} ms`;
};

interface MetricsGridProps {
  stats: ApiStats;
}

export const MetricsGrid = ({ stats }: MetricsGridProps) => {
  const successRate =
    stats.totalRequests > 0
      ? ((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)
      : "0";

  return (
    <div className="metrics-grid">
      <div className="metric-card blue">
        <div className="metric-card-header">
          <span className="metric-card-title">Total Requests</span>
          <Globe className="metric-card-icon" />
        </div>
        <div className="metric-card-content">
          <div className="metric-value">
            {stats.totalRequests.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="metric-card red">
        <div className="metric-card-header">
          <span className="metric-card-title">Success Rate</span>
          <TrendingUp className="metric-card-icon" />
        </div>
        <div className="metric-card-content">
          <div className="metric-value">{successRate}%</div>
          <p className="metric-description">
            {stats.successfulRequests} successful requests
          </p>
        </div>
      </div>

      <div className="metric-card gray">
        <div className="metric-card-header">
          <span className="metric-card-title">Response Time</span>
          <Clock className="metric-card-icon" />
        </div>
        <div className="metric-card-content">
          <div className="metric-value">
            {formatResponseTime(stats.averageResponseTime)}
          </div>
          <p className="metric-description">Average time</p>
        </div>
      </div>
    </div>
  );
};
