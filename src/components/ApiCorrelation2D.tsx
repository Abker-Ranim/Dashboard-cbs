"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Clock,
  Calendar,
  CalendarDays,
  BarChart3,
  TrendingUp,
  Activity,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import "../styles/ApiCorrelation2D.css"
interface ApiData {
  name: string
  color: string
  data: number[]
}

interface ApiCorrelation2DProps {
  className?: string
}

export function ApiCorrelation2D({ className = "" }: ApiCorrelation2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d">("24h")
  const [selectedApi, setSelectedApi] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grouped" | "stacked" | "lines">("grouped")
  const [zoom, setZoom] = useState(1)
  const [hoveredPoint, setHoveredPoint] = useState<{ api: string; hour: number; value: number } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Données simulées pour les APIs
  const generateApiData = (period: string): ApiData[] => {
    const multiplier = period === "24h" ? 1 : period === "7d" ? 7 : 30
    const variance = period === "24h" ? 0.3 : period === "7d" ? 0.4 : 0.5

    return [
      {
        name: "getaccount",
        color: "#3B82F6",
        data: Array.from({ length: 24 }, (_, i) => {
          const baseValue = Math.max(0, 20 + Math.sin(((i - 8) * Math.PI) / 12) * 15)
          return Math.floor(baseValue * multiplier * (1 + (Math.random() - 0.5) * variance))
        }),
      },
      {
        name: "getcustomer",
        color: "#10B981",
        data: Array.from({ length: 24 }, (_, i) => {
          const baseValue = Math.max(0, 15 + Math.sin(((i - 10) * Math.PI) / 10) * 12)
          return Math.floor(baseValue * multiplier * (1 + (Math.random() - 0.5) * variance))
        }),
      },
      {
        name: "createorder",
        color: "#F59E0B",
        data: Array.from({ length: 24 }, (_, i) => {
          const baseValue = Math.max(0, 18 + Math.sin(((i - 12) * Math.PI) / 14) * 10)
          return Math.floor(baseValue * multiplier * (1 + (Math.random() - 0.5) * variance))
        }),
      },
      {
        name: "processpay",
        color: "#EF4444",
        data: Array.from({ length: 24 }, (_, i) => {
          const baseValue = Math.max(0, 12 + Math.sin(((i - 9) * Math.PI) / 11) * 8)
          return Math.floor(baseValue * multiplier * (1 + (Math.random() - 0.5) * variance))
        }),
      },
     
    
    ]
  }

  const [apiData, setApiData] = useState<ApiData[]>(() => generateApiData("24h"))

  useEffect(() => {
    setApiData(generateApiData(selectedPeriod))
  }, [selectedPeriod])

  const formatValue = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`
    }
    return value.toString()
  }

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = { top: 40, right: 40, bottom: 60, left: 80 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Fond
    ctx.fillStyle = "rgba(195, 203, 222, 0)"
    ctx.fillRect(0, 0, width, height)

    // Données filtrées
    const filteredData = selectedApi === "all" ? apiData : apiData.filter((api) => api.name === selectedApi)
    const maxValue = Math.max(...filteredData.flatMap((api) => api.data)) * zoom
    const minValue = 0

    // Grille
    ctx.strokeStyle = "rgba(148, 163, 184, 0.13)"
    ctx.lineWidth = 1

    // Lignes horizontales
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()

      // Labels Y
      const value = maxValue - (maxValue / 5) * i
      ctx.fillStyle = "rgba(203, 213, 225, 0.85)"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(formatValue(Math.round(value)), padding.left - 10, y + 4)
    }

    // Lignes verticales
    for (let i = 0; i <= 24; i += 4) {
      const x = padding.left + (chartWidth / 24) * i
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()

      // Labels X
      ctx.fillStyle = "rgba(203, 213, 225, 0.8)"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${i}h`, x, height - padding.bottom + 20)
    }

    // Dessiner selon le mode
    if (viewMode === "grouped") {
      drawGroupedBars(ctx, filteredData, padding, chartWidth, chartHeight, maxValue)
    } else if (viewMode === "stacked") {
      drawStackedBars(ctx, filteredData, padding, chartWidth, chartHeight, maxValue)
    } else {
      drawLines(ctx, filteredData, padding, chartWidth, chartHeight, maxValue)
    }

    // Titre des axes
    ctx.fillStyle = "rgba(203, 213, 225, 0.9)"
    ctx.font = "14px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Heure du jour", width / 2, height - 10)

    ctx.save()
    ctx.translate(20, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Nombre d'appels", 0, 0)
    ctx.restore()
  }

  const drawGroupedBars = (
    ctx: CanvasRenderingContext2D,
    data: ApiData[],
    padding: any,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
  ) => {
    const barWidth = (chartWidth / 24 / data.length) * 0.8
    const groupWidth = chartWidth / 24

    data.forEach((api, apiIndex) => {
      api.data.forEach((value, hour) => {
        const x = padding.left + hour * groupWidth + apiIndex * barWidth + (groupWidth - data.length * barWidth) / 2
        const barHeight = (value / maxValue) * chartHeight
        const y = padding.top + chartHeight - barHeight

        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
        gradient.addColorStop(0, api.color)
        gradient.addColorStop(1, api.color + "80")

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, barHeight)

        // Bordure
        ctx.strokeStyle = api.color
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, barWidth, barHeight)
      })
    })
  }

  const drawStackedBars = (
    ctx: CanvasRenderingContext2D,
    data: ApiData[],
    padding: any,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
  ) => {
    const barWidth = (chartWidth / 24) * 0.6

    for (let hour = 0; hour < 24; hour++) {
      let stackY = padding.top + chartHeight
      const x = padding.left + hour * (chartWidth / 24) + (chartWidth / 24 - barWidth) / 2

      data.forEach((api) => {
        const value = api.data[hour]
        const barHeight = (value / maxValue) * chartHeight
        stackY -= barHeight

        // Gradient
        const gradient = ctx.createLinearGradient(0, stackY, 0, stackY + barHeight)
        gradient.addColorStop(0, api.color)
        gradient.addColorStop(1, api.color + "80")

        ctx.fillStyle = gradient
        ctx.fillRect(x, stackY, barWidth, barHeight)

        // Bordure
        ctx.strokeStyle = api.color
        ctx.lineWidth = 1
        ctx.strokeRect(x, stackY, barWidth, barHeight)
      })
    }
  }

  const drawLines = (
    ctx: CanvasRenderingContext2D,
    data: ApiData[],
    padding: any,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
  ) => {
    data.forEach((api) => {
      ctx.strokeStyle = api.color
      ctx.lineWidth = 3
      ctx.beginPath()

      api.data.forEach((value, hour) => {
        const x = padding.left + (hour / 23) * chartWidth
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight

        if (hour === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Points
      api.data.forEach((value, hour) => {
        const x = padding.left + (hour / 23) * chartWidth
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight

        ctx.fillStyle = api.color
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()

        ctx.strokeStyle = "#1e293b"
        ctx.lineWidth = 2
        ctx.stroke()
      })
    })
  }

  useEffect(() => {
    drawChart()
  }, [apiData, selectedApi, viewMode, zoom])

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePos({ x: e.clientX, y: e.clientY })

    // Détection de survol (simplifié)
    const padding = { top: 40, right: 40, bottom: 60, left: 80 }
    const chartWidth = rect.width - padding.left - padding.right

    if (
      x >= padding.left &&
      x <= padding.left + chartWidth &&
      y >= padding.top &&
      y <= padding.top + (rect.height - padding.top - padding.bottom)
    ) {
      const hour = Math.floor(((x - padding.left) / chartWidth) * 24)
      if (hour >= 0 && hour < 24) {
        const filteredData = selectedApi === "all" ? apiData : apiData.filter((api) => api.name === selectedApi)
        if (filteredData.length > 0) {
          const api = filteredData[0]
          setHoveredPoint({
            api: api.name,
            hour,
            value: api.data[hour],
          })
        }
      }
    } else {
      setHoveredPoint(null)
    }
  }

  const totalCalls = apiData.reduce((sum, api) => sum + api.data.reduce((s, v) => s + v, 0), 0)
  const avgPerHour = Math.round(totalCalls / 24)

  return (
    <div className={`api-correlation-2d ${className}`}>
      <div className="correlation-header">
        <div className="header-content">
        <h3 className="chart-title">
              <Activity className="h-5 w-5" />
              Analyse des APIs par Heure  </h3>
          <p className="correlation-description">Visualisation 2D des appels d'APIs selon l'heure du jour</p>
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
              className={`mode-btn ${viewMode === "stacked" ? "active" : ""}`}
              onClick={() => setViewMode("stacked")}
              title="Barres empilées"
            >
              <Activity size={16} />
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
                <span className="tooltip-time">{hoveredPoint.hour}h</span>
              </div>
              <div className="tooltip-value">{formatValue(hoveredPoint.value)} appels</div>
            </div>
          </div>
        )}
      </div>

      <div className="correlation-footer">
        <div className="api-legend">
          <div className="legend-title">APIs surveillées</div>
          <div className="legend-items">
            <button
              className={`legend-item ${selectedApi === "all" ? "active" : ""}`}
              onClick={() => setSelectedApi("all")}
            >
              <span className="legend-dot all"></span>
              Toutes les APIs
            </button>
            {apiData.map((api) => (
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
                      width: `${(api.data.reduce((s, v) => s + v, 0) / totalCalls) * 100}%`,
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
  )
}
