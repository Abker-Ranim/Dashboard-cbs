import type React from "react"
import { useRef, useEffect, useState } from "react"
import "../styles/charts.css"


interface ApiUsageData {
  name: string
  count: number
  percentage: number
  color: string
}

interface StatsData {
  successfulRequests: number
  clientErrors: number
  serverErrors: number
  errorRequests: number
}

interface ChartProps {
  stats: StatsData
  usageData: ApiUsageData[]
}

interface ChartConfig {
  chartType: "pie" | "donut"
  title: string
  description: string
  colors: string[] | null
  labels: string[] | null
  getData: (data: StatsData | ApiUsageData[]) => number[] | ApiUsageData[]
}

export const Chart: React.FC<ChartProps> = ({ stats, usageData }) => {
  const httpStatusCanvasRef = useRef<HTMLCanvasElement>(null)
  const apiUsageCanvasRef = useRef<HTMLCanvasElement>(null)
  const [httpStatusHoveredSegment, setHttpStatusHoveredSegment] = useState<number | null>(null)
  const [apiUsageHoveredSegment, setApiUsageHoveredSegment] = useState<number | null>(null)
  const [httpStatusTooltip, setHttpStatusTooltip] = useState<{
    x: number
    y: number
    data: { label: string; value: number; percentage: number; color: string }
  } | null>(null)
  const [apiUsageTooltip, setApiUsageTooltip] = useState<{
    x: number
    y: number
    data: { label: string; value: number; percentage: number; color: string }
  } | null>(null)

  const chartConfigs: Record<string, ChartConfig> = {
    "http-status": {
      chartType: "donut",
      title: "HTTP Status Distribution",
      description: "Distribution of response codes",
      colors: ["#10B981", "#F59E0B", "#EF4444", "#6B7280"],
      labels: ["2xx Success", "4xx Client", "5xx Server", "Others"],
      getData: (data: StatsData | ApiUsageData[]) => {
        const statsData = data as StatsData
        return [
          statsData.successfulRequests,
          statsData.clientErrors,
          statsData.serverErrors,
          statsData.errorRequests - statsData.clientErrors - statsData.serverErrors,
        ]
      },
    },
    "api-usage": {
      chartType: "pie",
      title: "API Usage Distribution",
      description: "Percentage of calls per API endpoint",
      colors: null,
      labels: null,
      getData: (data: StatsData | ApiUsageData[]) => {
        return data as ApiUsageData[]
      },
    },
  }

  const renderChart = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    chartData: number[] | ApiUsageData[],
    chartType: "pie" | "donut",
    colors: string[] | null,
    labels: string[] | null,
    hoveredSegment: number | null,
    setHoveredSegment: (index: number | null) => void,
    setTooltip: (tooltip: { x: number; y: number; data: { label: string; value: number; percentage: number; color: string } } | null) => void
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const centerX = rect.width / 2
    const centerY = (rect.height / 2) - 20
    const radius = Math.min(centerX, centerY)
    const innerRadius = chartType === "donut" ? radius * 0.45 : 0

    ctx.clearRect(0, 0, rect.width, rect.height)

    let currentAngle = -Math.PI / 2
    const segments: { label: string; value: number; percentage: number; color: string }[] =
      chartType === "pie"
        ? (chartData as ApiUsageData[]).map((item) => ({
            label: item.name,
            value: item.count,
            percentage: item.percentage,
            color: item.color,
          }))
        : (chartData as number[]).map((value, index) => {
            const total = (chartData as number[]).reduce((sum, val) => sum + val, 0)
            return {
              label: labels![index] || "Unknown",
              value,
              percentage: total > 0 ? (value / total) * 100 : 0,
              color: colors![index] || "#cccccc",
            }
          })

    segments.forEach((segment, index) => {
      const sliceAngle = (segment.percentage / 100) * 2 * Math.PI

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      if (innerRadius > 0) {
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
      } else {
        ctx.lineTo(centerX, centerY)
      }
      ctx.closePath()

      ctx.fillStyle = segment.color
      if (hoveredSegment === index) {
        ctx.save()
        const expandDistance = 6
        const midAngle = currentAngle + sliceAngle / 2
        const expandX = Math.cos(midAngle) * expandDistance
        const expandY = Math.sin(midAngle) * expandDistance
        ctx.translate(expandX, expandY)
        ctx.fill()
        ctx.restore()
      } else {
        ctx.fill()
      }

      ctx.strokeStyle = hoveredSegment === index ? "#ffffff" : "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 2
      ctx.stroke()

      if (segment.percentage > 10) {
        const labelAngle = currentAngle + sliceAngle / 2
        const labelRadius = innerRadius > 0 ? (radius + innerRadius) / 2 : radius * 0.65
        const labelX = centerX + Math.cos(labelAngle) * labelRadius
        const labelY = centerY + Math.sin(labelAngle) * labelRadius

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 11px Inter, sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${segment.percentage.toFixed(1)}%`, labelX, labelY)
      }

      currentAngle += sliceAngle
    })
  }

  useEffect(() => {
    renderChart(
      httpStatusCanvasRef,
      chartConfigs["http-status"].getData(stats),
      chartConfigs["http-status"].chartType,
      chartConfigs["http-status"].colors,
      chartConfigs["http-status"].labels,
      httpStatusHoveredSegment,
      setHttpStatusHoveredSegment,
      setHttpStatusTooltip
    )
    renderChart(
      apiUsageCanvasRef,
      chartConfigs["api-usage"].getData(usageData),
      chartConfigs["api-usage"].chartType,
      chartConfigs["api-usage"].colors,
      chartConfigs["api-usage"].labels,
      apiUsageHoveredSegment,
      setApiUsageHoveredSegment,
      setApiUsageTooltip
    )
  }, [httpStatusHoveredSegment, apiUsageHoveredSegment, stats, usageData])

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    chartData: number[] | ApiUsageData[],
    chartType: "pie" | "donut",
    colors: string[] | null,
    labels: string[] | null,
    setHoveredSegment: (index: number | null) => void,
    setTooltip: (tooltip: { x: number; y: number; data: { label: string; value: number; percentage: number; color: string } } | null) => void
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = (rect.height / 2) - 20
    const radius = Math.min(centerX, centerY)
    const innerRadius = chartType === "donut" ? radius * 0.45 : 0

    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)

    if (distance <= radius && distance >= innerRadius) {
      const angle = Math.atan2(y - centerY, x - centerX) + Math.PI / 2
      const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle

      let currentAngle = 0
      let segmentIndex = -1
      const segments =
        chartType === "pie"
          ? (chartData as ApiUsageData[])
          : (chartData as number[]).map((value, index) => {
              const total = (chartData as number[]).reduce((sum, val) => sum + val, 0)
              return {
                label: labels![index] || "Unknown",
                value,
                percentage: total > 0 ? (value / total) * 100 : 0,
                color: colors![index] || "#cccccc",
              }
            })

      for (let i = 0; i < segments.length; i++) {
        const sliceAngle = (segments[i].percentage / 100) * 2 * Math.PI
        if (normalizedAngle >= currentAngle && normalizedAngle < currentAngle + sliceAngle) {
          segmentIndex = i
          break
        }
        currentAngle += sliceAngle
      }

      if (segmentIndex !== -1) {
        setHoveredSegment(segmentIndex)
        setTooltip({
          x: event.clientX,
          y: event.clientY,
          data: {
            label: chartType === "pie" ? (chartData as ApiUsageData[])[segmentIndex].name : labels![segmentIndex] || "Unknown",
            value: chartType === "pie" ? (chartData as ApiUsageData[])[segmentIndex].count : (chartData as number[])[segmentIndex],
            percentage: chartType === "pie"
              ? (chartData as ApiUsageData[])[segmentIndex].percentage
              : (() => {
                  const total = (chartData as number[]).reduce((sum, val) => sum + val, 0)
                  return total > 0 ? ((chartData as number[])[segmentIndex] / total) * 100 : 0
                })(),
            color: chartType === "pie" ? (chartData as ApiUsageData[])[segmentIndex].color : colors![segmentIndex] || "#cccccc",
          },
        })
      }
    } else {
      setHoveredSegment(null)
      setTooltip(null)
    }
  }

  const handleMouseLeave = (setHoveredSegment: (index: number | null) => void, setTooltip: (tooltip: null) => void) => {
    setHoveredSegment(null)
    setTooltip(null)
  }

  return (
    <div className="charts-grid">
      {(["http-status", "api-usage"] as const).map((variant) => {
        const { chartType, title, description, colors, labels, getData } = chartConfigs[variant]
        const chartData = getData(variant === "http-status" ? stats : usageData)
        const canvasRef = variant === "http-status" ? httpStatusCanvasRef : apiUsageCanvasRef
        const hoveredSegment = variant === "http-status" ? httpStatusHoveredSegment : apiUsageHoveredSegment
        const setHoveredSegment = variant === "http-status" ? setHttpStatusHoveredSegment : setApiUsageHoveredSegment
        const tooltip = variant === "http-status" ? httpStatusTooltip : apiUsageTooltip
        const setTooltip = variant === "http-status" ? setHttpStatusTooltip : setApiUsageTooltip

        return (
          <div key={variant} className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">{title}</h3>
              <p className="chart-description">{description}</p>
            </div>
            <div className="chart-content">
              <div className="api-usage-container">
                <div className="api-chart-wrapper">
                  <canvas
                    ref={canvasRef}
                    className="api-chart-canvas"
                    onMouseMove={(e) => handleMouseMove(e, canvasRef, chartData, chartType, colors, labels, setHoveredSegment, setTooltip)}
                    onMouseLeave={() => handleMouseLeave(setHoveredSegment, setTooltip)}
                  />
                </div>
                <div className="api-legend">
                  {(() => {
                    if (chartType === "pie") {
                      return (chartData as ApiUsageData[]).map((segment, index) => (
                        <div
                          key={index}
                          className={`legend ${hoveredSegment === index ? "legend-active" : ""}`}
                          onMouseEnter={() => setHoveredSegment(index)}
                          onMouseLeave={() => setHoveredSegment(null)}
                        >
                          <div className="legend-header">
                            <div className="legend-indicator" style={{ backgroundColor: segment.color }} />
                            <span className="legend-name">{segment.name}</span>
                            <span className="legend-percentage">{segment.percentage.toFixed(1)}%</span>
                          </div>
                          <div className="legend-details">
                            <span className="legend-count">
                              {segment.count.toLocaleString()} appels
                            </span>
                          </div>
                        </div>
                      ))
                    } else {
                      const total = (chartData as number[]).reduce((sum, val) => sum + val, 0)
                      return (chartData as number[]).map((value, index) => {
                        const percentage = total > 0 ? (value / total) * 100 : 0
                        return (
                          <div
                            key={index}
                            className={`legend ${hoveredSegment === index ? "legend-active" : ""}`}
                            onMouseEnter={() => setHoveredSegment(index)}
                            onMouseLeave={() => setHoveredSegment(null)}
                          >
                            <div className="legend-header">
                              <div className="legend-indicator" style={{ backgroundColor: colors![index] || "#cccccc" }} />
                              <span className="legend-name">{labels![index] || "Unknown"}</span>
                              <span className="legend-percentage">{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="legend-details">
                              <span className="legend-count">
                                {value.toLocaleString()} requests
                              </span>
                            </div>
                          </div>
                        )
                      })
                    }
                  })()}
                </div>
                {tooltip && (
                  <div
                    className="api-tooltip"
                    style={{
                      left: tooltip.x + 10,
                      top: tooltip.y - 10,
                    }}
                  >
                    <div className="tooltip-header">
                      <div className="tooltip-color" style={{ backgroundColor: tooltip.data.color }} />
                      <span className="tooltip-label">{tooltip.data.label}</span>
                    </div>
                    <div className="tooltip-content">
                      <div className="tooltip-value">{tooltip.data.value.toLocaleString()}
                        {chartType === "pie" ? " appels" : " requests"}
                      </div>
                      <div className="tooltip-percentage">{tooltip.data.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}