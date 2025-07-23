import React, { useState, useEffect } from "react";
import { Globe, Server } from "lucide-react";
import type { ApiCall } from "../types/api";
import { formatResponseTime, getStatusColor, getMethodColor } from "../utils/formatters";
import "../styles/api-table.css";
import { fetchTableData } from "../services/traceTableService";

interface ApiTableProps {
  apiCalls?: ApiCall[]; // Prop optionnelle
}

export const ApiTable: React.FC<ApiTableProps> = ({ apiCalls: propApiCalls }) => {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>(propApiCalls || []);
  const [isLoading, setIsLoading] = useState(!propApiCalls);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propApiCalls) {
      setIsLoading(false);
      return;
    }
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTableData();
        setApiCalls(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load table data");
        console.error("Load error:", err);
        setIsLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [propApiCalls]);

  const displayCalls = propApiCalls || apiCalls;

  // Ajout de logs pour le debug
  console.log("displayCalls", displayCalls);
  console.log("isLoading", isLoading);
  console.log("error", error);

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
        {error && <div className="error-message" style={{ color: "red" }}>{error}</div>}
        <table className="api-table">
          <thead>
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Duration (ms)</th>
              <th>Status</th>
              <th>Method</th>
              <th>Endpoint</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  <Server className="empty-state-icon" />
                  <p>Chargement des données...</p>
                </td>
              </tr>
            ) : displayCalls.length > 0 ? (
              displayCalls.map((call, index) => (
                <tr key={call.id} className={index === 0 ? "new-request" : ""}>
                  <td className="time-cell">{call.timestamp.toLocaleString()}</td>
                  <td className="time-cell">
                    {new Date(call.timestamp.getTime() + call.responseTime).toLocaleString()}
                  </td>
                  <td className="response-time-cell">{formatResponseTime(call.responseTime)}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(call.status)}`}>
                      {call.status} {call.status >= 200 && call.status < 400 ? "(SUCCESS)" : "(FAILURE)"}
                    </span>
                  </td>
                  <td>
                    <span className={`method-badge ${getMethodColor(call.method)}`}>{call.method}</span>
                  </td>
                  <td className="endpoint-cell">{call.endpoint}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="empty-state">
                  <Server className="empty-state-icon" />
                  <p>En attente des premières requêtes API...</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};