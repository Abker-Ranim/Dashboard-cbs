import React, { useState, useEffect } from "react";
import { Globe, Server } from "lucide-react";
import type { ApiCall } from "../types/api";
import { formatResponseTime } from "../utils/formatters"; 
import "../styles/api-table.css";
import { fetchTableData } from "../services/traceTableService";

interface ApiTableProps {
  apiCalls?: ApiCall[]; // Prop optionnelle
}

export const ApiTable: React.FC<ApiTableProps> = ({ apiCalls: propApiCalls }) => {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>(propApiCalls || []);
  const [isLoading, setIsLoading] = useState(!propApiCalls);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page

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

  // Logique de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayCalls.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayCalls.length / itemsPerPage);

  // Changement de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Ajout de logs pour le debug
  console.log("displayCalls", displayCalls);
  console.log("currentItems", currentItems);
  console.log("isLoading", isLoading);
  console.log("error", error);
  console.log("currentPage", currentPage);
  console.log("totalPages", totalPages);

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
              <th>Method</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Duration </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  <Server className="empty-state-icon" />
                  <p>Chargement des données...</p>
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((call, index) => (
                <tr key={call.id}>
                  <td>
                    <span className={`method-badge ${call.name}`}>{call.name}</span>
                  </td>
                  <td className="time-cell">{call.timestamp.toLocaleString()}</td>
                  <td className="time-cell">
                    {new Date(call.timestamp.getTime() + call.responseTime).toLocaleString()}
                  </td>
                  <td className="response-time-cell">{formatResponseTime(call.responseTime)}</td>
                  <td>
                    <span
                      className={`status-badge ${call.status >= 200 && call.status < 400 ? "status-success" : call.status >= 400 && call.status < 500 ? "status-client-error" : "status-other"}`}
                    >
                      {call.status} {call.status >= 200 && call.status < 400 ? "(SUCCESS)" : "(FAILURE)"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-state">
                  <Server className="empty-state-icon" />
                  <p>En attente des premières requêtes API...</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`pagination-button ${currentPage === page ? "active" : ""}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};