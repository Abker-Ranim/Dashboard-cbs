import React from "react"
import { Globe, Clock, TrendingUp, Activity } from "lucide-react"
import type { ApiStats } from "../types/api"
import "../styles/metrics-grid.css"
import { formatResponseTime } from "../utils/formatters"

interface MetricsGridProps {
  stats: ApiStats
}

export const MetricsGrid = ({ stats }: MetricsGridProps) => {
  const successRate =
    stats.totalRequests > 0 ? ((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1) : "0"

  return (
    <div className="metrics-grid">
      <div className="metric-card blue">
        <div className="metric-card-header">
          <span className="metric-card-title">Total Requêtes</span>
          <Globe className="metric-card-icon" />
        </div>
        <div className="metric-card-content">
          <div className="metric-value">{stats.totalRequests.toLocaleString()}</div>
          <p className="metric-description">
            <TrendingUp className="metric-card-icon" />
            {stats.requestsPerSecond} req/sec
          </p>
        </div>
      </div>

      <div className="metric-card red">
        <div className="metric-card-header">
          <span className="metric-card-title">Taux de Succès</span>
          <TrendingUp className="metric-card-icon" />
        </div>
        <div className="metric-card-content">
          <div className="metric-value">{successRate}%</div>
          <p className="metric-description">{stats.successfulRequests} requêtes réussies</p>
        </div>
      </div>

      <div className="metric-card gray">
        <div className="metric-card-header">
          <span className="metric-card-title">Temps de Réponse</span>
          <Clock className="metric-card-icon" />
        </div>
        <div className="metric-card-content">
          <div className="metric-value">{formatResponseTime(stats.averageResponseTime)}</div>
          <p className="metric-description">Temps moyen</p>
        </div>
      </div>

    </div>
  )
}
