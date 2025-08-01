import React, { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";
import "../styles/RequestEvolutionChart.css";
import type { EvolutionDataPoint } from "../types/api";
import { fetchEvolutionData } from "../services/requestEvolutionService";

interface RequestEvolutionChartProps {
  timeRange?: "24h" | "7d" | "30d";
}

export const RequestEvolutionChart = ({
  timeRange = "24h",
}: RequestEvolutionChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<EvolutionDataPoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    data: EvolutionDataPoint;
  } | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupération des données depuis le backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchEvolutionData(selectedTimeRange);
        console.log("Raw response:", response); // Débogage
        const adjustedData = response.data
          .map((item: EvolutionDataPoint) => ({
            ...item,
            time: formatTime(item.time, selectedTimeRange),
            rawTime: item.time, // Stocker le temps brut pour le tri
          }))
          .sort(
            (a, b) =>
              new Date(a.rawTime).getTime() - new Date(b.rawTime).getTime()
          ); // Tri par temps
        console.log("Adjusted data:", adjustedData); // Débogage
        setData(adjustedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedTimeRange]);
  // Fonction pour formater le temps selon la plage
  const formatTime = (timeStr: string, range: string) => {
    const date = new Date(timeStr);
    return range === "24h"
      ? date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" });
  };

  // Animation d'entrée
  useEffect(() => {
    const animate = () => {
      setAnimationProgress((prev) => {
        if (prev < 1) {
          requestAnimationFrame(animate);
          return Math.min(prev + 0.02, 1);
        }
        return 1;
      });
    };
    setAnimationProgress(0);
    animate();
  }, [data]);

  // Gestion du survol
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const padding = { top: 20, right: 40, bottom: 60, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;

    const pointIndex = Math.round(
      ((x - padding.left) / chartWidth) * (data.length - 1)
    );
    if (pointIndex >= 0 && pointIndex < data.length) {
      setHoveredPoint({
        x: x,
        y: y,
        data: data[pointIndex],
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Rendu du graphique
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0 || isLoading) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "rgba(59, 130, 246, 0.1)");
    bgGradient.addColorStop(1, "rgba(15, 23, 42, 0.1)");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    const maxTotal = Math.max(...data.map((d) => d.total));
    const maxSuccess = Math.max(...data.map((d) => d.success));
    const maxErrors = Math.max(...data.map((d) => d.errors));
    const maxValue = Math.max(maxTotal, maxSuccess, maxErrors);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "12px Inter";
      ctx.textAlign = "right";
      const value = Math.round(maxValue * (1 - i / 5));
      ctx.fillText(value.toString(), padding.left - 10, y + 4);
    }

    const step = Math.max(1, Math.floor(data.length / 8));
    for (let i = 0; i < data.length; i += step) {
      const x = padding.left + (chartWidth / (data.length - 1)) * i;
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "11px Inter";
      ctx.textAlign = "center";
      ctx.fillText(data[i].time, x, height - padding.bottom + 20);
    }

    const drawCurve = (
      values: number[],
      color: string,
      fillColor: string,
      animated = true
    ) => {
      if (values.length === 0) return;

      const points = values.map((value, index) => ({
        x: padding.left + (chartWidth / (values.length - 1)) * index,
        y: padding.top + chartHeight - (value / maxValue) * chartHeight,
      }));

      const animatedPoints = animated
        ? points.slice(0, Math.floor(points.length * animationProgress))
        : points;

      if (animatedPoints.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(animatedPoints[0].x, height - padding.bottom);
      animatedPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.lineTo(point.x, point.y);
        } else {
          const prevPoint = animatedPoints[index - 1];
          const cpx1 = prevPoint.x + (point.x - prevPoint.x) * 0.3;
          const cpx2 = point.x - (point.x - prevPoint.x) * 0.3;
          ctx.bezierCurveTo(cpx1, prevPoint.y, cpx2, point.y, point.x, point.y);
        }
      });
      ctx.lineTo(
        animatedPoints[animatedPoints.length - 1].x,
        height - padding.bottom
      );
      ctx.closePath();

      const gradient = ctx.createLinearGradient(
        0,
        padding.top,
        0,
        height - padding.bottom
      );
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, fillColor.replace(/[\d.]+\)$/g, "0)"));
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      animatedPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          const prevPoint = animatedPoints[index - 1];
          const cpx1 = prevPoint.x + (point.x - prevPoint.x) * 0.3;
          const cpx2 = point.x - (point.x - prevPoint.x) * 0.3;
          ctx.bezierCurveTo(cpx1, prevPoint.y, cpx2, point.y, point.x, point.y);
        }
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      animatedPoints.forEach((point, index) => {
        if (index % 3 === 0 || index === animatedPoints.length - 1) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = color.replace(/[\d.]+\)$/g, "0.2)");
          ctx.fill();

          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "white";
          ctx.fill();
        }
      });
    };

    drawCurve(
      data.map((d) => d.success),
      "#10B981",
      "rgba(16, 185, 129, 0.3)"
    );
    drawCurve(
      data.map((d) => d.errors),
      "#EF4444",
      "rgba(239, 68, 68, 0.3)"
    );

    const legendY = height - 30;
    ctx.font = "12px Inter";
    ctx.textAlign = "left";

    ctx.fillStyle = "#10B981";
    ctx.fillRect(padding.left, legendY, 12, 12);
    ctx.fillStyle = "white";
    ctx.fillText("Succès", padding.left + 20, legendY + 9);

    ctx.fillStyle = "#EF4444";
    ctx.fillRect(padding.left + 100, legendY, 12, 12);
    ctx.fillStyle = "white";
    ctx.fillText("Erreurs", padding.left + 120, legendY + 9);
  }, [data, animationProgress, isLoading]);

  const totalRequests = data.reduce((sum, d) => sum + d.total, 0);
  const totalSuccess = data.reduce((sum, d) => sum + d.success, 0);
  const totalErrors = data.reduce((sum, d) => sum + d.errors, 0);
  const successRate =
    totalRequests > 0 ? (totalSuccess / totalRequests) * 100 : 0;
  const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

  const midPoint = Math.floor(data.length / 2);
  const firstHalf =
    data.slice(0, midPoint).reduce((sum, d) => sum + d.total, 0) / midPoint;
  const secondHalf =
    data.slice(midPoint).reduce((sum, d) => sum + d.total, 0) /
    (data.length - midPoint);
  const trend = secondHalf > firstHalf ? "up" : "down";
  const trendPercentage = Math.abs(
    ((secondHalf - firstHalf) / firstHalf) * 100
  );

  if (isLoading) {
    return (
      <div className="request-evolution-container">
        <div className="chart-header">
          <div className="header-content">
            <div className="title-section">
              <h3 className="chart-title">
                <Activity className="h-5 w-5" />
                Évolution des Requêtes
              </h3>
              <p className="chart-description">Chargement des données...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="request-evolution-container">
        <div className="chart-header">
          <div className="header-content">
            <div className="title-section">
              <h3 className="chart-title">
                <Activity className="h-5 w-5" />
                Évolution des Requêtes
              </h3>
              <p className="chart-description" style={{ color: "red" }}>
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-evolution-container">
      <div className="chart-header">
        <div className="header-content">
          <div className="title-section">
            <h3 className="chart-title">
              <Activity className="h-5 w-5" />
              Évolution des Requêtes
            </h3>
            <p className="chart-description">
              Analyse temporelle des succès et échecs
            </p>
          </div>

          <div className="time-selector">
            <button
              className={selectedTimeRange === "24h" ? "active" : ""}
              onClick={() => setSelectedTimeRange("24h")}
            >
              24h
            </button>
            <button
              className={selectedTimeRange === "7d" ? "active" : ""}
              onClick={() => setSelectedTimeRange("7d")}
            >
              7j
            </button>
            <button
              className={selectedTimeRange === "30d" ? "active" : ""}
              onClick={() => setSelectedTimeRange("30d")}
            >
              30j
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item success">
            <div className="stat-icon">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{successRate.toFixed(1)}%</div>
              <div className="stat-label">Taux de succès</div>
            </div>
          </div>

          <div className="stat-item error">
            <div className="stat-icon">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{errorRate.toFixed(1)}%</div>
              <div className="stat-label">Taux d'erreur</div>
            </div>
          </div>

          <div className="stat-item trend">
            <div className="stat-icon">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="stat-content">
              <div className={`stat-value ${trend}`}>
                {trend === "up" ? "+" : "-"}
                {trendPercentage.toFixed(1)}%
              </div>
              <div className="stat-label">Tendance</div>
            </div>
          </div>

          <div className="stat-item total">
            <div className="stat-icon">
              <Clock className="h-4 w-4" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{totalRequests.toLocaleString()}</div>
              <div className="stat-label">Total requêtes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <canvas
          ref={canvasRef}
          className="evolution-canvas"
          width={800}
          height={400}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {hoveredPoint && (
          <div
            className="tooltip"
            style={{
              left: hoveredPoint.x,
              top: hoveredPoint.y - 80,
            }}
          >
            <div className="tooltip-time">{hoveredPoint.data.time}</div>
            <div className="tooltip-stats">
              <div className="tooltip-stat success">
                <span className="dot"></span>
                Succès: {hoveredPoint.data.success}
              </div>
              <div className="tooltip-stat error">
                <span className="dot"></span>
                Erreurs: {hoveredPoint.data.errors}
              </div>
              <div className="tooltip-total">
                Total: {hoveredPoint.data.total}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chart-insights">
        <div className="insight-card">
          <div className="insight-icon">📈</div>
          <div className="insight-content">
            <div className="insight-title">Pic d'activité</div>
            <div className="insight-text">
              Maximum de {Math.max(...data.map((d) => d.total))} requêtes/h
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">⚡</div>
          <div className="insight-content">
            <div className="insight-title">Performance</div>
            <div className="insight-text">
              {successRate > 95
                ? "Excellente"
                : successRate > 90
                ? "Bonne"
                : "À améliorer"}
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">🎯</div>
          <div className="insight-content">
            <div className="insight-title">Stabilité</div>
            <div className="insight-text">
              {errorRate < 5
                ? "Très stable"
                : errorRate < 10
                ? "Stable"
                : "Instable"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
