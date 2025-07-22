import React from "react"
import { Globe, Server } from "lucide-react"
import type { ApiCall } from "../types/api"
import { formatResponseTime, getStatusColor, getMethodColor } from "../utils/formatters"
import "../styles/api-table.css"

interface ApiTableProps {
  apiCalls: ApiCall[]
}

export const ApiTable = ({ apiCalls }: ApiTableProps) => {
  return (
    <div className="api-table-container">
      <div className="api-table-header">
        <h3 className="api-table-title">
          <Globe className="h-5 w-5 text-red-500" />
          Requêtes API Récentes - IntechGeeks
        </h3>
        <p className="api-table-description">Historique en temps réel des dernières requêtes</p>
      </div>

      <div className="api-table-wrapper">
        <table className="api-table">
          <thead>
            <tr>
              <th>Heure</th>
              <th>Méthode</th>
              <th>Endpoint</th>
              <th>Service</th>
              <th>Statut</th>
              <th>Temps</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {apiCalls.map((call, index) => (
              <tr key={call.id} className={index === 0 ? "new-request" : ""}>
                <td className="time-cell">{call.timestamp.toLocaleTimeString()}</td>
                <td>
                  <span className={`method-badge ${getMethodColor(call.method)}`}>{call.method}</span>
                </td>
                <td className="endpoint-cell">{call.endpoint}</td>
                <td className="service-cell">{call.service}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(call.status)}`}>{call.status}</span>
                </td>
                <td className="response-time-cell">{formatResponseTime(call.responseTime)}</td>
                <td className="ip-cell">{call.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {apiCalls.length === 0 && (
          <div className="empty-state">
            <Server className="empty-state-icon" />
            <p>En attente des premières requêtes API...</p>
          </div>
        )}
      </div>
    </div>
  )
}
