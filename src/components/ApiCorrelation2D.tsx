"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { BarChart3, TrendingUp, Activity } from "lucide-react";
import "../styles/ApiCorrelation2D.css";
import { fetchEndpointCalls, EndpointData, EndpointResponse } from "../services/endpointCallService";

interface ApiCorrelation2DProps {
  className?: string;
}

export function ApiCorrelation2D({ className = "" }: ApiCorrelation2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d">("24h");
  const [selectedApi, setSelectedApi] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grouped" | "lines">("grouped");
  const [hoveredPoint, setHoveredPoint] = useState<{ api: string; index: number; value: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [data, setData] = useState<EndpointData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données depuis le backend
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

  // Formater la valeur
  const formatValue = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  // Préparer les données pour le graphique avec un seul point par endpoint
  const prepareApiData = (): { name: string; color: string; data: number[] }[] => {
    if (data.length === 0) return [];

    return data.map((item, index) => ({
      name: item.name,
      color: [  "rgba(244, 244, 21, 0.72)",   // #f59e0b
        "rgba(239, 68, 68, 0.62)",    // #f13737
        "rgba(60, 255, 60, 0.73)",    // #10b951
        "rgba(11, 77, 245, 0.7)",    // #0b4df5
        "rgba(11, 77, 245, 0.7)"][index % 5],
      data: [item.total], // Un seul point par endpoint
    }));
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || isLoading) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 40, right: 40, bottom: 60, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.fillStyle = "rgba(195, 203, 222, 0)";
    ctx.fillRect(0, 0, width, height);

    const apiData = prepareApiData();
    const filteredData = selectedApi === "all" ? apiData : apiData.filter((api) => api.name === selectedApi);
    const maxValue = Math.max(...filteredData.flatMap((api) => api.data));
    const minValue = 0;

    ctx.strokeStyle = "rgba(148, 163, 184, 0.13)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      const value = maxValue - (maxValue / 5) * i;
      ctx.fillStyle = "rgba(203, 213, 225, 0.85)";
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(formatValue(Math.round(value)), padding.left - 10, y + 4);
    }

    const dataPoints = filteredData.length; // Nombre d'endpoints
    const barWidth = chartWidth / (dataPoints > 0 ? dataPoints : 1);

    for (let i = 0; i <= dataPoints; i++) {
      const x = padding.left + i * barWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartHeight);
      ctx.stroke();
    }

    if (viewMode === "grouped") {
      drawGroupedBars(ctx, filteredData, padding, chartWidth, chartHeight, maxValue, barWidth);
    } else {
      drawLines(ctx, filteredData, padding, chartWidth, chartHeight, maxValue, barWidth);
    }

    ctx.fillStyle = "rgba(203, 213, 225, 0.9)";
    ctx.font = "14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Endpoints", width / 2, height - 10);

    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Nombre total d'appels", 0, 0);
    ctx.restore();
  };

  const drawGroupedBars = (
    ctx: CanvasRenderingContext2D,
    data: { name: string; color: string; data: number[] }[],
    padding: any,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
    barWidth: number,
  ) => {
    data.forEach((api, index) => {
      const value = api.data[0];
      const x = padding.left + index * barWidth;
      const barHeight = (value / maxValue) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      ctx.fillStyle = api.color;
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);

      ctx.strokeStyle = api.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barWidth * 0.8, barHeight);
    });
  };

  const drawLines = (
    ctx: CanvasRenderingContext2D,
    data: { name: string; color: string; data: number[] }[],
    padding: any,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
    barWidth: number,
  ) => {
    data.forEach((api, index) => {
      const value = api.data[0];
      const x = padding.left + index * barWidth;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = api.color;
      ctx.fill();
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  useEffect(() => {
    drawChart();
  }, [data, selectedApi, viewMode, isLoading]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x: e.clientX, y: e.clientY });

    const padding = { top: 40, right: 40, bottom: 60, left: 80 };
    const chartWidth = rect.width - padding.left - padding.right;

    if (
      x >= padding.left &&
      x <= padding.left + chartWidth &&
      y >= padding.top &&
      y <= padding.top + (rect.height - padding.top - padding.bottom)
    ) {
      const index = Math.floor((x - padding.left) / (chartWidth / (data.length > 0 ? data.length : 1)));
      if (index >= 0 && index < (data.length > 0 ? data.length : 1)) {
        const apiData = prepareApiData();
        const api = apiData[index];
        setHoveredPoint({
          api: api.name,
          index: index,
          value: api.data[0],
        });
      }
    } else {
      setHoveredPoint(null);
    }
  };

  const totalCalls = data.reduce((sum, d) => sum + d.total, 0);
  const avgPerPeriod = data.length > 0 ? Math.round(totalCalls / data.length) : 0;

  if (isLoading) {
    return (
      <div className={`api-correlation-2d ${className}`}>
        <div className="correlation-header">
          <div className="header-content">
            <h3 className="chart-title">
              <Activity className="h-5 w-5" />
              Analyse des APIs
            </h3>
            <p className="correlation-description">Chargement des données...</p>
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
              Analyse des APIs
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
            Analyse des APIs
          </h3>
          <p className="correlation-description">Visualisation des appels d'APIs par période</p>
        </div>

        <div className="controls-section">
          <div className="period-selector">
            <button
              className={`period-btn ${selectedPeriod === "24h" ? "active" : ""}`}
              onClick={() => setSelectedPeriod("24h")}
            >
              24h
            </button>
            <button
              className={`period-btn ${selectedPeriod === "7d" ? "active" : ""}`}
              onClick={() => setSelectedPeriod("7d")}
            >
              7d
            </button>
            <button
              className={`period-btn ${selectedPeriod === "30d" ? "active" : ""}`}
              onClick={() => setSelectedPeriod("30d")}
            >
              30d
            </button>
          </div>

          <div className="view-mode-selector">
            <button
              className={`mode-btn ${viewMode === "grouped" ? "active" : ""}`}
              onClick={() => setViewMode("grouped")}
              title="Barres groupées"
            >
              <BarChart3 size={16} />
            </button>
            <button
              className={`mode-btn ${viewMode === "lines" ? "active" : ""}`}
              onClick={() => setViewMode("lines")}
              title="Lignes"
            >
              <TrendingUp size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <canvas
          ref={canvasRef}
          className="correlation-canvas"
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        />

        {hoveredPoint && (
          <div
            className="tooltip"
            style={{
              left: mousePos.x + 10,
              top: mousePos.y - 10,
            }}
          >
            <div className="tooltip-content">
              <div className="tooltip-header">
                <span className="tooltip-api">{hoveredPoint.api}</span>
              </div>
              <div className="tooltip-value">{formatValue(hoveredPoint.value)} appels</div>
            </div>
          </div>
        )}
      </div>

      <div className="correlation-footer">
        <div className="api-legend">
          <div className="legend-title">Endpoints surveillés</div>
          <div className="legend-items">
            <button
              className={`legend-item ${selectedApi === "all" ? "active" : ""}`}
              onClick={() => setSelectedApi("all")}
            >
              <span className="legend-dot all"></span>
              Tous les endpoints
            </button>
            {prepareApiData().map((api) => (
              <button
                key={api.name}
                className={`legend-item ${selectedApi === api.name ? "active" : ""}`}
                onClick={() => setSelectedApi(api.name)}
              >
                <span className="legend-dot" style={{ backgroundColor: api.color }}></span>
                {api.name}
                <div className="legend-bar">
                  <div
                    className="legend-fill"
                    style={{
                      width: `${(api.data[0] / totalCalls) * 100}%`,
                      backgroundColor: api.color,
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