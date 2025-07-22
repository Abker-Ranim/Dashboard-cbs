import React from "react"
import { Zap, Clock, Server } from "lucide-react"
import type { ChartData } from "../types/api"
import { LineChart } from "./LineChart"
import "../styles/charts.css"

interface ChartsGridProps {
  chartData: ChartData
}

export const ChartsGrid = ({ chartData }: ChartsGridProps) => {
  return (
    <div className="charts-grid">
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">
            <Zap className="h-4 w-4" />
            Requêtes/Minute
          </h3>
          <p className="chart-description">Trafic API en temps réel</p>
        </div>
        <div className="chart-content">
          <LineChart data={chartData.requestsPerMinute} color="#3B82F6" height={120} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">
            <Clock className="h-4 w-4" />
            Temps de Réponse
          </h3>
          <p className="chart-description">Performance des APIs</p>
        </div>
        <div className="chart-content">
          <LineChart data={chartData.responseTime} color="#EF4444" height={120} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">
            <Server className="h-4 w-4" />
            Taux d'Erreur
          </h3>
          <p className="chart-description">Erreurs par minute</p>
        </div>
        <div className="chart-content">
          <LineChart data={chartData.errorRate} color="#F59E0B" height={120} />
        </div>
      </div>
    </div>
  )
}
